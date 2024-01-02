"use strict";

const fs = require("fs");
const path = require("path");
const vm = require("vm");
const Module = require("module");

function pkcrypt(str, isEncrypt) {
    var c2s = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    var s2c = c2s.split('').reverse().join("");

    var srckey = c2s;
    var dstkey = s2c;

    if (!isEncrypt) {
        srckey = s2c;
        dstkey = c2s;
    }

    var map = new Map();

    for (var i = 0; i < srckey.length; i++) {
        var ch = srckey.charAt(i);
        map.set(ch, dstkey.charAt(i));
    }

    var newStr = "";
    for (var i = 0; i < str.length; i++) {
        var ch = str.charAt(i);
        var dstCh = map.get(ch);
        if (dstCh == undefined) {
            newStr += ch;
        } else {
            newStr += dstCh;
        }
    }

    return newStr;
}

function decrypt(str) {
    var plainStr = pkcrypt(str, false);
    return Buffer.from(plainStr, "base64").toString("utf-8");
}

Module._extensions[".jsce"] = function (module, filename) {
    var isShowLog = false;

    var rawFileName = filename.substr(0, filename.length - 2);
    if (isShowLog) {
        console.log('load the jsce file: ' + filename);
        console.log('load the js raw file: ' + rawFileName);
    }

    var content = fs.readFileSync(filename, 'utf8');
    content = decrypt(content);

    const beginStr = '(function(exports, require, module, __filename, __dirname){';
    const endStr = '})';
    const strTemplate = beginStr + content + endStr;

    const script = new vm.Script(strTemplate, rawFileName);

    const require = function (id) {
        return module.require(id);
    };
    require.resolve = function (request, options) {
        return Module._resolveFilename(request, module, false, options);
    };
    if (process.mainModule) {
        require.main = process.mainModule;
    }
    require.extensions = Module._extensions;
    require.cache = Module._cache;

    const compiledWrapper = script.runInThisContext({
        filename: rawFileName,
        lineOffset: 0,
        columnOffset: 0,
        displayErrors: true
    });
    const dirname = path.dirname(filename);
    const args = [module.exports, require, module, rawFileName, dirname, process, global];
    return compiledWrapper.apply(module.exports, args);
};

/**
 * 加载jse文件。 只加载我自己的项目，不支持加载 node_modules 中的模块，只支持加载 .jse 后缀的文件 
 * @param {*} filename 
 */
/*
function requireJse(filename) {
    var absPathname = path.resolve(__dirname, filename);

    const content = fs.readFileSync(absPathname, 'utf8');

    const beginStr = '(function(module,exports,require,__dirname,__filename){';
    const endStr = '})';

    const strTemplate = beginStr + content + endStr;

    const fn = vm.runInThisContext(strTemplate);
    fn.call(module.exports, module.exports, module, Require, _filename, _dirname);
}*/