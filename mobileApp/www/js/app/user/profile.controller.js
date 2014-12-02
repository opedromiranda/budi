(function ProfileCtrl($app, $angular) {
    'use strict';

    var _controller = 'ProfileCtrl',
    	_profileBS = 'ProfileBS';

    $angular.module($app.appName)
        .controller(_controller, ['$scope', '$window', _profileBS, controller]);

    function controller($scope, $window, $profileBS)
    {
        $scope.user = $profileBS.getUserInfo;

        console.log($scope.user);
        
        $scope.openBrowser = function(link)
        {
            $window.open(link, '_self', 'location=no');
            
            return true;
        };

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