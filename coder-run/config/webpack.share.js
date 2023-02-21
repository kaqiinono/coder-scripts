const paths = require('./paths.js');
const { getPkgInfo } = require('../../utils');
const { pkgName: packageName } = getPkgInfo(paths.appPath);
const { merge } = require('webpack-merge');
const common = require('./webpack.config');
const path = require('path');

module.exports = function (webpackEnv) {
    return merge(common(webpackEnv), {
        entry: path.resolve(paths.appPath, '.jcode/main.js'),
        output: {
            filename: `index.js`,
            library: ['ShareCode', `${packageName}`],
            // libraryExport: 'default',
            libraryTarget: 'umd',
        },
        externals: {
            react: {
                commonjs: 'react', // CommonJS 模块
                commonjs2: 'react', // CommonJS 模块
                amd: 'react', // AMD 模块
                root: 'React', // 全局变量访问
            },
            'react-dom': {
                commonjs: 'react-dom',
                commonjs2: 'react-dom',
                amd: 'react-dom',
                root: 'ReactDOM',
            },
        },
    });
};
