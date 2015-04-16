var fs = require('fs');
var loopback = require('loopback');
var boot = require('loopback-boot');
var dust = require('dustjs-helpers');
var app = module.exports = loopback();
var viewDir = [__dirname, '../client/views'].join('/');
var views = fs.readdirSync(viewDir);

// Generate templates.js
app.get('/js/templates.js', function(req, res) {
  var tpls = '';
  views.forEach(function(file) {
    var content = fs.readFileSync([viewDir, file].join('/'), 'utf-8');
    tpls += dust.compile(content, file.split('.').shift()).toString();
  });
  res.set({ 'Content-Type': 'text/javascript' });
  res.send(tpls);
});

// Bootstrap the application, configure models, datasources and middleware.
// Sub-apps like REST API are mounted via boot scripts.
boot(app, __dirname);

app.start = function() {
  // start the web server
  return app.listen(function() {
    app.emit('started');
    console.log('Web server listening at: %s', app.get('url'));
  });
};

// start the server if `$ node server.js`
if (require.main === module) {
  app.start();
}
