(function ProfileBS($app, $angular) {
    'use strict';

    var _service = 'ProfileBS',
        _adapter = 'ProfileAdapter',
        _proxy = 'AppDataProxy',
        _user_service = 'UserService';

    $angular.module($app.appName)
        .service(_service, [_adapter, _user_service, _proxy, service]);

    function service($adapter, $user_service, $proxy) {
        /*jshint validthis:true */
        
        this.getUserInfo = $user_service.getUser();

        this.updateUser = function(user)
        {
            $user_service.setUser(user);
        };
        
    /*    this.getUserInfo = function getUserInfo() {
            var req = $adapter.getInfo.to();
            return $proxy.send(req).then(
                function onSuccess(data){
                    return $adapter.getInfo.from(data);
                },
                function onError(error){
                    throw error;
                });
        };
    */

    }

})(this.app, this.angular);