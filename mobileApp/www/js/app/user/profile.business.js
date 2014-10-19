(function ProfileBS($app, $angular) {
    'use strict';

    var _service = 'ProfileBS',
        _adapter = 'ProfileAdapter',
        _proxy = 'AppDataProxy';

    $angular.module($app.appName)
        .service(_service, [_adapter, _proxy, service]);

    function service($adapter, $proxy) {
        /*jshint validthis:true */
        
        this.getUserInfo = function getUserInfo() {
            var req = $adapter.getInfo.to();
            return $proxy.send(req).then(
                function onSuccess(data){
                    return $adapter.getInfo.from(data);
                },
                function onError(error){
                    throw error;
                });
        };

    }

})(this.app, this.angular);