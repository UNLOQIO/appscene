var api = require('./lib/api'),
  connect = require('./lib/connect');
/*
* Appscene API exposing.
* */
module.exports = function init(token, _apiUrl) {
  if(typeof token !== 'string' || !token) {
    throw new Error("Appscene: missing access token.");
  }
  return api(token, _apiUrl);
};

/* Export the connect middleware. */
module.exports.connectWebhook = connect;