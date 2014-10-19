(function ($angular) {

    var _app = $angular.module('budiProxy', []),
        _proxyService = "ProxyService",
        _webProxy = "WebProxy",
        _fileProxy = "FileProxy",
        _fakeProxy = "FakeProxy",
        _webTransferProxy = "WebTransferProxy";

    _app.service(_proxyService, ["$budiappConfig", _webProxy, _fileProxy, _fakeProxy, _webTransferProxy, proxy]);

    function proxy($config, webProxy, fileProxy, fakeProxy, webTransferProxy) {
        
        var config = $config.proxy._default,
            _TAG = _proxyService + ":",
            _DEBUG = config.debug;

        var _proxies = {
            WEB: webProxy,
            FILE: fileProxy,
            FAKE: fakeProxy,
            WEBTRANSFER: webTransferProxy
        };

        /**
            Send a new request using a policy.
            Default policy is ONLINE. Use request.policy to define your policy.
            Available policies: ONLINE, FILE, FAKE
            @method send
        **/
        this.send = function send(request) {
            // Make sure we have a policy
            request.policy = request.policy || "web";
            
            // Get policy (proxy)
            var proxy = _proxies[request.policy.toUpperCase()];
            
            // Define proxy handlers
            var onSuccess = function onSuccess(data) {
                console.log(_TAG, "onSuccess from", proxy.toString(), "#", JSON.stringify(data));
                return data;
            };
            var onError = function onError(error) {
                console.error(_TAG, "onError from", proxy.toString(), "#", JSON.stringify(error));
                throw error;
            };
            
            // Send request to proxy
            console.log(_TAG, "send to", proxy.toString(), "#", JSON.stringify(request));
            return proxy.send(request).then(onSuccess, onError);
        };

    }

})(this.angular);