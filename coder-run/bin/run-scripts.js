#!/usr/bin/env node
/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

'use strict';

// Makes the script crash on unhandled rejections instead of silently
// ignoring them. In the future, promise rejections that are not handled will
// terminate the Node.js process with a non-zero exit code.
process.on('unhandledRejection', err => {
    throw err;
});

const spawn = require('react-dev-utils/crossSpawn');
const args = process.argv.slice(2);

const scriptIndex = args.findIndex(
    x =>
        x === 'build' ||
        x === 'eject' ||
        x === 'start' ||
        x === 'test' ||
        x === 'gen' ||
        x === 'props' ||
        x === 'publish',
);
const script = scriptIndex === -1 ? args[0] : args[scriptIndex];
const nodeArgs = scriptIndex > 0 ? args.slice(0, scriptIndex) : [];

if (['build', 'eject', 'start', 'test', 'gen', 'props', 'publish'].includes(script)) {
    const result = spawn.sync(
        process.execPath,
        nodeArgs
            .concat(require.resolve('../scripts/' + script))
            .concat(args.slice(scriptIndex + 1).concat(script)),
        { stdio: 'inherit' },
    );
    if (result.signal) {
        if (result.signal === 'SIGKILL') {
            console.log(
                'The build failed because the process exited too early. ' +
                    'This probably means the system ran out of memory or someone called ' +
                    '`kill -9` on the process.',
            );
        } else if (result.signal === 'SIGTERM') {
            console.log(
                'The build failed because the process exited too early. ' +
                    'Someone might have called `kill` or `killall`, or the system could ' +
                    'be shutting down.',
            );
        }
        process.exit(1);
    }
    process.exit(result.status);
} else {
    console.log(`
    jcoder build/start/gen/props/publish 打包/启动/生成.jcode配置/生成props属性配置/发布
    --share 代码共享，会自动根据src/index入口生成需要导出组件的.jcode相关配置
    --component 打包组件，不会生成.jcode配置
    --library 打包后的组件库名 可通过window[设置的组件库名访问]
    --entry 打包文件的入口，也可以是文件夹，会自动获取文件夹一级子目录下的入口文件(index|main)
    --overwrite 重写.jcode相关配置文件
    --force 强制执行，忽略eslint等错误
    
    其他问题请联系songmeinuo@jd.com
    
    `);
}
