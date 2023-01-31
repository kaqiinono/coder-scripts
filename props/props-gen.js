const fs = require('fs-extra');
const path = require('path');

function readFileList(root = process.cwd(), dir, filesList = {}) {
    console.log('dir', dir);
    const files = fs.readdirSync(dir);
    files.forEach((item, index) => {
        const fullPath = path.join(dir, item);
        const stat = fs.statSync(fullPath);
        if (!/\/(dist|.jcode|public|node_modules)/.test(dir)) {
            if (stat.isDirectory()) {
                readFileList(root, path.join(dir, item), filesList); //递归读取文件
            } else if (/\.(js|jsx|ts|tsx)$/.test(fullPath)) {
                console.log('fullPath', fullPath);
                filesList[fullPath.replace(root, '')] = {
                    path: fullPath,
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

function genJCodeFiles(genConfigData, root) {
    const updateFile = {};
    const importCode = [];
    const propsData = {};
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

    // exportCode.push(`export { ${exportNames.join(',')} };\n`);
    const exportPath = getMainExportFileName();
    let newCode = '';
    if (importCode.length > 0) {
        newCode = `${importCode.join('\n')}\nexport { ${Object.keys(propsData).join(',')} };\n`;
        updateFile[exportPath] = {
            code: newCode,
        };

        const exportPathAbsolute = path.join(root, exportPath);
        const mainPathAbsolute = path.join(root, getPropsTypeFileName());
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

function entryParser(entry) {
    if (entry.startsWith('/')) {
        return entry;
    } else if (entry.startsWith('.')) {
        return entry.slice(1);
    }
    return `/${entry}`;
}

async function genProps(entry, root = process.cwd()) {
    const { validFile, generate, findExports } = require('proptypes-generator');

    // const result = [];
    const files = {};

    readFileList(root, root, files);

    const result = findExports(files, entryParser(entry));
    const finalRet = [];
    if (result.length > 0) {
        for (const r of result) {
            const vFile = validFile(files, r.filePath) || {};
            const { options, propTypes } = await generate(vFile.code, r.fileName);
            finalRet.push({ options, propTypes, exports: result });
        }
    } else {
        throw new Error(`未找到组件信息！`);
    }

    await genJCodeFiles(finalRet, root);
}

module.exports = {
    genProps,
};
