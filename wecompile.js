/**
 * 将weloader.js 文件编译为跨平台的，就这一个目的
 */
const path = require('path');
const bytenode = require('bytenode');
const weutil = require('./faworkutils/weutil.js');
const os = require('os');

var arch = os.arch();
var platform = os.platform();

console.log('arch=' + arch);
console.log('platform=' + platform);

//const v8 = require('v8');
//v8.setFlagsFromString('--no-lazy');

const WeConfig = {
  srcDir: "./wecompile",
  dstDir: "./out",
  // 包括3种文件：1. 主进程中 require 的js文件；2. preload 相关的所有 js 文件; 3. preload中 require 的js文件。
  jsFiles: [
    "weloader.js"
  ]
};


/**
 * 编译为js
 * @param {*} srcFile 
 * @param {*} vDstFile 
 */
async function dealJs(srcFile, dstFile) {
  await bytenode.compileFile({
    filename: srcFile,
    output: dstFile,
    // compileAsModule: srcFile.endsWith("index.js") ? true : false,
    electron: true,
    // electronPath: "./node_modules/electron/dist/electron.exe" // 注释后，会自动寻找当前的electron路径
  });
}

function main() {
  // 检查目标目录是否存在，如果不存在则创建
  if (!weutil.isExistSync(WeConfig.dstDir)) {
    weutil.mkdirsSync(WeConfig.dstDir);
  }

  WeConfig.jsFiles.forEach(async function (file) {
    var fileOnlyName = path.basename(file).replace(path.extname(file), "");

    var srcFile = path.resolve(path.join(WeConfig.srcDir, file));
    var dstFile = path.resolve(path.join(WeConfig.dstDir, fileOnlyName + "_" + platform + "_" + arch + path.extname(file) + "c"));
    
    console.log("srcFile=" + srcFile);
    console.log("dstFile=" + dstFile);

    await dealJs(srcFile, dstFile);
  });
}

main();
