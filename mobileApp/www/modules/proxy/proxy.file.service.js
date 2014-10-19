(function ProxyFile($angular) {
    
    var _app = $angular.module('budiProxy'),
        _proxy = "FileProxy";
    
    _app.service(_proxy, ["$budiappConfig", "$http", proxy]);
    
    function proxy($config, $http) {
        
        var config = $config.proxy.file,
            _DEBUG = config.debug,
            _TAG = _proxy + ":";
        
        var parseUrl = function parseUrl(url) {
            return url.replace(/\//g, '_').replace(/\?/g, '_').replace(/\&/g, '_');
        };
        
        this.send = function send(request) {            
            // Create new request based on previous one
            var httpRequest = angular.extend(request, {
                url: config.url + parseUrl(request.url) + ".json",
                method: "GET"
            });
            // Send to http proxy
            return $http(httpRequest).then(
                function onSuccess(data) {
                    console.log(_TAG, data);
                    return data.data;   
                },
                function onError(error) {
                    console.error(_TAG, error);
                    throw error;
                }
            );
        };
        
    }
    
})(this.angular);