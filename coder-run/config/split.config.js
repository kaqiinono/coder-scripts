const path = require('path');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const { ESBuildMinifyPlugin } = require('esbuild-loader');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { getConfig } = require('../utils');

const EsLoaderRules = {
    rules: [
        {
            test: /\.ts$/,
            loader: 'esbuild-loader',
            options: {
                target: 'es2015',
            },
        },
        {
            test: /\.tsx?$/,
            loader: 'esbuild-loader',
            options: {
                loader: 'tsx',
                target: 'es2015',
            },
        },
        {
            test: /\.(jsx?)$/,
            // include: /(src)|(node_modules\/@jd)/,
            use: {
                loader: 'esbuild-loader',
                options: {
                    loader: 'jsx', // Remove this if you're not using JSX
                    target: 'es2015',
                },
            },
        },
        {
            test: /\.css$/i,
            use: [
                'style-loader',
                'css-loader',
                {
                    loader: 'esbuild-loader',
                    options: {
                        loader: 'css',
                        minify: true,
                    },
                },
            ],
        },
        {
            test: /\.scss$/,
            use: [
                'style-loader',
                'css-loader',
                {
                    loader: 'postcss-loader', // 不要更换顺序，否则行内注释不生效
                    options: {
                        postcssOptions: {
                            plugins: [['postcss-preset-env']],
                        },
                    },
                },
                {
                    loader: 'sass-loader',
                    options: {
                        sourceMap: true,
                    },
                },
            ],
        },
        {
            test: /\.less$/,
            use: [
                'style-loader',
                'css-loader',
                {
                    loader: 'postcss-loader', // 不要更换顺序，否则行内注释不生效
                    options: {
                        postcssOptions: {
                            plugins: [['postcss-preset-env']],
                        },
                    },
                },
                {
                    loader: 'less-loader',
                    options: {
                        sourceMap: true,
                    },
                },
            ],
        },
    ],
    optimization: {
        minimize: true,
        minimizer: [
            '...',
            new CssMinimizerPlugin(),
            new ESBuildMinifyPlugin({
                target: 'es2015', // Syntax to compile to (see options below for possible values)
            }),
        ],
    },
};

const BabelLoaderRules = {
    rules: [
        {
            test: /\.(ts|tsx)$/,
            exclude: /node_modules/,
            use: ['ts-loader'],
        },
        {
            test: /\.(js|jsx)$/,
            // include: /(src)|(node_modules\/@jd)/,
            use: {
                loader: 'babel-loader',
                options: {
                    configFile: path.join(__dirname, './babel.config.js'),
                    cacheDirectory: true,
                    plugins: [
                        [
                            'import', // 按需引入在babel的配置中不生效，所以放在此处
                            {
                                libraryName: 'jmtd',
                                style: 'css',
                            },
                            'jmtd',
                        ],
                        [
                            'import',
                            {
                                libraryName: 'jmtd-charts',
                                style: 'css',
                            },
                            'jmtd-charts',
                        ],
                        [
                            'import',
                            {
                                libraryName: 'jmtd-pro',
                                style: 'css',
                            },
                            'jmtd-pro',
                        ],
                    ],
                },
            },
        },
        {
            test: /\.css$/i,
            use: [
                'style-loader',
                'css-loader',
                {
                    loader: 'esbuild-loader',
                    options: {
                        loader: 'css',
                        minify: true,
                    },
                },
            ],
        },
        {
            test: /\.scss$/,
            use: [
                'style-loader',
                'css-loader',
                {
                    loader: 'postcss-loader', // 不要更换顺序，否则行内注释不生效
                    options: {
                        postcssOptions: {
                            plugins: [['postcss-preset-env']],
                        },
                    },
                },
                {
                    loader: 'sass-loader',
                    options: {
                        sourceMap: true,
                    },
                },
            ],
        },
        {
            test: /\.less$/,
            use: [
                'style-loader',
                'css-loader',
                {
                    loader: 'postcss-loader', // 不要更换顺序，否则行内注释不生效
                    options: {
                        postcssOptions: {
                            plugins: [['postcss-preset-env']],
                        },
                    },
                },
                {
                    loader: 'less-loader',
                    options: {
                        sourceMap: true,
                    },
                },
            ],
        },
    ],
    optimization: {
        minimize: true,
        minimizer: ['...', new CssMinimizerPlugin()],
    },
};

const ProductConfigOnly = ({ currentProDir, packageName }) => ({
    output: {
        path: path.join(currentProDir, 'dist'),
        filename: `ShareCode.${packageName}.js`,
        library: ['ShareCode', `${packageName}`],
        libraryTarget: 'umd',
    },
    mode: 'production',
    devtool: 'hidden-source-map',
    plugins: [
        new CleanWebpackPlugin({
            verbose: true,
        }),
    ],
});

const DevConfigOnly = ({ version, entry, currentProDir }) => {
    // setHtmlFile(currentProDir);
    const { host, port, proxy } = getConfig(currentProDir);
    return {
        entry: [entry, 'react-hot-loader/patch'],
        mode: 'development',
        devtool: 'inline-source-map',
        output: {
            filename: 'js/[name].js',
            chunkFilename: 'js/[name].chunk.js',
        },
        target: 'web',
        plugins: [
            new HtmlWebpackPlugin({
                title: '代码共享',
                version,
                template: path.resolve(currentProDir, 'public/index.html'),
                filename: 'index.html',
                minify: {
                    // 压缩html
                    collapseWhitespace: true, // 压缩空白
                    removeComments: true, // 去除注释
                },
                // chunks: Object.keys(entry) 单页面不需要，默认提取所有chunks
            }),
            new FriendlyErrorsWebpackPlugin({
                compilationSuccessInfo: {
                    messages: [`You application is running here ${host}:${port}`],
                    notes: [`proxyServer:${testServer}`],
                },
                onErrors() {
                    console.error(`You application is running here ${host}:${port}`);
                },
            }),
        ],
        devServer: {
            historyApiFallback: true,
            port,
            host,
            client: {
                overlay: {
                    errors: false,
                    warnings: false,
                },
            },
            proxy,
        },
    };
};

module.exports = {
    EsLoaderRules,
    BabelLoaderRules,
    DevConfigOnly,
    ProductConfigOnly,
};
