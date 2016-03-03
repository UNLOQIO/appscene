var async = require('async');
var appscene = require('../index'); // require('appscene')
/*
 * Appscene.io client example.
 * */
const ACCESS_TOKEN = '{ACCESS_TOKEN}';
var api = appscene(ACCESS_TOKEN);
var appId, buildId, hookId, storeId;
var calls = [];


calls.push(function() {
  return api.createApp({
    namespace: 'com.my.app.' + Date.now(),
    platform: 'android',
    repository: 'git://github.com/snupa/shield.git'
  }).then(function(app) {
    console.log('Created app %s', app.id);
    appId = app.id;
  });
});

calls.push(function() {
  return api.updateApp(appId, {
    project_path: '/my/project'
  }).then(function() {
    console.log('Updated app');
  });
});

calls.push(function() {
  return api.getApp(appId).then(function(app) {
    console.log("Got app", app);
  });
});

calls.push(function() {
  return api.createBuild(appId, '1.0.0', {
    icon_url: 'https://my.icon.com'
  }).then(function(build) {
    console.log('Added build', build);
    buildId = build.id;
  });
});

calls.push(function() {
  return api.getBuild(buildId).then(function(build) {
    console.log("Got build", build);
  });
});

calls.push(function() {
  return api.getBuilds(appId).then(function(builds) {
    console.log("All builds for app %s", appId, builds);
  });
});

calls.push(function() {
  return api.deleteBuild(buildId).then(function() {
    console.log("Deleted build %s", buildId);
  });
});

calls.push(function() {
  return api.createWebhook(appId, 'http://172.22.120.80:7500', {
    secret: 'mySecret',
    event: 'PASS'
  }).then(function(hook) {
    console.log('Added a webhook for app', hook);
    hookId = hook.id;
  });
});

calls.push(function() {
  return api.getWebhooks(appId).then(function(webhooks) {
    console.log('Got webhooks ', webhooks);
  });
});

calls.push(function() {
  return api.getWebhook(hookId).then(function(webhook) {
    console.log('Got webhook ', webhook);
  });
});

calls.push(function() {
  return api.deleteWebhook(hookId).then(function() {
    console.log("Deleted webhook %s", hookId);
  });
});


calls.push(function() {
  return api.createKeystore({
    name: 'My store',
    alias: 'APPSCENE',
    password: 'storePass',
    algorithm: 'SHA1withRSA',
    file: 'base64EncodedFile',
    size: 2048
  }).then(function(store) {
    console.log('Keystore %s created', store.id);
    storeId = store.id;
  });
});

calls.push(function() {
  return api.getKeystores().then(function(stores) {
    console.log('Got keystores', stores);
  });
});

calls.push(function() {
  return api.getKeystore(storeId).then(function(store) {
    console.log('Got store', store);
  });
});

calls.push(function() {
  return api.deleteKeystore(storeId).then(function() {
    console.log("Deleted keystore");
  });
});





var promises = [];
calls.forEach(function(fn) {
  promises.push(function(done) {
    fn().then(done).catch(done);
  });
});

async.series(promises, function(err) {
  if(err) {
    console.log("Got error", err);
    return;
  }
  console.log("All done");
});

appscene.connectWebhook('/my/path', {
  secret: 'mySecret'
});
