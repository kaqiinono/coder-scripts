const paths = require('./paths.js');
const { getPkgInfo } = require('../../utils');
const { pkgName: packageName } = getPkgInfo(paths.appPath);
const { merge } = require('webpack-merge');
const common = require('./webpack.config.js');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { getEntry } = require('./entry.js');
const { Args } = require('../../utils');

module.exports = function (webpackEnv) {
    return merge(common(webpackEnv), {
        entry: getEntry(),
        output: {
            library: Args.library || packageName.toUpperCase(),
            libraryTarget: 'umd',
            filename: `${packageName.toLowerCase()}.umd.js`,
            chunkFilename: `[name].chunk.js`,
        },
        plugins: [
            new MiniCssExtractPlugin({
                filename: `[name].css`,
                chunkFilename: `[name].chunk.css`,
            }),
        ],
        externals: [
            {
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
                '@jd/jmtd': 'Jmtd',
            },
            // /^@jd\/jmtd$/i,
        ],
    });
};
