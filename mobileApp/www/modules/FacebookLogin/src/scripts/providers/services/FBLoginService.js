/*global FacebookLogin:true, FB:true*/
CDV = ( typeof CDV == 'undefined' ? {} : CDV );
var cordova = window.cordova || window.Cordova;
CDV.FB = {
    init: function(apiKey, fail) {
        // create the fb-root element if it doesn't exist
        if (!document.getElementById('fb-root')) {
            var elem = document.createElement('div');
            elem.id = 'fb-root';
            document.body.appendChild(elem);
        }
        cordova.exec(function() {
            var authResponse = JSON.parse(localStorage.getItem('cdv_fb_session') || '{"expiresIn":0}');
            if (authResponse && authResponse.expirationTime) {
                var nowTime = (new Date()).getTime();
                if (authResponse.expirationTime > nowTime) {
                    // Update expires in information
                    updatedExpiresIn = Math.floor((authResponse.expirationTime - nowTime) / 1000);
                    authResponse.expiresIn = updatedExpiresIn;

                    localStorage.setItem('cdv_fb_session', JSON.stringify(authResponse));
                    FB.Auth.setAuthResponse(authResponse, 'connected');
                }
            }
            console.log('Cordova Facebook Connect plugin initialized successfully.');
        }, (fail?fail:null), 'org.apache.cordova.facebook.Connect', 'init', [apiKey]);
    },
    login: function(params, cb, fail) {
        params = params || { scope: '' };
        cordova.exec(function(e) { // login
            if (e.authResponse && e.authResponse.expiresIn) {
                var expirationTime = e.authResponse.expiresIn === 0
                    ? 0
                    : (new Date()).getTime() + e.authResponse.expiresIn * 1000;
                e.authResponse.expirationTime = expirationTime;
            }
            localStorage.setItem('cdv_fb_session', JSON.stringify(e.authResponse));
            FB.Auth.setAuthResponse(e.authResponse, 'connected');
            if (cb) cb(e);
        }, (fail?fail:null), 'org.apache.cordova.facebook.Connect', 'login', params.scope.split(',') );
    },
    logout: function(cb, fail) {
        cordova.exec(function(e) {
            localStorage.removeItem('cdv_fb_session');
            FB.Auth.setAuthResponse(null, 'notConnected');
            if (cb) cb(e);
        }, (fail?fail:null), 'org.apache.cordova.facebook.Connect', 'logout', []);
    },
    getLoginStatus: function(cb, fail) {
        cordova.exec(function(e) {
            if (cb) cb(e);
        }, (fail?fail:null), 'org.apache.cordova.facebook.Connect', 'getLoginStatus', []);
    },
    dialog: function(params, cb, fail) {
        cordova.exec(function(e) { // login
            if (cb) cb(e);
        }, (fail?fail:null), 'org.apache.cordova.facebook.Connect', 'showDialog', [params] );
    }
};

FacebookLogin.service('FBLoginService', ['$rootScope', '$window', function ($rootScope, $window) {
    'use strict';
    var loggedIn = false,
        user = {},
        service = this;


    function initFB() {

        FB.init({
            appId      : '1547574108812210',
            xfbml      : true,
            version    : 'v2.1',
            cookie     : false,
            status     : true,
            nativeInterface: CDV.FB,
            useCachedDialogs: false
        });

        FB.Event.subscribe('auth.authResponseChange', service.handleResponse);
        if (typeof CDV === 'undefined') {
            console.log('CDV variable does not exist. Check that you have included cdv-plugin-fb-connect.js correctly');
        }
        if (typeof FB === 'undefined') {
            console.log('FB variable does not exist. Check that you have included the Facebook JS SDK file.');
        }
    }
    initFB();
    //document.addEventListener("deviceready", initFB, false);


    $window.checkLoginState = function () {
        FB.getLoginStatus(
            function(response) {
                service.handleResponse(response);
            }
        );
    };

    /**
     * Makes a call to FB Graph api to fetch user information
     */
    function getFBUserInfo() {
        FB.api('/me', function(response) {

        });
    }

    this.login = function login() {
        if(typeof facebookConnectPlugin !== 'undefined')
            facebookConnectPlugin.login(['email'], this.handleResponse, function() {alert('failure')});
        else {
            FB.login(function(response) {
                FB.api('/me', service.handleResponse);
            });
        }
    };

    /**
     * Handles FB.getLoginStatus and authResponseChange event responses
     * @param response
     */
    this.handleResponse = function handleResponse(response) {
        if(!response || response.error) {
            service.logOut();
            return;
        }

        $rootScope.$apply(function() {
            loggedIn = true;
            user = response;
        });
        $rootScope.$broadcast('loggedIn', response);
    };

    /**
     * Logs out using FB SDK
     */
    this.logOut = function logOut() {
        FB.logout();
        loggedIn = false;
        user = {};
    };

    /**
     * Returns true if user is logged in
     * @returns {boolean|{}}
     */
    this.isLoggedIn = function isLoggedIn() {
        return loggedIn && (user !== {});
    };

    /**
     * Returns user object
     * @returns {Object}
     */
    this.getUser = function getUser() {
        return user;
    };

}]);