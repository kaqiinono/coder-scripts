const paths = require('../config/paths.js');
const chalk = require('chalk');
const path = require('path');
const { execute } = require('../../utils/shelljs/execute.js');
const { coderGen } = require('../../coder-gen');

const exeRoot = paths.appPath;

const projectName = await coderGen()
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
execute(`npm install @jd/coder-scripts && npm install`, { cwd: projectRootDir }).then(() => {
    process.exit();
});
