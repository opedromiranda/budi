(function ProfileCtrl($app, $angular) {
    'use strict';

    var _controller = 'ProfileCtrl',
    	_profileBS = 'ProfileBS';

    $angular.module($app.appName)
        .controller(_controller, ['$scope', _profileBS, controller]);

    function controller($scope, $profileBS) {
        $scope.user = {};

        // TODO update profile as necessary, so if offline we have something
        /*$profileBS.getUserInfo().then(
        	function onSuccess(data){
       			$scope.user = data;
        	},
        	function onError(error){
        		console.log(error);
        	}
        );*/
    }

})(this.app, this.angular);