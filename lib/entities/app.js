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
      api.post('/apps', data, resolve, reject);
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
      api.post('/apps/' + appId, data, resolve, reject);
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
      api.get('/apps/' + appId, resolve, reject);
    });
  };

  /**
   * Returns the latest app build
   * */
  client.getLatestAppBuild = function(appId) {
    return new bluebird.Promise(function(resolve, reject) {
      appId = util.id(appId);
      if(!appId) {
        return reject(util.error('INVALID_DATA', 'Invalid application id.'));
      }
      api.get('/apps/' + appId + '/latest', function(build) {
        if(!build || typeof build.id === 'undefined') return resolve(null);
        resolve(build);
      }, reject);
    });
  };

  /**
  * Completely destroys the given app, if it has no builds.
  * */
  client.deleteApp = function(appId) {
    return new bluebird.Promise(function(resolve, reject) {
      appId = util.id(appId);
      if(!appId) {
        return reject(util.error('INVALID_DATA', 'Invalid application id.'));
      }
      api.delete('/apps/' + appId, resolve, reject);
    });
  }

};