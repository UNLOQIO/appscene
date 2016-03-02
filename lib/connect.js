var crypto = require('crypto');
/**
 * This is the Appscene.io webhook that will validate any incoming webhook requests.
 * Note that the connect middleware can work both with a path or just a simple middleware.
 * The accepted options are:
 *    path - the path to listen to.
 *    secret - the webhook secret.
 *    events - array of events or single event to listen to.
 *
* */
function connectMiddleware(opt) {
  opt = (typeof opt === 'object' && opt ? opt : {});
  var url = (typeof opt.path === 'string' && opt.path ? opt.path : null),
    secret = (typeof opt.secret === 'string' && opt.secret ? opt.secret : null);
  var events = [];
  if(typeof opt.events === 'string' && opt.events) {
    events = opt.events.split(' ');
  } else if(opt.events instanceof Array) {
    events = opt.events;
  }
  return function appsceneMiddleware(req, res, next) {
    // TODO
  };
}

module.exports = connectMiddleware;