(function MenuCtrl($app, $angular) {
    'use strict';

    var _controller = 'AppMenuCtrl',
        _menuService = 'MenuService',
        _userService = 'UserService';

    $angular.module($app.appName)
        .controller(_controller, ['$scope', '$window', '$state', _menuService, _userService, controller]);

    function controller($scope, $window, $state, $menuService, $userService) 
    {
        $scope.items = [];
        $scope.user_info = $userService.getUser();

        $menuService.list('left').then(
            function onSuccess(data) {
                console.log(data);
                $scope.items = data;
            });

        $scope.goToState = function(state)
        {
            var full_state = '#/app/' + state.toLowerCase();

            $window.location.href = full_state;
        };
        
        $scope.goToState2 = function(state)
        {
            var full_state = 'app.' + state.toLowerCase();

            $state.go(full_state);
        };
    }

})(this.app, this.angular);