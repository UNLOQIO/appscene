var bluebird = require('bluebird'),
  util = require('../util');
/*
* App related calls
* */
module.exports = function(client, api) {

  /**
   * Create a new Appscene application
   *
   * Mandatory data:
   *    namespace
   *    platform
   *    repository
   * */
  client.createApp = function(data) {
    return new bluebird.Promise(function(resolve, reject) {
      if(typeof data !== 'object' || !data) {
        return reject(util.error('INVALID_DATA', 'Invalid application information'));
      }
      api.post('/app', data, resolve, reject);
    });
  };

  /**
   * Updates the information of a given app. The app can be either an appId or the appObj with an id.
   * */
  client.updateApp = function(appId, data) {
    return new bluebird.Promise(function(resolve, reject) {
      appId = util.id(appId);
      if(!appId) {
        return reject(util.error('INVALID_DATA', 'Invalid application id.'));
      }
      if(typeof data !== 'object' || !data) {
        return reject(util.error('INVALID_DATA', 'Invalid application information'));
      }
      api.post('/app/' + appId, data, resolve, reject);
    });
  };

  /**
  * Returns information of an app
  * */
  client.getApp = function(appId) {
    return new bluebird.Promise(function(resolve, reject) {
      appId = util.id(appId);
      if(!appId) {
        return reject(util.error('INVALID_DATA', 'Invalid application id.'));
      }
      api.get('/app/' + appId, resolve, reject);
    });
  }

};