const fs = require('fs-extra');
const path = require('path');
const paths = require('../../config/paths.js');
const chalk = require('chalk');
const { Args } = require('../../../utils');
const { validFile, generate, findExports } = require('proptypes-generator');

function excludeFolderFilter(relativePath, all) {
    if (all) {
        return /\/(dist|node_modules|build)/.test(relativePath);
    }

    return /\/(dist|.jcode|public|node_modules|build)/.test(relativePath);
}

function readFileList(root = process.cwd(), dir, filesList = {}, all) {
    const files = fs.readdirSync(dir);
    files.forEach(item => {
        const fullPath = path.join(dir, item);
        const stat = fs.statSync(fullPath);
        const relativePath = dir.replace(root, '');
        if (!excludeFolderFilter(relativePath, all)) {
            if (stat.isDirectory()) {
                readFileList(root, path.join(dir, item), filesList); //递归读取文件
            } else if (
                (all && !fullPath.includes(`/package-lock.json`)) ||
                /\.(js|jsx|ts|tsx)$/.test(fullPath)
            ) {
                console.log('readFile in ', fullPath);
                filesList[fullPath.replace(root, '')] = {
                    // path: fullPath,
                    // relativePath,
                    code: fs.readFileSync(fullPath).toString(),
                };
            }
        }
    });
    return filesList;
}

function getPropsTypeFileName() {
    return `./.jcode/propTypes.json`;
}

const getMainExportFileName = () => `./.jcode/main.js`;

function genJCodeFiles(genConfigData) {
    const importCode = [];
    const propsData = {};
    const exportPath = getMainExportFileName();
    const exportPathAbsolute = path.join(paths.appPath, exportPath);
    const mainPathAbsolute = path.join(paths.appPath, getPropsTypeFileName());

    // 生成属性配置 *.json,多个组件生成多个json配置，只生成一个exports
    genConfigData.forEach(pd => {
        const {
            propTypes,
            options: { name },
        } = pd || {};
        if (name) {
            propsData[name] = propTypes || {};
        }

        const { exports } = pd || {};
        if (exports && exports.length > 0) {
            for (const e of exports) {
                importCode.push(`import ${pd.options.name} from '..${e.filePath}';\n`);
            }
        }
    });

    let newCode = '';
    if (importCode.length > 0) {
        newCode = `${importCode.join('\n')}\nexport { ${Object.keys(propsData).join(',')} };\n`;

        console.log(chalk.green('导出信息文件已自动生成', exportPathAbsolute));
        console.log(chalk.green('导出信息文件已自动生成', mainPathAbsolute));
        fs.ensureFileSync(exportPathAbsolute);
        fs.ensureFileSync(mainPathAbsolute);
        fs.writeFileSync(exportPathAbsolute, newCode);
        fs.writeFileSync(mainPathAbsolute, JSON.stringify(propsData, null, 2));
    } else {
        throw new Error(`未找到组件信息，请检查入口文件`);
    }
}

async function genProps() {
    if (!(Args._[0] === 'props' || Args.share)) {
        return;
    }
    // console.info(chalk.yellow.bold(`.jcode配置文件作用于页面开发平台，请正确配置！`));
    // const genConfirmInfo = await radioSelector(`是否重新生成.jcode配置文件？`, ['yes', 'no']);
    const entry = paths.appIndexJs.replace(paths.appPath, '');
    if (Args.overwrite || !fs.pathExistsSync(paths.jcode)) {
        const root = paths.appPath;
        const files = {};

        readFileList(root, root, files);

        const result = findExports(files, entry);
        const finalRet = [];
        if (result.length > 0) {
            for (const r of result) {
                const vFile = validFile(files, r.filePath) || {};
                const { options, propTypes } = await generate(vFile.code, r.fileName);
                finalRet.push({ options, propTypes, exports: result });
            }
        } else {
            throw new Error(`未找到组件信息！请检查入口文件：${entry}`);
        }

        await genJCodeFiles(finalRet);
        if (!fs.pathExistsSync(paths.jcode)) {
            throw new Error(`.jcode配置文件不存在，可以执行jcdoer props命令重新生成！`);
        }
    } else {
        console.info(chalk.red.bold(`检测到.jcode配置文件(作用于页面开发平台)已存在！`));
        console.info(chalk.red.bold(`确认.jcode配置文件已正确配置，否则无法正常使用！`));
        console.info(chalk.red.bold(`路径：${paths.jcode}`));
    }
}

module.exports = {
    genProps,
    readFileList,
};
