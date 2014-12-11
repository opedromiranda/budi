(function LoginCtrl($app, $angular) {
    'use strict';

    var _controller = 'AuthLoginCtrl',
    	_authBS = 'AuthBS';

    $angular.module($app.appName)
        .controller(_controller, ['$scope', _authBS, controller]);

    function controller($scope, $authBS) 
    {
    	$scope.fbLogin = function fbLogin () 
        {
            if( $authBS.checkSession() )
                $authBS.go();
            else $authBS.fbLoginWithPermissions();
    	};

    }

})(this.app, this.angular);