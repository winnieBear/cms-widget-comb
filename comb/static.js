'use strict';

var express = require('express'),
    app = require('./index');


express.static.mime.define({'text/plain': ['hbs']});

express.static.mime.define({'text/plain': ['vm']});

module.exports = function (dir) {
    dir = dir || '/public';
    console.info('webrootDir:', dir);
    return express.static(app.get('root') + dir, {
        maxAge: app.get('env') === 'production' ? Infinity : 0
    });
};