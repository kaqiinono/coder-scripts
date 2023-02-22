const paths = require('./paths.js');
const { getPkgInfo } = require('../../utils');
const { pkgName: packageName, version } = getPkgInfo(paths.appPath);
const { merge } = require('webpack-merge');
const common = require('./webpack.config');
const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = function (webpackEnv) {
    return merge(common(webpackEnv), {
        entry: path.resolve(paths.appPath, '.jcode/main.js'),
        output: {
            library: ['ShareCode', `${packageName}`],
            // libraryExport: 'default',
            libraryTarget: 'umd',
            filename: `[name].js`,
            chunkFilename: `[name].chunck.js`,
        },
        plugins: [
            new MiniCssExtractPlugin({
                // Options similar to the same options in webpackOptions.output
                // both options are optional
                filename: `[name].css`,
                chunkFilename: `[name].chunk.css`,
            }),
        ],
        // optimization: {
        //     minimize: true,
        //     minimizer: [
        //         // 使用 `...` 扩展现有的 minimizer（即 `terser-webpack-plugin`）
        //         '...',
        //     ],
        //     // sideEffects: true,
        //     // moduleIds: 'deterministic',
        //     // runtimeChunk: 'single',
        //     splitChunks: {
        //         chunks: 'all',
        //         cacheGroups: {
        //             defaultVendors: {
        //                 test: /[\\/]node_modules[\\/]/,
        //                 name: 'share-vendor',
        //                 reuseExistingChunk: true,
        //                 priority: 10,
        //             },
        //         },
        //     },
        // },
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
            },
            /^@jd\/jmtd$/i,
        ],
    });
};
