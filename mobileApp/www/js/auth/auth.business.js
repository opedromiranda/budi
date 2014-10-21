(function AuthBS($app, $angular) {
    'use strict';

    var _business = 'AuthBS',
        _authAdapter = 'AuthAdapter',
        _userService = 'UserService',
        _proxy = 'AppDataProxy';
        //_fb = 'Facebook';

    $angular.module($app.appName)
        .service(_business, ['$q', '$state', '$ionicViewService', _authAdapter, _userService, _proxy, business]);

    function business($q, $state, $ionicViewService, $authAdapter, $userService, $proxy) {
        /*jshint validthis:true */

        var self = this;

        this.fbLogin = function fbLogin(){
            /*$fb.login(function(response) {
                console.log(response);
            });*/
            $ionicViewService.nextViewOptions({
                disableBack: true
            });
            $userService.setUser({
                name: 'Anthony Mark',
                avatar: './img/avatar1.jpg'
            })
            $state.go('app.chat');
            return true;
        };

        /*
        this.checkSession = function checkSession(){

            if( typeof $userService.getSession() !== 'undefined' ){
                // Disable tracking this page change
                $ionicViewService.nextViewOptions({
                    disableBack: true
                });
                return true;
            }
            else return false;
        };*/

        

        /*
        this.logout = function logout() {

            var req = $authAdapter.logout.to();
            return $proxy.send(req).then(
                function onSuccess(data){
                },
                function onError(error){
                    // TODO handle error
                    throw error;
                }).finally(function(){
                    $userService.clearSession();
                    $state.go('auth.login');
                });

        };*/

    }

})(this.app, this.angular);