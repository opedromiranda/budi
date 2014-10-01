WebRTC.controller('WebcamController', ['$scope',
    function($scope) {
        $scope.startRecording = function startRecording(id) {

            var video = document.getElementById(id),
                videoStream = null;

            window.navigator = window.navigator || {};
            navigator.getUserMedia = navigator.getUserMedia       ||
                navigator.webkitGetUserMedia ||
                navigator.mozGetUserMedia    ||
                null;

            var createSrc = window.URL ? window.URL.createObjectURL : function(stream) {return stream;};

            function successCallback(stream) {
                videoStream = stream;
                video.src = createSrc(stream);
                video.play();
            }

            function errorCallback(error) {
                console.log("Video capture error: ", error.code);
            }

            navigator.getUserMedia({
                    video: true
                    //audio: true
                },
                successCallback,
                errorCallback
            );
        }
    }
]);