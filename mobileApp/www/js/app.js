// Ionic Starter App
(function ($window, $app, $angular) {

    $angular.module($app.appName, ['ionic', 'budiProxy', 'ngCordova', /*'FacebookLogin',*/'BudiApi'])
        .config(['$stateProvider', '$urlRouterProvider', '$compileProvider', appConfig])
        .run(['$budiappConfig', '$ionicPlatform', '$log', '$http', appRun]);

    function appConfig($stateProvider, $urlRouterProvider, $compileProvider) {

        var states = {
            // Authentication
            'auth': {
                url: '/auth',
                abstract: true,
                templateUrl: 'templates/auth.html'
            },
            'auth.login': {
                url: '/login',
                views: {
                    'content': {
                        templateUrl: 'templates/auth/login.html',
                        controller: 'AuthLoginCtrl'
                    }
                }
            },
            // App
            'app': {
                url: '/app',
                abstract: true,
                templateUrl: 'templates/app.html',
                controller: 'AppCtrl'
            },
            // App navigation options
            'app.chat': {
                url: "/chat",
                views: {
                    'content': {
                        templateUrl: 'templates/app/chat.html',
                        controller: 'ChatCtrl'
                    }
                }
            },
            'app.budis':{
                url: "/budis",
                views: {
                    'content': {
                        templateUrl: "templates/app/budis.html",
                        controller: 'BudisCtrl'
                    }
                }
            },
            'app.budi_profile': {
                url: "/budis/profile",
                views: {
                    'content': {
                        templateUrl: "templates/app/budi_profile.html",
                        controller: 'ProfileCtrl'
                    }
                }
            },
            'app.profile': {
                url: "/profile",
                views: {
                    'content': {
                        templateUrl: "templates/app/profile.html",
                        controller: 'ProfileCtrl'
                    }
                }
            },
            'app.settings': {
                url: "/settings",
                views: {
                    'content': {
                        templateUrl: "templates/app/settings.html",
                        controller: 'SettingsCtrl'
                    }
                }
            }
        };
        
        for (var key in states)
            $stateProvider.state(key, states[key]);

        $urlRouterProvider.otherwise('/auth/login');

        // Configure href policy
        $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|javascript|ms-appx|x-wmapp0|chrome-extension):|data:image\/|filesystem:chrome-extension:/);
        $compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|ftp|file|blob|ms-appx|x-wmapp0|chrome-extension):|data:image\/|filesystem:chrome-extension:/);

        //$FacebookProvider.init('1416301545283139');
    }

    function appRun($config, $ionicPlatform, $log, $http) {

        console.log($config);

        $ionicPlatform.ready(function () {
            // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard for form inputs)
            if ($window.cordova && $window.cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            }
            if ($window.StatusBar) {
                // org.apache.cordova.statusbar required
                StatusBar.styleDefault();
            }

            // Fixing cross-domain problems
            $http.defaults.useXDomain = true;
            delete $http.defaults.headers.common["X-Requested-With"];
            delete $http.defaults.headers.post['content-type'];

        });

    }
    
})(this, this.app, this.angular);