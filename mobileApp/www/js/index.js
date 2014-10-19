(function (window, document, angular, utils) {

    window.app = {
        configFile: undefined,
        appName: "budiApp",
        /**
            Application Constructor
        */
        initialize: function initialize(configFile) {
            this.configFile = configFile; // save copy
            this.bindEvents();
        },
        /**
            Bind Event Listeners
            Bind any events that are required on startup. Common events are:
            'load', 'deviceready', 'offline', and 'online'.
        */
        bindEvents: function bindEvents() {
            document.addEventListener('deviceready', this.onDeviceReady, false);
            document.addEventListener('resume', this.onResume, false);
            document.addEventListener('backbutton', this.onBackButton, false);
        },
        /**
            Just print outloud that you received an event
        */
        receivedEvent: function receivedEvent(id) {
            console.log('Received Event: ' + id);
        },
        /**
            deviceready Event Handler
            The scope of 'this' is the event. In order to call the 'receivedEvent'
            function, we must explicity call 'app.receivedEvent(...);'
        */
        onDeviceReady: function onDeviceReady() {
            console.log(this);
            app.receivedEvent('deviceready');
            // Config plugins and stuff like that
            // ...
            // Finally, boot AngularJS App
            app.bootAngApp(
                app.configFile,
                function onSuccess() {
                    console.log("Loader: ok");
                },
                function onError(error) {
                    console.log("Loader: fail");
                    console.log(error);
                }
            );
        },
        /**
            resume Event Handler
        */
        onResume: function onResume() {
            app.receivedEvent('resume');
        },
        /**
            onBack button Event Handler
        */
        onBackButton: function onBackButton() {
            app.receivedEvent('backbutton');
        },
        /**
            Boot AngularJS App
        **/
        bootAngApp: function bootAngApp(configFile, cbSuccess, cbError) {
            var moduleName = app.appName;

            // checks if it is an angularJS app first...
            if (!angular) {
                throw "BOOT ERROR: ANGULARJS NOT FOUND";
            }

            // retrieve the module
            try {
                var ajsmod = angular.module(moduleName);
            } catch (e) {
                throw "MODULE <" + moduleName + "> IS NOT DEFINED";
            }

            // loading config file
            console.log("Loader: reading config file:" + configFile);
            utils.readJSONFile(
                configFile,
                function onSuccess(data) {
                    var i = 0,
                        key;
                    
                    console.log("Loader: config file read");

                    for (i = 0; i < data.length; i++) {
                        if (data[i].module !== undefined) {
                            try {
                                console.log("AngBoot:", data[i].module);
                                key = "$" + data[i].module.toLowerCase() + "Config";
                                key = key.replace('.', '');
                                angular.module(data[i].module).constant(key, data[i]);
                            } catch (e) {
                                console.error(e);
                            }
                        }
                    }
                    // booting app
                    console.log("Loader: loading ", moduleName);
                    angular.bootstrap(document, [moduleName]);
                    
                    // calling callback
                    if (cbSuccess) {
                        cbSuccess();
                    }
                },
                function onError(status) {
                    if (cbError) {
                        cbError(status);
                    } else {
                        throw "ERROR LOADING <" + configFile + "> : " + status;
                    }
                }
            );
        }
    };

})(this, this.document, this.angular, this.utils);