const path = require('path');
const fs = require('fs-extra');
const { ProductConfigOnly } = require('./split.config.js');
const { DevConfigOnly } = require('./split.config.js');
const { BabelLoaderRules } = require('./split.config.js');
const { EsLoaderRules } = require('./split.config.js');
const { getPkgInfo } = require('../../utils');

module.exports = env => {
    const { root, esb, entry, debug } = env;
    const currentProDir = root || process.cwd();

    const rules = esb ? EsLoaderRules : BabelLoaderRules;

    const { pkgName: packageName, version } = getPkgInfo(currentProDir);
    const { output, mode, devtool, plugins, ...evnConfigRest } = (
        debug ? DevConfigOnly : ProductConfigOnly
    )({
        currentProDir,
        packageName,
        version,
        ...env,
    });

    return {
        entry,
        output,
        mode,
        devtool,
        plugins,
        optimization: !debug && rules.optimization,
        module: {
            rules: [
                ...rules.rules,
                // 处理图片资源
                {
                    test: /\.(png|jpg|jpeg|gif|svg)$/i,
                    // include: /(src)|(entry)|(node_modules\/@jd)/,
                    // exclude: /node_modules/,
                    type: 'asset/inline',
                    parser: {
                        dataUrlCondition: {
                            maxSize: 10000000 * 1024, // 4kb
                        },
                    },
                },
                // 处理图片资源
                {
                    test: /\.(png|jpg|jpeg|gif|svg)$/i,
                    type: 'asset',
                    parser: {
                        dataUrlCondition: {
                            maxSize: 10 * 1024, // 10kb
                        },
                    },
                    generator: {
                        filename: 'assets/images/[name][ext][query]',
                    },
                },
                // 处理字体文件
                {
                    test: /\.(eot|ttf|woof|woof2|woff)$/i,
                    type: 'asset/resource',
                    generator: {
                        filename: 'assets/images/[name][ext][query]',
                    },
                },
            ],
        },
        resolve: {
            extensions: ['.tsx', '.ts', '.js', '.jsx', '.css', '.scss', '.less'],
        },
        // externals: {
        //   react: 'React',
        //   'react-dom': 'ReactDOM',
        // },
        ...evnConfigRest,
    };
};
