(function SettingsCtrl($app, $angular) {
    'use strict';
    
    var _controller = 'SettingsCtrl',
    _storage = 'LocalStorageFactory',
    _authBS = 'AuthBS';

    $angular.module($app.appName)
    .controller(_controller, ['$scope', '$ionicPopup', _storage, _authBS, controller]);

    function controller($scope, $ionicPopup, $storage, $authBS) {

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
            console.log("push state");
            // show toast -> not available yet
            storage.save();
        };

        $scope.showConfirm = function() {
            var confirmPopup = $ionicPopup.confirm({
                title: 'Logout',
                template: 'Are you sure you want to logout?'
            });
            
            confirmPopup.then(function(res) {
                if(res) {
                    $authBS.logout();
                }
            });
        };
 }

})(this.app, this.angular);