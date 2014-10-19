(function ProxyWeb($angular) {

    var _app = $angular.module('budiProxy'),
        _proxy = "WebProxy";

    _app.service(_proxy, ["$budiappConfig", "$http", proxy]);

    function proxy($config, $http) {

        var config = $config.proxy.web,
            _DEBUG = config.debug,
            _TAG = _proxy + ":";

        this.send = function send(request) {
            // Append default url
            request.url = config.url + '/' + request.url;
            // Create new request based on previous one
            var httpRequest = angular.extend({
                data: config.data,
                timeout: config.timeout
            }, request);
            
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