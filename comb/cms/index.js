'use strict';
// mock cms

var path = require('path'),
    fs = require('fs'),
    app = require('../index');

var bodyParser = require('body-parser');
app.use(bodyParser.json());

module.exports = function (dir) {
    var root = path.join(app.get('root'), dir),
        logger = app.get('logger') || console;
    console.info('cmsRootDir:',root);
    return function (req, res, next) {
        var url = req.originalUrl;
        var rqBody = req.body;
        var rs = {
            code: 200,
            msg: 'ok',
            data:{},
            req:req.body
        };

        app.set('json spaces', 4);

        if(url.indexOf('/cms/page/save')!== -1){
            logger.info('test cms save ---');
            var save =require('./savePage');
            rs =save(rqBody,root);

            res.json(rs);
        } else if(url.indexOf('/cms/page/list')!== -1) {
            logger.info('test cms list ---');
            var list =require('./listPage');
            rs = list(rqBody,root);

            res.json(rs);

        }else if(url.indexOf('/cms/layout/save')!== -1){
            logger.info('test cms layout save ---');
            var save =require('./saveLayout');
            rs =save(rqBody,root);

            res.json(rs);
        }else if(url.indexOf('/cms/layout/list')!== -1) {
            logger.info('test cms layout list ---');
            var list =require('./listLayout');
            rs = list(rqBody,root);

            res.json(rs);

        } else {
             next();
        }
    };
};