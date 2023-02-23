const paths = require('./paths.js');
const path = require('path');
const fs = require('fs');
const glob = require('glob');
const { Args } = require('../../utils');

function joinFile(file) {
    if (file.startsWith('/')) {
        return file;
    }
    return path.join(paths.appPath, file);
}

function getEntry() {
    let argEntry = Args.entry;
    if (argEntry) {
        argEntry = joinFile(argEntry);
        const stat = fs.lstatSync(argEntry);
        if (stat.isDirectory()) {
            return new Set(glob.sync(`${argEntry}/*/@(index|main).@(jsx|js|ts|tsx|vue)`));
        }
        return argEntry;
    }
    const ef = joinFile('.jcode/main.js');
    const srcIndex = joinFile('src/index.js');
    if (fs.existsSync(ef)) {
        return ef;
    } else if (fs.existsSync(srcIndex)) {
        return srcIndex;
    } else if (fs.existsSync(joinFile('src/component'))) {
        const en = new Set(glob.sync(`${argEntry}/*/@(index|main).@(jsx|js|ts|tsx|vue)`));
        if (en.length > 0) {
            return en;
        }
    }
    throw new Error(`
    没有找到入口文件，请配置如下路径或在打包命令中增加entry参数：jcoder build --component --entry=src/index.jx
    ==> .jcode/main.js
    ==> src/index.js
    ==> src/component
    `);
}

module.exports = { getEntry };
