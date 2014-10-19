(function SettingsCtrl($app, $angular) {
    'use strict';
    
    var _controller = 'SettingsCtrl',
        _storage = 'LocalStorageFactory';

    $angular.module($app.appName)
        .controller(_controller, ['$scope', _storage, controller]);
        
    function controller($scope, $storage) {
        
        var storage_settings = {
            data: {
                key: 'SettingsService',
                default: {
                    push: true
                },
                updates: []
            }
        };

        var storage = new $storage(storage_settings.data.key, storage_settings.data.default, storage_settings.data.updates);
        $scope.settingsData = storage.get();

        $scope.setNotifications = function setNotifications() {
            storage.save();
        };
    }
    
})(this.app, this.angular);