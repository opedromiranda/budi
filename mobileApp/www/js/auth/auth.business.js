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
            
            $budiapi.login(user).then(
                function onSuccess(result) {
                    service.successLogin(result.data.data.budi._id);
                },
                function onError(error) {
                    console.log("LOGIN Fail", error);
                    $budiapi.register(user).then(
                        function onSuccess(result) {
                            service.successLogin(result.data.data.budi._id);
                        },
                        function onError(e){
                            console.log(e);
                            throw e;
                        }
                    );
                }
            );
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
                        $angular.extend({}, fb_user_info, 
                        { 
                            picture: fb_user_picture,
                            budis: [],
                            blocked: [],
                            twitter: '', 
                            linkedin: '',
                            instagram: '', 
                            reddit: '', 
                            googleplus: '', 
                            skype: '',
                            show: 
                            {
                                show: false,
                                bio: true,
                                interested_in: true,
                                religion: true,
                                political: true,
                                facebook: true,
                                twitter: true,
                                linkedin: true,
                                instagram: true,
                                reddit: true,
                                googleplus: true,
                                skype: true
                            },
                        }));
                }
            ).finally(function(){
                console.log("Successful Login!", $userService.getUser());
                // Finally go to app
                $state.go('app.chat');
                return true;
            });
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