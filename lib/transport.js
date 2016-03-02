var request = require('request'),
  querystring = require('querystring'),
  util = require('./util');

const DEFAULT_TIMEOUT = 4000;
/*
 * Transport layer
 * */
var api = function ApiTransport(token, apiUrl) {
  this.token = token;
  if(apiUrl.charAt(apiUrl.length-1) !== '/') apiUrl += '/';
  this.base = apiUrl;
};

/*
 * Perform a HTTP POST request.
 * */
api.prototype.post = function DoPost(path, data, onData, onError) {
  var opt = getOptions.call(this, 'POST', path);
  opt.body = data;
  doRequest(opt, function(err, res) {
    if(err) return onError(err);
    onData(res);
  });
};

/*
 * Perform a HTTP GET request
 * */
api.prototype.get = function DoGet(path, onData, onError, _qs) {
  var opt = getOptions.call(this, 'GET', path, _qs);
  doRequest(opt, function(err, res) {
    if(err) return onError(err);
    onData(res);
  });
};

/*
 * Perform a HTTP DELETE request
 * */
api.prototype.delete = function DoDelete(path, onData, onError) {
  var opt = getOptions.call(this, 'DELETE', path);
  doRequest(opt, function(err, res) {
    if(err) return onError(err);
    onData(res);
  });
};

function doRequest(opt, done) {
  request(opt, function(err, res, body) {
    if(err) {
      return done(util.error('SERVER_ERROR', 'Failed to contact servers.'));
    }
    if(typeof body !== 'object' || !body) {
      try {
        body = JSON.parse(body);
      } catch(e) {
        body = {};
      }
    }
    if(body.type !== 'success') {
      return done(util.error(body.code || 'SERVER_ERROR', body.message || 'Failed to contact servers.'));
    }
    done(null, body.data || {});
  });
}

function getOptions(method, path, _qs) {
  if(path.charAt(0) === '/') path = path.substr(1);
  var uri = this.base + path;
  if(typeof _qs === 'object' && _qs && Object.keys(_qs).length > 0) {
    uri += '?' + querystring.stringify(_qs);
  }
  var opt = {
    method: method.toUpperCase(),
    uri: uri,
    headers: {
      'Connection': 'close',
      'User-Agent': 'appscene-node-client',
      'Authorization': 'Bearer ' + this.token
    },
    followRedirect: false,
    followAllRedirects: false,
    json: true,
    timeout: DEFAULT_TIMEOUT
  };
  return opt;
}

module.exports = api;