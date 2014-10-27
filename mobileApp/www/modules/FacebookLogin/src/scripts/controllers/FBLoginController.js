/*FacebookLogin.controller('FacebookLoginController', ['$scope', '$window', 'FBLoginService',
    function($scope, $window, FBLoginService) {
        'use strict';
        $scope.isLoggedIn = FBLoginService.isLoggedIn;
        $scope.logOut = FBLoginService.logOut;
        $scope.getUser = FBLoginService.getUser;

        $window.checkLoginState = function () {
            FB.getLoginStatus(
                function(response) {
                    FBLoginService.handleResponse(response);
                }
            );
        };
    }
]);*/