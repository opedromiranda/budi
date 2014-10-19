(function MenuService($app, $angular) {
    'use strict';
    
    var _service = 'MenuService';
    
    $angular.module($app.appName)
        .service(_service, ['$budiappConfig', '$q', service]);
        
    function service($config, $q) {
        /*jshint validthis:true */
        
        var config = $config.menu;
        
        this.list = function list(name) {
            var deffered = $q.defer();
            
            if (config[name])
                deffered.resolve(config[name].content);
            else
                deffered.reject();
            
            return deffered.promise;
        };
        
    }
    
})(this.app, this.angular);