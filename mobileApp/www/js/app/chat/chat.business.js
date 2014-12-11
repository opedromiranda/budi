(function ChatBS($app, $angular) {
    'use strict';
    
    var _business = 'ChatBS',
        _userS = 'UserService',
        _budiAPI = 'BudiApiService';
    
    $angular.module($app.appName)
        .service(_business, ['$q', '$interval', _userS, _budiAPI, business]);
        
    function business($q, $interval, $userS, $budiAPI) {
        var self = this;
        var meet_info = {
            _id: undefined,
            meet_budi: undefined,
            active: false
        };

        var my_info = $userS.getUser();

        this.meet_messages = [];

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

        // check for new messages each 15 seconds
        var intervalPromise = undefined; 

        this.getMsgs = function getMsgs(){
            $budiAPI.getMessages(meet_info).then(
                function onSuccess(messages){
                    console.log("GOT MESSAGES", messages);
                    self.meet_messages = self.meet_messages.concat(messages.data);
                },
                function onError(e){
                    console.log(e);
                }
            );
        };

        this.getMeetInfo = function getMeetInfo(){
            return meet_info;
        };

        this.findMeet = function findMeet(){
            var deferred = $q.defer();
            
            $budiAPI.findMeet(my_info).then(
                function Success(_meet) {
                    meet_info._id = _meet._id;
                    meet_info.meet_budi = _meet.budi;
                    console.log(_meet);
                    intervalPromise = $interval(self.getMsgs(), 15000);
                    deferred.resolve();
                },
                function Error(e){
                    console.log(e);
                    deferred.reject();
                }
            );
            return deferred.promise;
        };

        this.leaveMeet = function leaveMeet(){
            $interval.cancel(intervalPromise);
            //$budiAPI.leaveMeet(budi, meet);
        };
    }

})(this.app, this.angular);