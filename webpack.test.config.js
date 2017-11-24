const webpack = require('webpack'); // eslint-disable-line import/no-unresolved

const devWebConfig = require('./webpack.dev.config');


devWebConfig.plugins.push(new webpack.SourceMapDevToolPlugin({
    filename: null,
    test: /\.(ts|js)($|\?)/i
}));

// abort testing if webpack does not compile
devWebConfig.plugins.push({
    apply: (compiler) => {
        compiler.plugin('done', (stats) => {
            if (stats.compilation.errors.length > 0) {
                throw new Error(stats.compilation.errors.map((err) => err.message || err));
            }
        });
    }
});

devWebConfig.module.rules.push({
    test: /src\/.+\.ts$/,
    exclude: /(node_modules|\.spec\.ts$)/,
    loader: 'sourcemap-istanbul-instrumenter-loader?force-sourcemap=true',
    enforce: 'post'
});
module.exports = devWebConfig;