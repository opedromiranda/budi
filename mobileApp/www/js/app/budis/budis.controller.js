(function BudisCtrl($app, $angular) 
 {
    'use strict';

    var _controller = 'BudisCtrl',
    _service = 'BudisService';

    $angular.module($app.appName)
        .controller(_controller, ['$scope', _service, '$ionicScrollDelegate', 'filterFilter', controller]);

    function controller($scope, $service, $ionicScrollDelegate, $filterFilter) 
    {

        $scope.budisList = $service.getBudisList();

        $scope.data = $service.data;

        $scope.onBudiDelete = function(budi) 
        {
        $scope.budisList.splice($scope.budisList.indexOf(budi), 1);

        //função eliminar budi ->> servidor
        $scope.deleteBudi = $service.deleteBudi();
        };

    }

})(this.app, this.angular);
