/*
* Appscene error utility class
* */
var util = {};
util.error = function(errorCode, errorMessage, _data) {
  var error = new Error(errorMessage);
  error.code = errorCode;
  if(_data) {
    error.data = _data;
  }
  return error;
};

util.id = function(appId) {
  if(typeof appId === 'number') {
    return parseInt(appId, 10);
  }
  if(typeof appId === 'object' && appId) {
    appId = appId.id;
  } else if(typeof appId === 'string' && appId !== '') {
    appId = parseInt(appId);
  }
  appId = parseInt(appId);
  if(isNaN(appId)) {
    return null;
  }
  return appId;
};

module.exports = util;