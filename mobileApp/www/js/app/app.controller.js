(function AppCtrl($app, $angular) {
    'use strict';
    
    var _controller = 'AppCtrl';

    
    $angular.module($app.appName)
        .controller(_controller, ['$scope', controller]);
        
    function controller($scope) {
        
        // For now, just do noting my friend
        
    }
    

    
})(this.app, this.angular);