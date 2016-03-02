var bluebird = require('bluebird'),
  util = require('../util');
/*
 *  related calls
 * */
module.exports = function(client, api) {

  /**
  * Creates a new keystore that will be associated with the account
  * */
  client.createKeystore = function(data) {
    return new bluebird.Promise(function(resolve, reject) {
      if(typeof data !== 'object' || !data) {
        return reject(util.error('INVALID_DATA', 'Invalid application information'));
      }
      api.post('/keystores', data, resolve, reject);
    });
  };

  /**
   * Returns all the webhooks for an app
   * */
  client.getKeystores = function(data) {
    return new bluebird.Promise(function(resolve, reject) {
      if(typeof data !== 'object' || !data) data = {};
      api.get('/keystores', resolve, reject, data);
    });
  };

  /**
   * Returns the information of a single webhook by its id
   * */
  client.getKeystore = function(storeId) {
    return new bluebird.Promise(function(resolve, reject) {
      storeId = util.id(storeId);
      if(!storeId) {
        return reject(util.error('INVALID_DATA', 'Invalid keystore id.'));
      }
      api.get('/keystores/' + storeId, resolve, reject);
    });
  };


  /**
   * Deletes the specific keystore.
   * */
  client.deleteKeystore = function(storeId) {
    return new bluebird.Promise(function(resolve, reject) {
      storeId = util.id(storeId);
      if(!storeId) {
        return reject(util.error('INVALID_DATA', 'Invalid keystore id.'));
      }
      api.delete('/keystores/' + storeId, resolve, reject);
    });
  };

};