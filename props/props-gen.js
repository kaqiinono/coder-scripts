const fs = require('fs-extra');
const path = require('path');
const paths = require('../coder-pack/config/paths.js');
const chalk = require('chalk');
const { radioSelector } = require('../utils/interaction');
const { inputIn } = require('../utils/interaction');
const { validFile, generate, findExports } = require('proptypes-generator');

function readFileList(root = process.cwd(), dir, filesList = {}) {
    console.log('dir====>', dir);
    const files = fs.readdirSync(dir);
    files.forEach(item => {
        const fullPath = path.join(dir, item);
        const stat = fs.statSync(fullPath);
        const relativePath = dir.replace(root, '');
        if (!/\/(dist|.jcode|public|node_modules|build)/.test(relativePath)) {
            if (stat.isDirectory()) {
                readFileList(root, path.join(dir, item), filesList); //递归读取文件
            } else if (/\.(js|jsx|ts|tsx)$/.test(fullPath)) {
                console.log('fullPath', fullPath);
                filesList[fullPath.replace(root, '')] = {
                    path: fullPath,
                    relativePath,
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

        console.log('导出信息文件已自动生成', exportPathAbsolute);
        console.log('导出信息文件已自动生成', mainPathAbsolute);
        fs.ensureFileSync(exportPathAbsolute);
        fs.ensureFileSync(mainPathAbsolute);
        fs.writeFileSync(exportPathAbsolute, newCode);
        fs.writeFileSync(mainPathAbsolute, JSON.stringify(propsData, null, 2));
    } else {
        throw new Error(`未找到组件信息，请检查入口文件`);
    }
}

async function genProps(entry) {
    console.info(chalk.yellow.bold(`.jcode配置文件作用于页面开发平台，请正确配置！`));
    const genConfirmInfo = await radioSelector(`是否重新生成.jcode配置文件？`, ['yes', 'no']);
    if (genConfirmInfo === 'yes') {
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
    }
}

module.exports = {
    genProps,
    readFileList,
};
