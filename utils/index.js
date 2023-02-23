const Args = require('minimist')(process.argv.slice(2)) || {};

console.log('命令传参：', Args);

function getConfigMiddleName() {
    if (Args.share) {
        return `share`;
    }

    if (Args.component) {
        return `component`;
    }

    return `config`;
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

function noEslint() {
    return Args.force;
}

module.exports = {
    Args,
    getPkgInfo,
    getConfigMiddleName,
    noEslint,
};
