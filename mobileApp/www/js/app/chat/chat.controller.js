(function ChatCtrl($app, $angular) {
    'use strict';

    var _controller = 'ChatCtrl';

    $angular.module($app.appName)
        .controller(_controller, ['$scope', controller]);

    function controller($scope) {
    	$scope.chat = "";

    }

})(this.app, this.angular);