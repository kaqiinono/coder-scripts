const paths = require('../config/paths.js');
const chalk = require('chalk');
const path = require('path');
const { genProps } = require('../../props/props-gen.js');

genProps()
    .then(() => {
        console.log();
        console.log(chalk.green(`操作完成，检查路径：${path.join(paths.jcode, '../')}`));
        process.exit(0);
    })
    .catch(e => {
        console.error(e);
        process.exit(1);
    });
