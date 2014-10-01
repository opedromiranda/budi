module.exports = function(config) {

    var file,
        jsAssetsFile,
        srcFiles;

    file = require('./node_modules/grunt/lib/grunt/file.js');
    jsAssetsFile = file.glob.sync("**/js-assets.json")[0];

    srcFiles = [
        'bower_components/angular/angular.js',
        'bower_components/angular-route/angular-route.js',
        'bower_components/angular-mocks/angular-mocks.js',
        'tests/*.js',
        'js/modules/**/tests/**/*.js',
        'js/modules/**/src/views/*.html'
    ];

    file.readJSON(jsAssetsFile).forEach(function (asset) {
        srcFiles.push(asset);
    });

    config.set({
        // base path, that will be used to resolve files and exclude
        basePath: '.',

        frameworks: ['jasmine'],

        // list of files / patterns to load in the browser
        files: srcFiles,

        // list of files to exclude
        exclude: [
        ],

        preprocessors: {
            'client/*.js': ['jasmine'],
            'test/client/*.js': ['jasmine'],
            'js/modules/**/src/views/*.html': ['ng-html2js']
        },

        ngHtml2JsPreprocessor: {
            // use stripPrefix and prependPrefix to adjust it.

            // the name of the Angular module to create
            moduleName: "Budi.templates"
        },

        // use dots reporter, as travis terminal does not support escaping sequences
        // possible values: 'dots', 'progress'
        // CLI --reporters progress
        reporters: ['progress'],

        // web server port
        // CLI --port 9876
        port: 9876,

        // enable / disable colors in the output (reporters and logs)
        // CLI --colors --no-colors
        colors: true,

        // level of logging
        // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
        // CLI --log-level debug
        logLevel: config.LOG_INFO,

        // enable / disable watching file and executing tests whenever any file changes
        // CLI --auto-watch --no-auto-watch
        autoWatch: true,

        // Start these browsers, currently available:
        // - Chrome
        // - ChromeCanary
        // - Firefox
        // - Opera
        // - Safari (only Mac)
        // - PhantomJS
        // - IE (only Windows)
        // CLI --browsers Chrome,Firefox,Safari
        //browsers: [process.env.TRAVIS ? 'Firefox' : 'Chrome'],
        browsers: ['PhantomJS'],

        // If browser does not capture in given timeout [ms], kill it
        // CLI --capture-timeout 5000
        captureTimeout: 20000,

        // Auto run tests on start (when browsers are captured) and exit
        // CLI --single-run --no-single-run
        singleRun: false,

        // report which specs are slower than 500ms
        // CLI --report-slower-than 500
        reportSlowerThan: 500,

        plugins: [
            'karma-jasmine',
            'karma-chrome-launcher',
            'karma-firefox-launcher',
            'karma-phantomjs-launcher',
            'karma-ng-html2js-preprocessor'
        ]
    });
};