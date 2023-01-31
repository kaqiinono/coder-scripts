const inquirer = require('inquirer');
const chalk = require('chalk');

async function inputIn(message = '请输入内容') {
    const input = await inquirer.prompt([
        {
            type: 'input',
            name: 'content',
            message: chalk.red(message),
        },
    ]);
    return input.content;
}

module.exports = {
    inputIn,
};
