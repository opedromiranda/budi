(function AuthAdapter($app, $angular) {
    'use strict';

    var _adapter = 'AuthAdapter';

    $angular.module($app.appName)
        .service(_adapter, ['$budiappConfig', adapter]);

    function adapter($config) {
        /*jshint validthis:true */

    }

})(this.app, this.angular);