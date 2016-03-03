var crypto = require('crypto'),
  util = require('./util');
const MAX_PAYLOAD_SIZE = 10 * 1024 * 1024;  // 10MB
/**
 * This is the Appscene.io webhook that will validate any incoming webhook requests.
 * Note that the connect middleware can work both with a path or just a simple middleware.
 * The accepted options are:
 *    path - the path to listen to.
 *    secret - the webhook secret.
 *    events - array of events or single event to listen to.
 *
 * The actual event payload will be attached to the request, under req.body
* */
function connectMiddleware(opt) {
  opt = (typeof opt === 'object' && opt ? opt : {});
  var path = (typeof opt.path === 'string' && opt.path ? opt.path : null),
    secret = (typeof opt.secret === 'string' && opt.secret ? opt.secret : null);
  var events = [];
  if(typeof opt.events === 'string' && opt.events) {
    events = opt.events.split(' ');
  } else if(opt.events instanceof Array) {
    events = opt.events;
  }
  return function appsceneMiddleware(req, res, next) {
    if(req.method !== 'POST') return next();
    /* Check the URL matching */
    if (path) {
      if(path.indexOf('?') !== -1 && req.url !== path) return next();
      if(path !== req.path) return next();
    }
    var event = req.headers['x-appscene-event'] || null,
      signature = req.headers['x-appscene-signature'] || null;
    if(typeof event !== 'string' || event === '') {
      return next(util.error('INVALID_EVENT', 'Invalid event header from appscene.'));
    }
    /* Listen only for application/json or application/javascript */
    if(req.headers['content-type'] !== 'application/json' && req.headers['content-type'] !== 'application/javascript') {
      return next(util.error('INVALID_CONTENT', 'Invalid contentType for appscene webhook'));
    }
    /* Check if we have a secret */
    if(secret && (typeof signature !== 'string' || !signature)) {
      return next(util.error('MISSING_SIGNATURE', 'Missing appscene signature'));
    }
    /* Check if we've subscribed for a specific event */
    if(events.length !== 0) {
      var hasEvent = false;
      for(var i=0; i < events.length; i++) {
        if(events[i].toLowerCase() === event.toLowerCase()) {
          hasEvent = true;
          break;
        }
      }
      if(!hasEvent) return next();
    }
    readPayload(req, function(err, payloadObj, payloadString) {
      if(err) return next(err);
      /* Check if we have to compare signatures */
      if(secret && !verifySignature(secret, signature, payloadString)) {
        return next(util.error('INVALID_SIGNATURE', 'Invalid appscene payload signature.'));
      }
      req.body = payloadObj;
      return next();
    });
  };
}

/*
* Reads incoming bytes, and callsback with payloadObject and payloadString
* */
function readPayload(req, done) {
  // already parsed body
  var payloadString = '', payload;
  if(typeof req.body === 'object' && req.body) {
    try {
      payloadString = JSON.stringify(req.body);
    } catch(e) {
      return done(util.error('PAYLOAD_ERROR', 'Appscene failed to parse payload.'));
    }
    return done(null, req.body, payloadString);
  }
  // Read the incoming data and parse it.
  function onData(d) {
    payloadString += d.toString();
    if(payloadString.length > MAX_PAYLOAD_SIZE) {
      req.removeListener('data', onData);
      req.removeListener('end', onEnd);
      return done(util.error('PAYLOAD_TOO_LARGE', 'The appscene webhook payload is too large.'));
    }
  }
  function onEnd() {
    req.removeListener('data', onData);
    req.removeListener('end', onEnd);
    payloadString = payloadString.trim();
    try {
      payload = JSON.parse(payloadString);
    } catch(e) {
    }
    if(!payload) {
      return done(util.error('INVALID_PAYLOAD', 'Invalid appscene payload.'));
    }
    done(null, payload, payloadString);
  }
  req.on('data', onData);
  req.on('end', onEnd);
}

/**
* Verifies the signature of the HTTP request.
 * To do so, it requires:
 *  - secret: the webhook secret configured
 *  - signature: the X-Appscene-Signature header
 *  - payload: either the actual req.body object, or a stringified version of it.
* */
function verifySignature(secret, signature, payloadString) {
  if(typeof payloadString !== 'string' || payloadString === '') {
    try {
      payloadString = JSON.stringify(payloadString);
    } catch(e) {
      return false;
    }
  }
  var payloadSignature = crypto.createHmac('sha1', secret).update(payloadString).digest('hex');
  if(!util.compare(payloadSignature, signature)) {
    return false;
  }
  return true;
}

module.exports = {
  webhook: connectMiddleware,
  verify: verifySignature
};