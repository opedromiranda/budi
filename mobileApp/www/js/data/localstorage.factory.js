(function($window, $app, $angular) {

    var _factory = "LocalStorageFactory",
        $storage = $window.localStorage;

    $angular.module($app.appName)
        .factory(_factory, ['$myappConfig', factory]);

    function factory($config) {

        var _settings = {
            workspace: {
                prefix: _factory + '_',
                sufix: ''
            }
        };

        function LocalData(name, def, updates, options) {
            // Save params
            this._name = name.toLowerCase();
            this._default = def;
            this._updates = updates;
            this._options = options || {};
            // Define local workspace
            this._workspace = _settings.workspace.prefix + this._name + _settings.workspace.sufix;
            this.data = {
                _version: 0,
                data: {}
            };
            // Define methods
            this.load = loadStorage;
            this.checkUpdates = checkUpdates;
            this.setVersion = setVersion;

            this.load();
        }

        LocalData.prototype.get = function get() {
            return this.data.data;
        };

        LocalData.prototype.save = function save() {
            $storage.setItem(this._workspace, JSON.stringify(this.data));
        };

        LocalData.prototype.reset = function reset() {
            this.data.data = angular.copy(this._default);
            this.save();
        };


        function loadStorage() {
            var fromStorage;
            try {
                fromStorage = JSON.parse($storage.getItem(this._workspace));
            } catch (error) {
                // Do noting
            }

            // If storage is not defined, save new one
            if (!fromStorage) {
                this.data.data = $angular.copy(this._default);
                if (this._options.forceUpdate === true) { // For updates
                    this.checkUpdates();
                } else {
                    this.setVersion(this._updates.length);
                    this.save();
                }
                return;
            }
            // There is data
            // Please check if it is in expected form
            if (fromStorage._version !== undefined)
                this.data = $angular.extend(this.data, fromStorage);
            else
                this.data.data = fromStorage;
            // Check for updates
            this.checkUpdates();
        }

        function checkUpdates() {
            // Get version from storage
            var index = Math.max(this.data._version || 0, 0);

            // Check that there is no update to do
            if (index >= this._updates.length)
                return;

            for (var i = index; i < this._updates.length; i++) {
                this._updates[i](this.data.data);
                this.setVersion(i + 1);
            }

            this.save();
        }

        function setVersion(version) {
            this.data._version = version;
        }

        return LocalData;
    }

})(this, this.app, this.angular);