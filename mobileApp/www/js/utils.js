(function utils(window, XMLHttpRequest) {
    'use strict';

    window.utils = {
        /**
            Read JSON file using XMLHttpRequest
        */
        readJSONFile: function (filePath, cbSuccess, cbError) {
            var xhr = new XMLHttpRequest();
            xhr.open("GET", filePath, true);
            xhr.onreadystatechange = function () {
                if (xhr.readyState === 4) { // has finished?
                    if (parseInt(xhr.status, 10) === 200 || parseInt(xhr.status, 10) === 0) { // has found?
                        var parsed;
                        try {
                            parsed = JSON.parse(xhr.responseText);
                        } catch (e) {
                            cbError(-1);
                        } finally {
                            if (parsed) {
                                cbSuccess(parsed);
                            }
                        }
                    } else {
                        cbError(xhr.status);
                    }
                }
            };
            xhr.send(null);
        },

        /**
            Check if something is true.
            If array: all values must be true.
            @method isTrue
            @param {Object} object
            @returns {Boolean} True when everything is true. False otherwise
        **/
        isTrue: function isTrue(object) {
            var i;
            if (object instanceof Array) {
                for (i = 0; i < object.length; i = i + 1) {
                    if (object[i] === false) {
                        return false;
                    }
                }
                return true;
            }
        }
    };
})(window, XMLHttpRequest);