WebRTC.directive('bdCamera', function() {
    return {
        restrict: 'E',
        scope: {
            webcam: '@webcam',
            startRecording: '=startRecording'
        },
        templateUrl: 'js/modules/WebRTC/src/views/bdCamera.html'
    };
});