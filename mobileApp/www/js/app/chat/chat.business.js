(function ChatBS($app, $angular) {
    'use strict';
    
    var _business = 'ChatBS',
        _userS = 'UserService',
        _budiAPI = 'BudiApiService';
    
    $angular.module($app.appName)
        .service(_business, ['$q', _userS, _budiAPI, business]);
        
    function business($q, $userS, $budiAPI) {
        var meet_info = {
            id: undefined,
            meet_budi: undefined,
            active: false
        };

        var my_info = $userS.getUser();

        this.getMyInfo = function getMyInfo(){
            return my_info;
        };

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
            return;
        };

        this.sendMsg = function sendMsg(msg){
            return $budAPI.sendMessage(my_info, meet_info, msg);
        };

        this.getMsgs = function getMsgs(){
            return;
        };

        this.getMeetInfo = function getMeetInfo(){
            return meet_info;
        };

        this.findMeet = function findMeet(){
            var deferred = $q.defer();
            deferred.resolve({});
            return deferred.promise;
            $budiAPI.findMeet().then(function(_meet) {
                meet_info.id = _meet.id;
                meet_info.meet_budi = _meet.budi;

                console.log(_meet);
                return true;
            });
        }
    }

})(this.app, this.angular);