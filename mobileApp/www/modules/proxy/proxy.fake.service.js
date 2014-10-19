(function($angular) {
    
    var _app = $angular.module('budiProxy'),
        _proxy = "FakeProxy";
    
    _app.service(_proxy, ["$budiappConfig", "$q", proxy]);
    
    function proxy($config, $q) {
        
        var config = $config.proxy.fake,
            _DEBUG = config.debug,
            _TAG = _proxy + ":";
        
        this.send = function send(request) {            
            var deferred = $q.defer();
            
            deferred.resolve(request.result);
            
            return deferred.promise;
        };
        
    };
    
})(this.angular);