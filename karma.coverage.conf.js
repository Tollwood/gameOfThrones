module.exports = function (config) {
    config.set({
        basePath: '',
        frameworks: ['jasmine', 'karma-typescript'],
        files: [
            { pattern: 'src/logic/**/*.ts' },
            { pattern: 'test/**/*.ts' }
        ],
        preprocessors: {
            'src/logic/**/*.ts': ['karma-typescript', 'coverage'],
            'test/**/*.ts': ['karma-typescript']
        },
        reporters: ['progress','coverage', 'karma-typescript'],

        port: 9876,
        colors: true,
        browsers: ['PhantomJS'],
        singleRun: false,
        concurrency: Infinity
    })
}
