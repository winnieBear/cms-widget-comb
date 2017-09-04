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
    var layoutName = rqBody['layoutName'];

    try{

        //模拟读模版对应的数据
console.info('layoutName:',layoutName);
        var dataRoot = "../comb/data/layout/";
        var localDataFile = path.join(root,dataRoot,layoutName + '-conf.json');
        var content = fs.readFileSync(localDataFile,'utf8');
        rs['data'] = JSON.parse(content);



    }catch(e){
        rs = {
            code:500,
            msg: e.message
        };
    }

    return rs;
};