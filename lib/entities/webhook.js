var bluebird = require('bluebird'),
  util = require('../util');
/*
 *  related calls
 * */
module.exports = function(client, api) {


  /**
   * Adds a webhook for the given app.
   * */
  client.createWebhook = function(appId, url, opt) {
    return new bluebird.Promise(function(resolve, reject) {
      appId = util.id(appId);
      if(!appId) {
        return reject(util.error('INVALID_DATA', 'Invalid application id.'));
      }
      if(typeof opt !== 'object' || !opt) opt = {};
      var data = {
        url: url
      };
      if(opt.secret) {
        data.secret = opt.secret;
      }
      if(opt.event) {
        data.event = opt.event;
      }
      api.post('/app/' + appId + '/webhook', data, resolve, reject);
    });
  };

  /**
   * Returns all the webhooks for an app
   * */
  client.getWebhooks = function(appId, data) {
    return new bluebird.Promise(function(resolve, reject) {
      appId = util.id(appId);
      if(!appId) {
        return reject(util.error('INVALID_DATA', 'Invalid application id.'));
      }
      if(typeof data !== 'object' || !data) data = {};
      api.get('/app/' + appId + '/webhooks', resolve, reject, data);
    });
  };

  /**
  * Returns the information of a single webhook by its id
  * */
  client.getWebhook = function(hookId) {
    return new bluebird.Promise(function(resolve, reject) {
      hookId = util.id(hookId);
      if(!hookId) {
        return reject(util.error('INVALID_DATA', 'Invalid webhook id.'));
      }
      api.get('/webhook/' + hookId, resolve, reject);
    });
  };

  /**
  * Deletes a webhook
  * */
  client.deleteWebhook = function(hookId) {
    return new bluebird.Promise(function(resolve, reject) {
      hookId = util.id(hookId);
      if(!hookId) {
        return reject(util.error('INVALID_DATA', 'Invalid webhook id.'));
      }
      api.delete('/webhook/' + hookId, resolve, reject);
    });
  };

};