// load all test files to create one bundle; see https://webpack.github.io/docs/usage-with-karma.html#alternative-usage
const testsContext = require.context('.', true, /.spec\.ts$/);
testsContext.keys().forEach(testsContext);