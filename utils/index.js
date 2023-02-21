function getArgs() {
    return require('minimist')(process.argv.slice(2)) || {};
}

function isShare() {
    return getArgs().share;
}

function getPkgInfo(root) {
    const { name: originName, ...rest } = require(`${root}/package.json`);
    let name = originName;
    if (name) {
        name = name.replace('/', '_').replace('@jd_', '');
    } else {
        name = root.split('/').pop().replace(/-/g, '_');
    }
    return { pkgName: name, name: originName, ...rest };
}

module.exports = {
    getArgs,
    getPkgInfo,
    isShare,
};
