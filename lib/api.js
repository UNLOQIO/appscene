var transport = require('./transport'),
  bluebird = require('bluebird');

var entities = [
  require('./entities/app'),
  require('./entities/build'),
  require('./entities/webhook'),
  require('./entities/keystore')
];

const API_URL = 'https://api.appscene.io';

function createClient(token, _apiUrl) {
  var client = {},
    api = new transport(token, _apiUrl || API_URL);

  entities.forEach(function(entityFn) {
    entityFn(client, api);
  });

  return client;

}


module.exports = createClient;