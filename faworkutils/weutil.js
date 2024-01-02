'use strict';

const path = require('path');
const fs = require('fs');

/**
 * 是否为目录
 * @param {*} path 
 * @returns 
 */
function isDirSync(path) {
    if (fs.statSync(path).isDirectory()) {
        return true;
    }

    return false;
}

/**
 * 是否为文件
 * @param {*} path 
 * @returns 
 */
function isFileSync(path) {
    if (fs.statSync(path).isFile()) {
        return true;
    }

    return false;
}

/**
 * 是否存在
 * @param {*} path 
 * @returns 
 */
function isExistSync(path) {
    return fs.existsSync(path);
}

/**
 * 创建多级目录。同步
 * @param {*} dirname 
 * @returns 
 */
function mkdirsSync(dirname) {
    if (fs.existsSync(dirname)) {
        return true;
    } else {
        if (mkdirsSync(path.dirname(dirname))) {
            fs.mkdirSync(dirname);
            return true;
        }
    }
}

/**
 * 写入文件，会自动创建多级目录的。编码为 uft-8
 * @param {*} filePath 
 * @param {*} str 
 */
function writeStringToFileSync(filePath, str) {
    mkdirsSync(path.dirname(filePath));

    fs.writeFileSync(filePath, str, {
        encoding: 'utf-8',
        flag: "w"
    });
}

/**
 * 从文件中读取字符串
 * @param {*} filePath 
 * @returns 
 */
function readStringFromFileSync(filePath) {
    return fs.readFileSync(filePath, 'utf-8').toString();
}

/**
 * 复制文件，会自动创建目录的
 * @param {*} sourcePath 
 * @param {*} destinationPath 
 */
function copyFileSync(sourcePath, destinationPath) {
    mkdirsSync(path.dirname(destinationPath));
    // 复制文件
    fs.copyFileSync(sourcePath, destinationPath);
}


/**
 * 遍历一个目录。
 * @param {*} dir 
 * @param {*} callback(filepath, isDir): return bool。对于isDir=true,如果callback的返回值为false，则停止对该目录进行遍历
 */
function walkDirectorySync(dir, callback) {
    // 读取源目录中的所有文件和子目录
    const files = fs.readdirSync(dir);

    // 遍历每个文件和子目录
    files.forEach(file => {
        const sourcePath = path.join(dir, file);
        // 检查是否为文件夹
        if (fs.statSync(sourcePath).isDirectory()) {
            if (callback(sourcePath, true)) {
                // 递归复制子目录
                walkDirectorySync(sourcePath, callback);
            }
        } else {
            callback(sourcePath, false);
        }
    });
}

/**
 * 复制目录
 * @param {*} source 
 * @param {*} destination 
 */
function copyDirectorySync(source, destination) {
    // 检查目标目录是否存在，如果不存在则创建
    if (!fs.existsSync(destination)) {
        mkdirsSync(destination);
    }

    // 读取源目录中的所有文件和子目录
    const files = fs.readdirSync(source);

    // 遍历每个文件和子目录
    files.forEach(file => {
        const sourcePath = path.join(source, file);
        const destinationPath = path.join(destination, file);

        // 检查是否为文件夹
        if (fs.statSync(sourcePath).isDirectory()) {
            // 递归复制子目录
            copyDirectorySync(sourcePath, destinationPath);
        } else {
            // 复制文件
            fs.copyFileSync(sourcePath, destinationPath);
        }
    });
}

module.exports = {
    isExistSync: isExistSync,
    isDirSync: isDirSync,
    isFileSync: isFileSync,

    mkdirsSync: mkdirsSync,
    copyFileSync: copyFileSync,

    writeStringToFileSync: writeStringToFileSync,
    readStringFromFileSync: readStringFromFileSync,
    walkDirectorySync: walkDirectorySync,
    copyDirectorySync: copyDirectorySync
}

console.log("require the file: " + __filename);