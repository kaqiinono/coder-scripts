const paths = require('../config/paths.js');
const chalk = require('chalk');
const { readFileList } = require('./props/props-gen.js');
const { editCode } = require('./publish/service');
// const { createCode } = require('./publish/service');

async function run() {
    // const pkg = require(paths.appPackageJson);
    // const data = await createCode({ title: pkg.name });
    const files = {};
    readFileList(paths.appPath, paths.appPath, files, true);
    // console.log({
    //     ...data,
    //     files,
    //     publish: true,
    // });
    await editCode({
        id: 196,
        files,
        publish: true,
    });
    // return data;
    return;
}

run().then(d => {
    console.log(chalk.green(`代码已发布：http://codesanbox.jd.com/code/space/${d.alias}`));
});
