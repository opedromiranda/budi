(function ProfileAdapter($app, $angular) {
    'use strict';

    var _service = 'ProfileAdapter';

    $angular.module($app.appName)
        .service(_service, ['$budiappConfig', service]);

    function service($config) {
        /*jshint validthis:true */
        
        var config = $config.profile,
            endpoints = config.endpoints;

        this.getInfo = {
            to: function to() {
                return $angular.extend({}, endpoints._default, endpoints.info);
            },
            from: function from(data) {
                return data;
            }
        };
    }

})(this.app, this.angular);