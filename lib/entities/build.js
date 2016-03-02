var bluebird = require('bluebird'),
  util = require('../util');
/*
 *  related calls
 * */
module.exports = function(client, api) {

  /**
   * Creates a new build.
   * */
  client.createBuild = function(appId, version, data) {
    return new bluebird.Promise(function(resolve, reject) {
      appId = util.id(appId);
      if(!appId) {
        return reject(util.error('INVALID_DATA', 'Invalid application id.'));
      }
      if(typeof version !== 'string' || !version) {
        return reject(util.error('INVALID_DATA', 'Invalid build version'));
      }
      if(typeof data !== 'object' || !data) {
        data = {};
      }
      data.version = version;
      api.post('/apps/' + appId + '/build', data, resolve, reject);
    });
  };

  /**
   * Returns the specific build information.
   * */
  client.getBuild = function(buildId) {
    return new bluebird.Promise(function(resolve, reject) {
      buildId = util.id(buildId);
      if(!buildId) {
        return reject(util.error('INVALID_DATA', 'Invalid build id.'));
      }
      api.get('/builds/' + buildId, resolve, reject);
    });
  };

  /**
  * Returns all the builds for the given appId
  * */
  client.getBuilds = function(appId, data) {
    return new bluebird.Promise(function(resolve, reject) {
      appId = util.id(appId);
      if(!appId) {
        return reject(util.error('INVALID_DATA', 'Invalid app id.'));
      }
      api.get('/apps/' + appId + '/builds', resolve, reject, data);
    });
  };

  /**
   * Deletes the specific build.
   * */
  client.deleteBuild = function(buildId) {
    return new bluebird.Promise(function(resolve, reject) {
      buildId = util.id(buildId);
      if(!buildId) {
        return reject(util.error('INVALID_DATA', 'Invalid build id.'));
      }
      api.delete('/builds/' + buildId, resolve, reject);
    });
  };

};