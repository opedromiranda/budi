(function AuthBS($app, $angular) {
    'use strict';

    var _business = 'AuthBS',
        _authAdapter = 'AuthAdapter',
        _userService = 'UserService',
        _facebookLS = 'FBLoginService',
        _budiapi = 'BudiApiService',
        _proxy = 'AppDataProxy';

    $angular.module($app.appName)
        .service(_business, ['$q', '$rootScope', '$state', '$ionicViewService', _authAdapter, _userService, _facebookLS, _budiapi, _proxy, business]);

    function business($q, $rootScope, $state, $ionicViewService, $authAdapter, $userService, $facebookLS, $budiapi, $proxy) {
        /*jshint validthis:true */

        var service = this;
        /*  === Facebook Login Service Methods ===
            login : $facebookLS.login
            isLoggedIn : $facebookLS.isLoggedIn
            logout : $facebookLS.logOut
            getUser : $facebookLS.getUser
        */

        this.fbLogin = function fbLogin(){
            $facebookLS.login();
        };
        
        this.fbLoginWithPermissions = function()
        {
            $facebookLS.loginWithPermissions();
        };

        $rootScope.$on('loggedIn', function (event, user) {
            user.from = 'facebook';

            $budiapi.login(user).then(function (result) {
                service.successLogin(result.data.budi_id);
            });
        });

        this.successLogin = function successLogin(new_id){
            // Disable 'Back' button 
            $ionicViewService.nextViewOptions({
                disableBack: true
            });

            // Get User Info from Facebook
            var fb_user_info = $facebookLS.getUser();

            fb_user_info._id = new_id;
            // Get Profile Picture
            var fb_user_picture;
            $authAdapter.getUserPicture()
            .then(
                function success(data){
                    fb_user_picture = $angular.copy(data.pictureURL);
                }
            )
            .then(
                function(){
                    // Save User details
                    $userService.setUser(
                        $angular.extend({}, fb_user_info, { picture: fb_user_picture })
                    );
                }
            );
            console.log("Successful Login!", fb_user_info);
            // Finally go to app
            $state.go('app.chat');
            return true;
        };

        this.checkSession = function checkSession(){
            if($facebookLS.isLoggedIn()){
                $budiapi.login($userService.getUser()).then(function (result) {
                    service.successLogin(result.data.budi_id);
                    return true;
                },
                function e(e){
                    return false;
                });
            }
            else return false;
        };

        this.logout = function logout() {
            $facebookLS.logOut();
            $ionicViewService.nextViewOptions({
                disableBack: true
            });
            $state.go('auth.login');
        };

        this.go = function go(){
            $state.go('app.chat');
        };

    }

})(this.app, this.angular);