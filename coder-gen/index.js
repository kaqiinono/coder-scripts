const path = require('path');
const fs = require('fs-extra');
const { execute } = require('../utils/shelljs/execute.js');
const { inputIn } = require('../utils/interaction');

const exeRoot = process.cwd();

async function coderGen() {
    const templateFolder = path.resolve(__dirname, 'config/template');
    const projectName = await inputIn(`请输入项目名称(包含英文字母或下划线)`);
    if (projectName) {
        const projectRootDir = path.join(exeRoot, projectName);
        fs.ensureDir(projectRootDir);

        const pkgPath = `${templateFolder}/package.json`;
        const prPkgPath = path.join(exeRoot, projectName, 'package.json');
        await execute(`cp -r ${templateFolder}/* ${projectRootDir}`, { cwd: projectRootDir });
        const pkg = require(`${prPkgPath}`);
        pkg.name = `@jd/${projectName}`;
        fs.writeFileSync(prPkgPath, JSON.stringify(pkg, null, 2));
    } else {
        throw new Error(`名称输入异常！`);
    }

    return projectName;
}

module.exports = {
    coderGen,
};
