(function ChatAdapter($app, $angular) {
    'use strict';
    
    var _adapter = 'ChatAdapter';
    
    $angular.module($app.appName)
        .service(_adapter, ['$budiappConfig',adapter]);
        
    function adapter($budiappConfig) {

    }

})(this.app, this.angular);