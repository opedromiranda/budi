(function MenuCtrl($app, $angular) {
    'use strict';

    var _controller = 'AppMenuCtrl',
        _menuService = 'MenuService',
        _userService = 'UserService';

    $angular.module($app.appName)
        .controller(_controller, ['$scope', _menuService, _userService, controller]);

    function controller($scope, $menuService, $userService) {

        $scope.items = [];
        $scope.user_info = $userService.getUser();

        $menuService.list('left').then(
            function onSuccess(data) {
                console.log(data);
                $scope.items = data;
            });

    }

})(this.app, this.angular);