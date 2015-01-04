(function AuthBS($app, $angular) {
    'use strict';

    var _business = 'AuthBS',
        _authAdapter = 'AuthAdapter',
        _userService = 'UserService',
        _budiapi = 'BudiApiService',
        _proxy = 'AppDataProxy';
        //_fbS = 'FacebookService';

    $angular.module($app.appName)
        .service(_business, ['$q', '$interval', '$rootScope', '$state', '$ionicViewService', '$cordovaFacebook', _authAdapter, _userService, _budiapi, _proxy, business]);

    function business($q, $interval, $rootScope, $state, $ionicViewService, $cordovaFacebook, $authAdapter, $userService, $budiapi, $proxy) {
        /*jshint validthis:true */

        var service = this;
        /*  === Facebook Login Service Methods ===
            login : $facebookLS.login
            isLoggedIn : $facebookLS.isLoggedIn
            logout : $facebookLS.logOut
            getUser : $facebookLS.getUser
        */

        this.fbLogin = function fbLogin(){
            $cordovaFacebook.getLoginStatus()
            .then(function success(response){
                //console.log("STATUS RESPONSE");
                //console.log(JSON.stringify(response));
                if(response.status !== "connected"){
                    $cordovaFacebook.login(["user_about_me", "user_birthday", "user_interests", "user_location", "user_relationship_details", "user_religion_politics"])
                    .then(function(success) {
                        getFbUserInfo();
                    }, function (error) {
                      console.log(JSON.stringify(error));
                    });
                }
                else {
                    getFbUserInfo();
                }
            }, 
            function error(e){
                console.log(JSON.stringify(e));
            });
        };

        function getFbUserInfo(){
            $cordovaFacebook.api("/me")
            .then(
                function(user_info) {
                  //console.log("THROUGH API");
                  //console.log(JSON.stringify(success));
                  budiApiLogin(user_info);
                }, function (error) {
                  //console.log("API ERROR");
                  console.log(error);
                }
            );
        }

        function budiApiLogin(user){
            var token = getFbAccessToken();
            $budiapi.login(user, token).then(
                function onSuccess(result) {
                    service.successLogin(user, result.data.data.budi._id);
                },
                function onError(error) {
                    console.log("LOGIN Fail");
                    console.log(JSON.stringify(error));
                    budiApiRegister(user);
                }
            );
        }

        function budiApiRegister(user){
            $budiapi.register(user).then(
                function onSuccess(result) {
                    service.successLogin(user, result.data.data.budi._id);
                },
                function onError(e){
                    console.log(JSON.stringify(e));
                }
            );
        }

        function getFbAccessToken(){
            return $cordovaFacebook.getAccessToken()
            .then(function(token) {
              //console.log("ACCESS TOKEN");
              //console.log(JSON.stringify(success));
              return token;
            }, function (error) {
              console.log(error);
              throw err;
            });
        }
        
        this.fbLoginWithPermissions = function()
        {
            //$facebookLS.loginWithPermissions();
        };

        this.successLogin = function successLogin(user, new_id){
            // Disable 'Back' button 
            $ionicViewService.nextViewOptions({
                disableBack: true
            });

            // Get User Info from Facebook
            var fb_user_info = user;//$facebookLS.getUser();
            fb_user_info._id = new_id;
            // Get Profile Picture
            var fb_user_picture;
            $authAdapter.getUserPicture()
            .then(
                function success(data){
                    fb_user_picture = $angular.copy(data.picture);
                }
            )
            .then(
                function(){
                    // Save User details
                    console.log(JSON.stringify(fb_user_info));
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
           // $facebookLS.logOut();
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