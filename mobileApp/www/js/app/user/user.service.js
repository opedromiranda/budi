(function UserService($app, $angular) {
    'use strict';

    var _service = 'UserService',
        _storage = 'LocalStorageFactory';

    $angular.module($app.appName)
        .service(_service, [_storage, service]);

    function service($storage) {
        /*jshint validthis:true */

        var settings = {
            data: {
                key: 'UserService',
                default: {
                    user: undefined,
                    session: undefined
                },
                updates: []
            }
        };

        var storage = new $storage(settings.data.key, settings.data.default, settings.data.updates),
            _data = storage.get();


        this.getUser = function getUser() {
            return _data.user;
        };

        this.setUser = function setUser(data) {
            _data.user = data;
            storage.save();
        };

        this.clearUser = function clearUser() {
            _data.user = undefined;
            storage.reset();
        };

        this.getSession = function getSession() {
            return _data.session;
        };

        this.setSession = function setSession(data) {
            _data.session = data;
            storage.save();
        };

        this.clearSession = function clearSession(){
            _data.session = undefined;
            storage.reset();
        };

    }

})(this.app, this.angular);