(function AppDataProxyService($app, $angular) {
    'use strict';
    
    var _service = 'AppDataProxy',
        _proxy = 'ProxyService',
        _userService = 'UserService';
    
    $angular.module($app.appName)
        .service(_service, ['$myappConfig', _proxy, _userService, service]);
        
    function service($config, $proxy, $userService) {
        /*jshint validthis:true */
        
        /**
            Send this request to proxy.
            This is needed to parse App/Server logical protocol!
            By doing this, we make sure that our proxy just do its job.
            @method send
        **/
        this.send = function send(request) {

            // Add session header if exists
            var session = $userService.getSession();
            if (session) {
                request.headers = request.headers || {};
                request.headers['Access-Token'] = session.token;
            }

            function onSuccess(data) {

                if (!data)
                    throw 'DATA_NOT_FOUND';
                
                if (typeof(data.status) === 'undefined'){
                    throw 'RESPONSE_UNKOWN';
                }
                
                if (data.status !== 0) {
                    throw data;
                }
                
                return data.data;
            }
            
            function onError(error) {
                throw error;   
            }
            
            return $proxy.send(request).then(onSuccess, onError);
        };
        
    }
    
})(this.app, this.angular);