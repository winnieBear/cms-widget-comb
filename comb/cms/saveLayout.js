'use strict'
var path = require('path'),
    fs = require('fs');

module.exports = function (rqBody,root) {
    console.log('handle save layout now ...');
     var rs = {
        code: 200,
        msg: 'ok',
        req: rqBody
    };
    var layoutProj = rqBody['project'],
        layoutName = rqBody['layoutName'],
        layoutConf = rqBody['layoutConf'];
        // layoutHtml = rqBody['html'],
        // layoutPageTpl = rqBody['pageTpl'],
        // layoutTpl = rqBody['tpl'];

        //存储layoutConf{layoutHtml,layoutTpl} 到db
        //存储layoutConf.tpl到views/page/layout/layoutName.vm
        //修改map.json 和server.conf


    try{
        // mock 存储layoutHtml,layoutTpl 到db

        var dataRoot = "../comb/data/layout/";
        var layoutConfFile = path.join(root,dataRoot,layoutName + '-conf.json');
        fs.writeFileSync(layoutConfFile,JSON.stringify(layoutConf,null,4),'utf8');



    }catch(e){
        rs = {
            code:500,
            msg: e.message
        };
    }

    return rs;
};