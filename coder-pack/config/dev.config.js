const paths = require('./paths.js');
const chalk = require('chalk');
const path = require('path');
const fs = require('fs-extra');
const { execute } = require('../../utils/shelljs/execute.js');
const { prepareProxy } = require('react-dev-utils/WebpackDevServerUtils.js');
const devConfig = paths.devConfig && require(paths.devConfig);
const exeRoot = paths.appPath;

function getHost() {
    if (devConfig.host) {
        console.log(
            chalk.cyan(
                `Attempting to bind to HOST environment variable: ${chalk.yellow(
                    chalk.bold(devConfig.host),
                )}`,
            ),
        );
        return devConfig.host;
    } else if (process.env.HOST) {
        console.log(
            chalk.cyan(
                `Attempting to bind to HOST environment variable: ${chalk.yellow(
                    chalk.bold(process.env.HOST),
                )}`,
            ),
        );
        console.log(
            `If this was unintentional, check that you haven't mistakenly set it in your shell.`,
        );
        console.log(`Learn more here: ${chalk.yellow('https://cra.link/advanced-config')}`);
        console.log();
        return process.env.HOST;
    }

    return '0.0.0.0';
}

function getProxyConfig() {
    let proxyConfig = devConfig && devConfig.proxy;
    // Load proxy config
    if (!proxyConfig) {
        const proxySetting = require(paths.appPackageJson).proxy;
        proxyConfig = prepareProxy(proxySetting, paths.appPublic, paths.publicUrlOrPath);
    }

    return proxyConfig;
}

async function setRunConfig(root = exeRoot) {
    const defaultConfig = path.join(__dirname, 'dev.config.json');
    const proConfig = path.join(root, 'dev.config.json');
    if (!fs.existsSync(proConfig)) {
        console.log(chalk.green(`项目启动配置文件已创建，请酌情修改！`));
        console.log(chalk.green.bold(`项目启动配置文件路径：${proConfig}`));
        await execute(`cp ${defaultConfig} ${root}`);
    }
}

async function setHtmlFile(htmlTemplate, root = exeRoot) {
    if (!fs.existsSync(htmlTemplate)) {
        await execute(`cp -r ${(path.join(__dirname), '../config/public')} ${root}`);
    }
}

async function beforeRun(root = exeRoot) {
    await setHtmlFile(root);
    await setRunConfig(root);
}

module.exports = {
    getHost,
    getProxyConfig,
    beforeRun,
};
