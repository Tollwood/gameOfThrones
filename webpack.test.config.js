const webpack = require('webpack'); // eslint-disable-line import/no-unresolved

const devWebConfig = require('./webpack.dev.config');


devWebConfig.plugins.push(new webpack.SourceMapDevToolPlugin({
    filename: null,
    test: /\.(ts|js)($|\?)/i
}));

devWebConfig.module.rules.push({
    test: /src\/.+\.ts$/,
    exclude: /(node_modules|\.spec\.ts$)/,
    loader: 'sourcemap-istanbul-instrumenter-loader?force-sourcemap=true',
    enforce: 'post'
});
module.exports = devWebConfig;