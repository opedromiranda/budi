(function AuthBS($app, $angular) {
    'use strict';

    var _business = 'AuthBS',
        _authAdapter = 'AuthAdapter',
        _userService = 'UserService',
        _facebookLS = 'FBLoginService',
        _proxy = 'AppDataProxy';

    $angular.module($app.appName)
        .service(_business, ['$q', '$state', '$ionicViewService', _authAdapter, _userService, _facebookLS, _proxy, business]);

    function business($q, $state, $ionicViewService, $authAdapter, $userService, $facebookLS, $proxy) {
        /*jshint validthis:true */

        var self = this;
        /*  === Facebook Login Service Methods ===
            login : $facebookLS.login
            isLoggedIn : $facebookLS.isLoggedIn
            logout : $facebookLS.logOut
            getUser : $facebookLS.getUser
        */

        this.fbLogin = function fbLogin(){
            $facebookLS.login();
        };

        this.successLogin = function successLogin(){
            $ionicViewService.nextViewOptions({
                disableBack: true
            });
            var fb_user_info = $facebookLS.getUser(); 
            $userService.setUser({
                // TODO check what facebook returns
                name: 'Anthony Mark',
                avatar: './img/avatar1.jpg'
            });
            $state.go('app.chat');
            return true;
        };

        this.checkSession = function checkSession(){
            return $facebookLS.isLoggedIn();
        };

        this.logout = function logout() {
            $facebookLS.logOut();
            $state.go('auth.login');
        };

    }

})(this.app, this.angular);