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
        var my_info = $userS.getUser();
        var nrOfPictures = 0;
    
        var settings = {
            data: {
                key: 'ChatService',
                default: {
                    meet_info : {
                        _id: undefined,
                        meet_budi: undefined,
                        active: false
                    },
                    chat: []
                },
                updates: []
            }
        };

        this.getNrOfPictures = function(){
            return nrOfPictures;
        };

        var storage = new $storage(settings.data.key, settings.data.default, settings.data.updates),
            _data = storage.get();
        var meet_info = _data.meet_info;

        this.meet_messages = _data.chat;

        this.getMyInfo = function getMyInfo(){
            return my_info;
        };

    	this.takePicture = function takePicture(source) {
            var deffered = $q.defer();
            
            // Open camera and save this on service
            function picOnSuccess(imageURI) {
                console.log("Snapshot Success: " + imageURI);
                // Return
                deffered.resolve({
                    image: imageURI
                });
            }

            function picOnFail(message) {
                console.log("Snapshot Failure: " + message);
                deffered.reject(message);
            }
            
            try {
                navigator.camera.getPicture(picOnSuccess, picOnFail, 
                    { 
                        quality: 50, 
                        destinationType : Camera.DestinationType.DATA_URL,
                        sourceType : source, // Camera.PictureSourceType = {PHOTOLIBRARY : 0,CAMERA : 1,SAVEDPHOTOALBUM : 2}; 
                        encodingType: Camera.EncodingType.JPEG,
                        saveToPhotoAlbum: true 
                    });
            } catch(error) {
                console.log('code: ' + error.code + '\n' + 'message: ' + error.message + '\n');
                deffered.reject();   
            }
            
            return deffered.promise;
        };

        this.sendImage = function sendImage(img){
            return $budiAPI.sendImage(my_info, meet_info, img);
        };

        this.sendMsg = function sendMsg(msg){
            return $budiAPI.sendMessage(my_info, meet_info, msg);
        };

        // check for new messages each 15 seconds
        var intervalPromise = undefined; 

        this.getMsgs = function getMsgs(){
            $budiAPI.getMessages(meet_info).then(
                function onSuccess(messages){
                    console.log("GOT MESSAGES", messages);
                    //self.meet_messages = self.meet_messages.concat(messages.data.chat);
                    updateMessages(messages.data.chat);
                    if( messages.data.full && !meet_info.gotBudi){
                        if( messages.data.budies[0].budi_id === my_info._id ){
                            meet_info.meet_budi = messages.data.budies[1];
                        }
                        else {
                            meet_info.meet_budi = messages.data.budies[0];
                        }
                        meet_info.gotBudi = true;
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
                    intervalPromise = $interval(function(){self.getMsgs();}, 5000);
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
                    meet_info.active = false;
                    storage.reset();
                });
        };

        this.resetMeet = function resetMeet(){
            $interval.cancel(intervalPromise);
            meet_info.active = false;
            storage.reset();
        };

        (function init(){
            if(meet_info.active){
                intervalPromise = $interval(function(){self.getMsgs();}, 5000);
                //console.log(_data);
                //storage.reset();
            }
        })();
//
        function insertMsg(msg) {
            var go_msg = {};
            if(msg.type === "image"){
                go_msg.image = msg.message;
                nrOfPictures++;
            }
            else 
                go_msg.message = msg.message;
            
            if (msg.budiSending != my_info._id) {
                go_msg.owner = 'budi';
                go_msg.side = 'left';
            }
            else {
                go_msg.owner = 'my';
                go_msg.side = 'right';
            }
            return go_msg;
        }

        function updateMessages(messages){
            var tempMsgs = [];
            nrOfPictures = 0;
            for(var i=0; i<messages.length; i++){
                tempMsgs.push(insertMsg(messages[i]));
            }
            self.meet_messages = tempMsgs;
        }
    }

})(this.app, this.angular);