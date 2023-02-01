const chalk = require('chalk');
const path = require('path');
const { execute } = require('../../utils/shelljs/execute.js');
const { coderGen } = require('../../coder-gen');

const exeRoot = process.cwd();

coderGen()
    .then(projectName => {
        console.log(chalk.green(`${projectName}项目已创建成功！`));
        if (!projectName) {
            throw new Error(`项目名称不能为空`);
        }
        const projectRootDir = path.join(exeRoot, projectName);
        // await execute(`npm init`, { cwd: projectRootDir });
        console.log('开始编译，请耐心等待...');
        execute(`npm install @jd/coder-scripts && npm install`, { cwd: projectRootDir }).then(
            () => {
                console.log();
                console.log(
                    chalk.green(`npm run start 启动项目
jcoder props 自动生成嵌入页面开发平台需要的配置文件
                    `),
                );
                process.exit();
            },
        );
    })
    .catch(e => {
        console.error(chalk.red(`项目创建失败，请联系songmeinuo！`), e);
    });
