const path = require('path');
const chalk = require('chalk');
const { execute } = require('../utils/shelljs/execute.js');
const { inputIn } = require('../utils/interaction');

const exeRoot = process.cwd();

async function coderGen() {
    const templateFolder = path.resolve(__dirname, 'config');
    const projectName = await inputIn(`请输入项目名称`);
    const projectRootDir = path.join(exeRoot, projectName);

    await execute(`mkdir ${projectName}`);
    await execute(`cp -r ${templateFolder} .`, { cwd: projectRootDir });
    await execute(`npm init && npm install`, { cwd: projectRootDir });

    return projectName;
}

module.exports = coderGen;
