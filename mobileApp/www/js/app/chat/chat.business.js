(function ChatBS($app, $angular) {
    'use strict';
    
    var _business = 'ChatBS';
    
    $angular.module($app.appName)
        .service(_business, ['$q', business]);
        
    function business($q) {
    	this.takePicture = function takePicture() {
            var deffered = $q.defer();
            
            // Open camera and save this on service
            function picOnSuccess(imageURI) {
                console.log(_business, "Snapshot Success:", imageURI);
                // Return
                deffered.resolve({
                    image: imageURI
                });
            }

            function picOnFail(message) {
                console.log(_business, "Snapshot Failure:", message);
                deffered.reject(message);
            }
            
            try {
                navigator.camera.getPicture(picOnSuccess, picOnFail, { quality: 50, destinationType: Camera.DestinationType.FILE_URI });
            } catch(error) {
                console.log('code: ' + error.code + '\n' + 'message: ' + error.message + '\n');
                deffered.reject();   
            }
            
            return deffered.promise;
        };

        this.sendImage = function sendImage(){

        };

        this.sendMsg = function sendMsg(){
            
        };
    }

})(this.app, this.angular);