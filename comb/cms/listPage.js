'use strict'
var path = require('path'),
    fs = require('fs');

module.exports = function (rqBody,root) {
    console.log('handle list now ...');
     var rs = {
        code: 200,
        msg: 'ok',
        req: rqBody,
        data:{}
    };
    var pagePath = rqBody['pagePath'];

    try{

        //模拟读模版对应的数据
console.info('pagePath:',pagePath);
        var dataRoot = "../comb/data/";
        var localDataFile = path.join(root,dataRoot,pagePath + '-data.json');
        var content = fs.readFileSync(localDataFile,'utf8');
        rs['data']['pageData'] = JSON.parse(content);

        //读pageConf
        var localConfFile = path.join(root,dataRoot,pagePath + '-conf.json');
        var content= fs.readFileSync(localConfFile,'utf8');
        rs['data']['pageConf'] = JSON.parse(content);

    }catch(e){
        rs = {
            code:500,
            msg: e.message
        };
    }

    return rs;
};