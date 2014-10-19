(function ProxyWebTransfer($angular) {

    var _app = $angular.module('budiProxy'),
        _proxy = "WebTransferProxy";

    _app.service(_proxy, ["$budiappConfig", '$q', "$http", proxy]);

    function proxy($config, $q, $http) {

        var config = $config.proxy.webtransfer,
            _DEBUG = config.debug,
            _TAG = _proxy + ":";

        this.send = function send(request) {
            // Append default url
            request.url = config.url + '/' + request.url;
            console.log(JSON.stringify(request));
            return upload(request);
        };

        function upload(request) {

            var deferred = $q.defer(),
                ft = new FileTransfer(),
                options = new FileUploadOptions();
     
            options.fileKey = "file";
            options.fileName = "-";
            options.mimeType = "image/jpeg";
            options.chunkedMode = false;
            options.params = request.data;
            options.headers = request.headers;
     
            ft.upload(request.data.file, request.url,
                function (e) {
                    console.log("#### FILETRANSFER OK");
                    console.log(e);
                    deferred.resolve({
                        status: 0,
                        raw: e
                    });
                },
                function (e) {
                    console.log("#### FILE TRANSFER ERROR");
                    console.log(e);
                    deferred.reject(e);
                }, options);
     
            return deferred.promise;
        }

    }

})(this.angular);