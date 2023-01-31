#!/usr/bin/env node

const shell = require('shelljs');
const root = process.cwd();

async function execute(cmd, opt = {}) {
    const cmdProps = {
        cwd: root,
        // silent: true,
        ...opt,
    };
    const { stdout, stderr, code } = await shell.exec(cmd, cmdProps);

    return { stdout, stderr, code };
}

module.exports = {
    execute,
};
