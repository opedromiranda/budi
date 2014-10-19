/*
 */

(function CdvMock(window, mock) {

    var _settings = {
        TAG: 'CdvMock'
    };

    /**
        Cordova generic events
    */
    mock.events = {
        TAG: 'Events',
        // Was deviceready fired?
        isReady: false,

        // dispatch events
        fireEvent: function(name) {
            var event = document.createEvent('Events');
            event.initEvent(name, true, false);
            console.log(_settings.TAG, this.TAG, name);
            document.dispatchEvent(event);
        },

        // deviceReady
        deviceReady: function() {
            if (this.isReady === true)
                return;
            this.isReady = true;
            this.fireEvent('deviceready');
        },

        // online
        online: function() {
            this.fireEvent('online');
        },

        // offline
        offline: function() {
            this.fireEvent('offline');
        },

        // Resume
        resume: function() {
            this.fireEvent('resume');
        },

        // Back Button
        backButton: function() {
            this.fireEvent('backbutton');
        },

        // Menu Button
        menuButton: function() {
            this.fireEvent('menubutton');
        },

        // Search Button
        searchButton: function() {
            this.fireEvent('searchbutton');
        }
    };

    /**
        
    */
    mock.app = {
        TAG: 'App',
        // exitApp
        exitApp: function() {
            console.log(_settings.TAG, this.TAG, 'exit');
        }
    };
    window.navigator.app = window.navigator.app || mock.app;

    /**
        Navigator SplashScreen
        org.apache.cordova.splashscreen
    */
    mock.splashscreen = {
        TAG: 'Splashscreen',
        // show
        show: function() {
            console.log(_settings.TAG, this.TAG, 'show()');
        },

        // hide
        hide: function() {
            console.log(_settings.TAG, this.TAG, 'hide()');
        }
    };
    window.navigator.splashscreen = window.navigator.splashscreen || mock.splashscreen;

    /**
        org.apache.cordova.device
    */
    mock.device = {
        TAG: 'Device',
        exitApp: function() {
            console.log("### EXIT APP ###");
        },
        name: 'android',//window.client.browser + " " + window.client.browserVersion,
        phonegap: "-1",
        platform: "webOS",
        uuid: '',//btoa(JSON.stringify(window.client)), // Just something you can use...
        version: '1' //window.client.osVersion
    };
    window.navigator.device = window.navigator.device || mock.device;
    window.device = window.device || mock.device;

    /**
        org.apache.cordova.network-information
    */
    mock.connection = {
        Connection: {
            UNKNOWN: "unknown",
            ETHERNET: "ethernet",
            WIFI: "wifi",
            CELL_2G: "2g",
            CELL_3G: "3g",
            CELL_4G: "4g",
            CELL:"cellular",
            NONE: "none"
        },
        type: "wifi"
    };
    window.Connection = mock.connection.Connection;
    window.navigator.connection = window.navigator.connection || mock.connection;

    // Install this mock on window
    window.CdvMock = mock;

})(window, window.CdvMock || {});


// ***** App "package"     ***********************************************************************

// ***** Notification "package"     ***********************************************************************
window.navigator.notification = navigator.notification || {
    alert: function(msg, alertCallback, title, buttonName) {
        alert("Title: " + title + "\r\nMsg: " + msg + "\r\nButtons: " + buttonName);
        if (alertCallback)
            alertCallback();
    },
    confirm: function(msg, callback, title, buttons) {
        var result = prompt("Title: " + title + "\r\nMsg: " + msg + "\r\nButtons: " + buttons);
        callback(parseInt(result));
    },
    prompt: function(message, promptCallback, title, buttonLabels, defaultValue) {
        promptCallback({
            buttonIndex: 1,
            input1: prompt("Title: " + title + "\r\nMsg: " + message + "\r\nButtons: " + buttonLabels + "\r\nDefault value: "+ defaultValue)
        });
    },
    beep: function() {
        console.log('### BEEP ###');
    },
    vibrate: function() {
        console.log('### VIBRATE ###');
    }
};

// ***** Plugin: sqlitePlugin     ***********************************************************************
window.sqlitePlugin = window.sqlitePlugin = {
    openDatabase: function(options) {
        return window.openDatabase(options.name, 1, options.name, 10 * 1024);
    }
};

window.plugins = window.plugins || {
    sslCertificateChecker: {
        check: function(successCallback, errorCallback, server, fingerprint, fingerprintNew) {
            return successCallback("PhoneGapMock")
        }
    }
};


// ***** STARTING "FAKE" CONTAINER     ***********************************************************************
window.document.addEventListener('DOMContentLoaded', function() {
    if (!window.CdvMock.events.isReady) {
        window.CdvMock.events.deviceReady();
    }
}, false);