// Karma configuration file, see link for more information
// https://karma-runner.github.io/1.0/config/configuration-file.html

module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine', '@angular-devkit/build-angular'],
    plugins: [
      require('karma-sonarqube-unit-reporter'),
      require('karma-jasmine'),
      require('karma-chrome-launcher'),
      require('karma-jasmine-html-reporter'),
      require('karma-coverage'),
      require('@angular-devkit/build-angular/plugins/karma')
    ],
    client: {
      clearContext: false // leave Jasmine Spec Runner output visible in browser
    },
    coverageReporter: {
      dir: require('path').join(__dirname, './reports'),
      reporters: [
        {type: 'html', subdir: 'html'},
        {type: 'cobertura', subdir: 'cobertura', file: 'cobertura-coverage.xml'},
        {type: 'lcovonly', subdir: 'lcov', file: 'lcov.info'},
        {type: 'clover', subdir: 'clover', file: 'clover.xml'},
        {type: 'text-summary', subdir: 'coverage', file: 'summary.txt'}
      ]
    },
    reporters: ['progress', 'kjhtml', 'sonarqubeUnit', 'coverage'],
    sonarQubeUnitReporter: {
      sonarQubeVersion: 'LATEST',
      outputFile: 'reports/ut/ut_report.xml',
      useBrowserName: false
    },
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ['ChromeHeadlessNoSandbox'],
    customLaunchers: {
      ChromeHeadlessNoSandbox: {
        base: 'ChromeHeadless',
        flags: ['--no-sandbox']
      }
    },
    singleRun: true
  });
};
