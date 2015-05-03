var fs = require('fs');

module.exports = function(config) {

  // Use ENV vars on Travis and sauce.json locally to get credentials
  if (!process.env.SAUCE_USERNAME) {
    if (!fs.existsSync('sauce.json')) {
      console.log('Create a sauce.json with your credentials based on the sauce-sample.json file.');
      process.exit(1);
    } else {
      process.env.SAUCE_USERNAME = require('./sauce').username;
      process.env.SAUCE_ACCESS_KEY = require('./sauce').accessKey;
    }
  }

  // Check the environment variables for a binding
  // on TRAVIS_LAUNCHES_SAUCE_CONNECT, which indicates Travis
  // launches Sauce Connect instead of this script
  var thisFileLaunchesSauceConnect = true;
  if (process.env.TRAVIS_LAUNCHES_SAUCE_CONNECT) {
    thisFileLaunchesSauceConnect = false;
  }

  // List the files that you want to always test here.
  // The .travis.yml file can also pass in other files
  // by exporting an environment variable containing a list of
  // Javascripts.
  var filesToTest = ['sample_test.js'];

  var filesToExcludeFromTest = [];
  if (process.env.FILES_TO_TEST) {
    filesToTest = filesToTest.concat(process.env.FILES_TO_TEST.split(","));
  }
  if (process.env.FILES_TO_EXCLUDE_FROM_TEST) {
    filesToExcludeFromTest = filesToExcludeFromTest.concat(process.env.FILES_TO_EXCLUDE_FROM_TEST.split(","));
  }

  // Browsers to run on Sauce Labs
  var customLaunchers = {
    'sl_safari': {
      base: 'SauceLabs',
      browserName: 'safari',
      platform: 'OSX 10.8'
    }
  };

  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',

    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['jasmine'],

    // list of files / patterns to load in the browser
    files: filesToTest,

    // files to exclude from testing
    exclude: filesToExcludeFromTest,

    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['dots', 'saucelabs'],

    // web server port
    port: 9876,

    colors: true,

    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,

    sauceLabs: {
      startConnect: thisFileLaunchesSauceConnect,
      testName: 'Privly Safari extension Jasmine Testing: Karma and Sauce Labs',
      tunnelIdentifier: process.env.TRAVIS_JOB_NUMBER,
      build: process.env.TRAVIS_BUILD_NUMBER
    },
    captureTimeout: 120000,
    customLaunchers: customLaunchers,

    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: Object.keys(customLaunchers),
    singleRun: true
  });
};