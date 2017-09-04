'use strict'
var path = require('path'),
    fs = require('fs');

module.exports = function (rqBody,root) {
    console.log('handle save now ...');
     var rs = {
        code: 200,
        msg: 'ok',
        req: rqBody
    };
    var pageConf = rqBody['pageConf'],
        pageData = rqBody['pageData'],
        pageTpl = rqBody['pageTpl'],
        pagePath = pageConf['pagePath'];

    try{
        // 写模版文件
        //var pageTplName = './WEB-INF/views/page/' + 'foo/foo'+'.vm';
        var pageTplName = './WEB-INF/views/page/' + pagePath +'.vm';
        var pageTplFile = path.join(root, pageTplName);
        fs.writeFileSync(pageTplFile, pageTpl,'utf8');


        //模拟写模版对应的数据，实际情况是写到db
        //var pageDataName = './test/page/'+ 'foo/foo'+ '.json';
        var pageDataName = './test/page/'+ pagePath + '.json';
        var pageDataFile = path.join(root,pageDataName);
        var json = JSON.stringify(pageData,null,4);
        fs.writeFileSync(pageDataFile,json,'utf8');

        //mock save pageData
        var dataRoot = "../comb/data/";
        var localDataFile = path.join(root,dataRoot,pagePath + '-data.json');
        fs.writeFileSync(localDataFile,json,'utf8');

        //写pageConf到db
        // here is demo, so nothing to do
        var localConfFile = path.join(root,dataRoot,pagePath + '-conf.json');
        fs.writeFileSync(localConfFile,JSON.stringify(pageConf,null,4),'utf8');

    }catch(e){
        rs = {
            code:500,
            msg: e.message
        };
    }

    return rs;
};