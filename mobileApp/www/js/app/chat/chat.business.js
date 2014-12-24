(function ChatBS($app, $angular) {
    'use strict';
    
    var _business = 'ChatBS',
        _userS = 'UserService',
        _budiAPI = 'BudiApiService',
        _storage = 'LocalStorageFactory';
    
    $angular.module($app.appName)
        .service(_business, ['$q', '$interval', _userS, _budiAPI, _storage, business]);
        
    function business($q, $interval, $userS, $budiAPI, $storage) {
        var self = this;
        /*var meet_info = {
            _id: "549aaf980b168c1b03e87865", // 549aaf980b168c1b03e87865
            meet_budi: undefined,
            active: true
        };*/

        var my_info = $userS.getUser();

        var settings = {
            data: {
                key: 'ChatService',
                default: {
                    meet_info : {
                        _id: undefined, // 549aaf980b168c1b03e87865
                        meet_budi: undefined,
                        active: false
                    },
                    chat: []
                },
                updates: []
            }
        };

        var storage = new $storage(settings.data.key, settings.data.default, settings.data.updates),
            _data = storage.get();
        var meet_info = _data.meet_info;

        this.meet_messages = _data.chat;

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
                    self.meet_messages = self.meet_messages.concat(messages.data.chat);
                    if( messages.data.full && !meet_info.meet_budi){
                        if( messages.data.budies[0].budi_id === my_info._id ){
                            meet_budi = messages.data.budies[1];
                        }
                        else {
                            meet_budi = messages.data.budies[0];
                        }
                        storage.save();
                    }

                    if( messages.data.finish ){
                        $interval.cancel(intervalPromise);
                        storage.reset();
                        // TODO display notification with add budi
                    }
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
                    meet_info.active = true;
                    console.log("New Meet Found", _meet);
                    intervalPromise = $interval(function(){self.getMsgs();}, 10000);
                    deferred.resolve();
                    storage.save();
                },
                function Error(e){
                    console.log(e);
                    deferred.reject();
                }
            );
            return deferred.promise;
        };

        this.leaveMeet = function leaveMeet(){
            $budiAPI.leaveMeet(budi, meet).then(
                function onSuccess(data){
                    $interval.cancel(intervalPromise);
                    storage.reset();
                });
        };

        (function init(){
            if(meet_info.active){
                intervalPromise = $interval(function(){self.getMsgs();}, 10000);
                console.log(_data);
                //storage.reset();
            }
        })();
    }

})(this.app, this.angular);