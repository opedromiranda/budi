/*global FacebookLogin:true*/

FacebookLogin.service('FBLoginService', ['$rootScope', '$window', function ($rootScope, $window) {

    var loggedIn = false,
        user = {},
        service = this;

    $window.fbAsyncInit = function() {
        FB.init({
            appId      : '1547574108812210',
            xfbml      : true,
            version    : 'v2.1',
            cookie     : true,
            status     : true
        });

        FB.Event.subscribe('auth.authResponseChange', service.handleResponse);
    };
    // Facebook SDK init code
    (function(d, s, id){
        var js, fjs = d.getElementsByTagName(s)[0];
        if (d.getElementById(id)) {return;}
        js = d.createElement(s); js.id = id;
        js.src = "//connect.facebook.net/en_US/sdk.js";
        fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));

    /**
     * Makes a call to FB Graph api to fetch user information
     */
    function getFBUserInfo() {
        FB.api('/me', function(response) {
            if(!response || response.error) {
                service.logOut();
                return;
            }

            $rootScope.$apply(function() {
                loggedIn = true;
                user = response;
            });
        });
    }

    /**
     * Handles FB.getLoginStatus and authResponseChange event responses
     * @param response
     */
    this.handleResponse = function handleResponse(response) {
        if (response.status === 'connected') {
            getFBUserInfo();
            // TODO create session for user
        } else {
            // TODO delete existing session
        }
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
        return loggedIn && (user != {});
    };

    /**
     * Returns user object
     * @returns {Object}
     */
    this.getUser = function getUser() {
        return user;
    };

}]);