// Karma configuration
// Generated on 2016-07-05

module.exports = function(config) {
  'use strict';

  config.set({
    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,

    // base path, that will be used to resolve files and exclude
    basePath: '../',

    // testing framework to use (jasmine/mocha/qunit/...)
    // as well as any additional frameworks (requirejs/chai/sinon/...)
    frameworks: [
      'jasmine'
    ],

    // list of files / patterns to load in the browser
    files: [
   'app/bower_components/angular/angular.js',
   'app/bower_components/angular-mocks/angular-mocks.js',
   'app/bower_components/jquery/dist/jquery.min.js',
   'app/bower_components/jasmine-jquery/lib/jasmine-jquery.js',
   'app/scripts/*.js',
   'app/scripts/**/*.js',
   //'test/mock/**/*.js',
   'test/spec/**/*.js',
   'app/bower_components/angular-resource/angular-resource.js',
   'app/bower_components/angular-cookies/angular-cookies.js',
   'app/bower_components/angular-sanitize/angular-sanitize.js',
   'app/bower_components/angular-route/angular-route.js',
   'app/views/**/*.html',
	 'app/views/*.html'
    ],

    // list of files / patterns to exclude
    exclude: [
    ],
    
    // test results reporter to use
    // possible values: 'dots', 'progress', 'mocha'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
		reporters: ['mocha', 'coverage'],
		
		preprocessors: {
      // source files, that you wanna generate coverage for
      // do not include tests or libraries
      // (these files will be instrumented by Istanbul)
      'app/scripts/*.js': ['coverage'],
      'app/scripts/**/*.js': ['coverage'],
      'app/views/*.html': 'ng-html2js',
			'app/views/**/*.html': 'ng-html2js'
    },
    
    // optionally, configure the reporter
    coverageReporter: {
      type : 'html',
      dir : 'test/coverage/'
    },
    
    ngHtml2JsPreprocessor: { 
			stripPrefix: 'app/',
			moduleName: 'views'
		},

    // web server port
    port: 8080,

    // Start these browsers, currently available:
    // - Chrome
    // - ChromeCanary
    // - Firefox
    // - Opera
    // - Safari (only Mac)
    // - PhantomJS
    // - IE (only Windows)
    browsers: [
      'PhantomJS',
      'Chrome'
    ],

    // Which plugins to enable
    plugins: [
      'karma-coverage',
      'karma-phantomjs-launcher',
      'karma-chrome-launcher',
      'karma-jasmine',
      'karma-mocha-reporter',
      'karma-ng-html2js-preprocessor'
    ],

    // Continuous Integration mode
    // if true, it capture browsers, run tests and exit
    singleRun: false,

    colors: true,

    // level of logging
    // possible values: LOG_DISABLE || LOG_ERROR || LOG_WARN || LOG_INFO || LOG_DEBUG
    logLevel: config.LOG_INFO,

    // Uncomment the following lines if you are using grunt's server to run the tests
    // proxies: {
    //   '/': 'http://localhost:9000/'
    // },
    // URL root prevent conflicts with the site root
    // urlRoot: '_karma_'
  });
};
