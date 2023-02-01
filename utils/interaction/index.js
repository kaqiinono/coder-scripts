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

async function radio(message, choice = ['no', 'yes']) {
    const list = await inquirer.prompt([
        {
            type: 'list',
            name: 'choice',
            message: chalk.red(message),
            choices: choice,
        },
    ]);
    return list;
}

async function radioSelector(message, choose) {
    const { choice } = await radio(message, choose);
    return choice;
}

module.exports = {
    inputIn,
    radioSelector,
};
