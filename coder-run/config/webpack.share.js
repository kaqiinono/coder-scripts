const paths = require('./paths.js');
const { getPkgInfo } = require('../../utils');
const { pkgName: packageName, version } = getPkgInfo(paths.appPath);
const { merge } = require('webpack-merge');
const common = require('./webpack.component.js');
const path = require('path');
const { Args } = require('../../utils');

module.exports = function (webpackEnv) {
    return merge(common(webpackEnv), {
        entry: path.resolve(paths.appPath, '.jcode/main.js'),
        output: {
            library: Args.library || ['ShareCode', `${packageName}`],
            libraryTarget: 'umd',
            filename: `[name].js`,
            chunkFilename: `[name].chunk.js`,
        },
    });
};
