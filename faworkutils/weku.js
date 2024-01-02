'use strict';

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

function encrypt(str) {
    var newStr = Buffer.from(str, "utf-8").toString('base64');
    return pkcrypt(newStr, true);
}

function decrypt(str) {
    var plainStr = pkcrypt(str, false);
    return Buffer.from(plainStr, "base64").toString("utf-8");
}

module.exports = {
    encrypt: encrypt,
    decrypt: decrypt
}

console.log("require the file: " + __filename);