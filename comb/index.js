'use strict';

var meta = require('../package.json'),
    express = require('express'),
    compress = require('compression'),
    cors = require('cors'),
    path = require('path'),
    app = module.exports = express(),
    middleware = ['combo', 'router', 'proxy', 'static', 'error','cms'];

// lazy load middlewares
middleware.forEach(function (m) {
    middleware.__defineGetter__(m, function () {
        return require('./' + m);
    });
});

process.on('uncaughtException', function (err) {
    (app.get('logger') || console).error('Uncaught exception:\n', err.stack);
});

var webRoot = '/public/';
var combRoot = '';
if (process.argv.length > 2) {
    webRoot = (process.argv[ 2 ] === '.' ? '' : '/' + process.argv[ 2 ])  + webRoot ;
    combRoot = webRoot + process.argv[ 3 ];
}
console.info('webRoot:%s,combRoot:%s', webRoot,combRoot);

app.set('name', meta.name);
app.set('version', meta.version);
app.set('port', process.env.PORT || 9000);
app.set('root', path.resolve(__dirname, '../').replace(/\/+$/, ''));
app.set('logger', console);
app.enable('trust proxy');

app.use(cors());
app.use(compress());
app.use('/comb??*',middleware.combo(combRoot));
// app.use('/comb??*',middleware.combo(meta.combRoot));
app.use('/cms/*', middleware.cms('./www/'));

app.use(middleware.router({index: '/public/' + meta.name + '/' + meta.version + '/index.html'}));
// app.use('/api/*', middleware.proxy('http://cors-api-host'));
app.use('/public', middleware.static(webRoot));
app.use(middleware.error());

if (require.main === module) {
    app.listen(app.get('port'), function () {
        console.log('[%s] Express server listening on port %d',
            app.get('env').toUpperCase(), app.get('port'));
    });
}