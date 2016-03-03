var appscene = require('../index'); // require('appscene');
var express = require('express');
var app = express();

/*
* The webhook will put the webhook payload in req.body, and performs the
* signature verification before it does so.
* */
app.use(appscene.webhook({
  path: '/appsceneWebhook',
  secret: 'mySecret',
  events: ['pass', 'fail']
}));

app.post('/appsceneWebhook', function(req, res) {
  console.log("Appscene payload:");
  console.log(req.body);
  res.end();
});

app.listen(1337);