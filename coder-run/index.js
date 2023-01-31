#!/usr/bin/env node

const path = require('path');
const { coderGen } = require('../coder-gen');
const chalk = require('chalk');
const { findEntry } = require('./utils');
const { genProps } = require('../props/props-gen.js');
const argv = require('minimist')(process.argv.slice(2));
const { execute: executeOld } = require('../utils/shelljs/execute.js');
const { getWebpackConfig } = require('./utils');
const { beforeRun } = require('./utils');

async function run() {
    const { root, entry: envEntry } = argv;
    const exeRoot = root || process.cwd();
    const execute = (cmd, opt) =>
        executeOld(cmd, {
            cwd: exeRoot,
            ...opt,
        });

    if (argv._[0] === 'gen') {
        const projectName = await coderGen(exeRoot)
            .then(projectName => {
                console.log(chalk.green(`${projectName}项目已创建成功！`));
                return projectName;
            })
            .catch(e => {
                console.error(chalk.red(`项目已创建失败，请联系songmeinuo！`), e);
            });
        if (!projectName) {
            throw new Error(`项目名称不能为空`);
        }
        const projectRootDir = path.join(exeRoot, projectName);
        // await execute(`npm init`, { cwd: projectRootDir });
        await execute(`npm install`, { cwd: projectRootDir });
    } else {
        const entry = findEntry(envEntry || path.join(exeRoot, 'index'), exeRoot);
        if (!entry) {
            throw new Error(
                `入口文件不存在：${path.join(
                    exeRoot,
                    'index.js',
                )}, 也可在npm run start/build脚本中设置了entry属性`,
            );
        }

        await beforeRun(exeRoot);

        const configPath = getWebpackConfig(exeRoot);
        if (argv._[0] === 'build') {
            await genProps(exeRoot, entry);
            await execute(
                `webpack --config ${configPath} --color --env entry=${entry} --progress`,
                {
                    cwd: exeRoot,
                },
            );
        } else if (argv._[0] === 'start') {
            await execute(
                `webpack serve --config ${configPath} --progress --color --env debug entry=${entry}`,
                {
                    cwd: exeRoot,
                },
            );
        }
    }
}

run().then(() => {
    console.log(`进程结束！`);
});
