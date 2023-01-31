const path = require('path');
const fs = require('fs-extra');
const chalk = require('chalk');
const { genProps } = require('../../props/props-gen.js');
const { execute } = require('../../utils/shelljs/execute.js');

const exeRoot = process.cwd();

async function setRunConfig(root = exeRoot) {
    const defaultConfig = path.join(__dirname, '../config/config.json');
    const proConfig = path.join(root, 'config.json');
    if (!fs.existsSync(proConfig)) {
        console.log(chalk.green(`项目启动配置文件已创建，请酌情修改！`));
        await execute(`cp ${defaultConfig} ${root}`);
    }
}

async function setHtmlFile(htmlTemplate, root = exeRoot) {
    if (!fs.existsSync(htmlTemplate)) {
        await execute(`cp -r ${(path.join(__dirname), '../config/public')} ${root}`);
    }
}

function getConfig(root = exeRoot) {
    return require(path.join(root, 'config.json'));
}

async function beforeRun(root = exeRoot) {
    await setHtmlFile(root);
    await setRunConfig(root);
}

function getWebpackConfig(envPath, root = exeRoot) {
    const defaultConfig = path.join(__dirname, '../config/coder.config.js');
    if (envPath) {
        if (envPath.startsWith('/') && fs.exists(envPath)) {
            return envPath;
        } else if (fs.pathExistsSync(path.join(root, envPath))) {
            return path.join(root, envPath);
        }
        return defaultConfig;
    } else {
        return defaultConfig;
    }
}

function findEntry(entry, root = exeRoot) {
    if (/.*\.(js|ts|jsx|tsx)/.test(entry)) {
        return entry;
    } else {
        if (fs.pathExistsSync(path.join(root, entry, 'js'))) {
            return `${entry}.js`;
        }
        if (fs.pathExistsSync(path.join(root, entry, 'ts'))) {
            return `${entry}.ts`;
        }
        if (fs.pathExistsSync(path.join(root, entry, 'jsx'))) {
            return `${entry}.jsx`;
        }
        if (fs.pathExistsSync(path.join(root, entry, 'tsx'))) {
            return `${entry}.tsx`;
        }
    }
    return null;
}

module.exports = {
    beforeRun,
    getConfig,
    getWebpackConfig,
    findEntry,
};
