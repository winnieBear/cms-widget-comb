'use strict';

var path = require('path'),
    fs = require('fs'),
    app = require('./index');

// check if the filepath is potentially malicious
function isMalicious(filepath) {
    var ext = path.extname(filepath);
    return ext !== '.css' && ext !== '.js' || filepath.indexOf('../') !== -1;
}

module.exports = function (dir) {
    dir = dir || '/public/project_a';
    var root = path.join(app.get('root'), dir),
        logger = app.get('logger') || console,
        lastHash, cache = {};
console.info('combRoot:',root);
    return function (req, res, next) {
        var i = req.originalUrl.indexOf('??'),
            j = req.originalUrl.indexOf('&'),
            url, ext, hash, files, contents = [], rs;

        if (~i) {
            url = ~j ? req.originalUrl.slice(i + 2, j) : req.originalUrl.slice(i + 2);
            ext = path.extname(url);
            if (ext) res.type(ext.slice(1));
            if (~j) hash = req.originalUrl.slice(j + 1);
            if (hash !== lastHash) {
                lastHash = hash;
                cache = {};
            }

            res.setHeader('Cache-Control', 'public, max-age=' +
                (app.get('env') === 'production' ? 60 * 60 * 24 * 365 : 0));

            files = url.split(',');
            files.forEach(function (file) {
                file = file.substring(1);
                // console.info(file);
                if (cache.hasOwnProperty(file)) {
                    var now = +new Date();
                    var cachedFile = cache[file];
                    if (now < cachedFile[ 'exprired' ]) {
                        // console.info('get %s from cahce ...',file);
                        return contents.push(cachedFile['content']);
                    } else {
                        // console.info('%s cahce exprired ...',file);
                        delete cache[file];
                    }
                }
                if (isMalicious(file)) return logger.error('[combo] malicious file: ' + file);

                var filePath = path.resolve(root, file),
                    content;
                try {
                    content = fs.readFileSync(filePath, 'utf-8');
                    // console.info('%s：%s', file, content);
                } catch (e) {
                    logger.error('[combo] cannot read file: ' + filePath + '\n', e.stack);
                }
                if (content) {
                    contents.push(content);
                    cache[file] = {
                        content: content,
                        // exprired: + new Date() + 5 * 60 * 1000 // 5分钟
                        exprired: + new Date() + 30 * 1000 // 30s
                    };
                }
            });

            rs = contents.join('\n');
            if (contents.length !== files.length) {
                logger.error('[combo] some files not found');
            }

            res.send(rs);
        } else {
            next();
        }
    };
};