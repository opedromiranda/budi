(function ChatBS($app, $angular) {
    'use strict';
    
    var _business = 'ChatBS',
        _userS = 'UserService',
        _budiAPI = 'BudiApiService',
        _storage = 'LocalStorageFactory';
    
    $angular.module($app.appName)
        .service(_business, ['$q', '$interval', '$ionicPopup', '$cordovaToast', _userS, _budiAPI, _storage, business]);
        
    function business($q, $interval, $ionicPopup, $cordovaToast, $userS, $budiAPI, $storage) {
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
                        active: false,
                        added_budi: false,
                        got_friend: false,
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
                //console.log("Snapshot Success: " + imageURI);
                // Return
                deffered.resolve({
                    image: imageURI
                });
            }

            function picOnFail(message) {
                //console.log("Snapshot Failure: " + message);
                deffered.reject(message);
            }
            
            try {
                navigator.camera.getPicture(picOnSuccess, picOnFail, 
                    { 
                        quality: 20, 
                        destinationType : Camera.DestinationType.DATA_URL,
                        sourceType : source, // Camera.PictureSourceType = {PHOTOLIBRARY : 0,CAMERA : 1,SAVEDPHOTOALBUM : 2}; 
                        encodingType: Camera.EncodingType.JPEG,
                        saveToPhotoAlbum: true 
                    });
            } catch(error) {
                //console.log('code: ' + error.code + '\n' + 'message: ' + error.message + '\n');
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
                    //console.log("GOT MESSAGES");
                    //console.log(JSON.stringify(messages));
                    //self.meet_messages = self.meet_messages.concat(messages.data.chat);

                    if( messages.data.full ){
                        meet_info.gotBudi = true;

                        if(meet_info.meet_budi === undefined){
                            if( messages.data.friends[0].id === my_info._id){
                                meet_info.meet_budi = messages.data.friends[1];
                            } else if( messages.data.friends[1].id === my_info._id){
                                meet_info.meet_budi = messages.data.friends[0];
                            }
                        }

                        //check for a friend request
                        if( ! meet_info.added_budi ){
                            var showDialog = false;
                            if( messages.data.friends[0].id === my_info._id){
                                if(messages.data.friends[1].friendReq){
                                    showDialog = true;
                                }
                            } else if( messages.data.friends[1].id === my_info._id){
                                if(messages.data.friends[0].friendReq){
                                    showDialog = true;
                                }
                            }

                            //display dialog to add friend if they want
                            if( showDialog ){
                                meet_info.added_budi = true;
                                var confirmPopup = $ionicPopup.confirm({
                                    title: 'Friend Request',
                                    subTitle: 'Notice: friend requests can only occur once!',
                                    template: 'Your current budi has sent you a friend request. Want to add him?',
                                    cancelText: 'No',
                                    okText: 'Yes'
                                });
                                
                                confirmPopup.then(function(res) {
                                    if(res) {
                                        self.addBudi();
                                        meet_info.added_budi = true;
                                        // show toast 'You are now friends!'
                                        $cordovaToast.showShortBottom('You are now friends!').then(function(success) {
                                            // success
                                        }, function (error) {
                                            // error
                                        });
                                    }
                                    showDialog = false;
                                });
                            }
                        }

                        if( messages.data.leave ){
                            $interval.cancel(intervalPromise);
                            
                            var alertPopup = $ionicPopup.alert({
                                title: 'Meeting has ended',
                                template: 'Your current budi has left the meeting! Better luck next time :/'
                            });
                            
                            alertPopup.then(function(res) {
                                //console.log("got meet leave notified");
                            });
                            
                            meet_info.active = false;
                            storage.reset();
                            return;
                        } 

                        if( messages.data.finish ){
                            $interval.cancel(intervalPromise);

                            if(!meet_info.added_budi){
                                var confirmPopup = $ionicPopup.confirm({
                                    title: 'Meeting has ended',
                                    template: 'A day has past already! The meeting ended and you didn\'t send a friend request. Do you want to do that now?',
                                    cancelText: 'No, thank you',
                                    okText: 'Yes, please'
                                });
                                
                                confirmPopup.then(function(res) {
                                    if(res) {
                                        self.addBudi();
                                        meet_info.added_budi = true;
                                    }
                                    showDialog = false;
                                });
                            }

                            meet_info.active = false;
                            storage.reset();
                            return;
                        }

                        //set budi
                        if( messages.data.full && !meet_info.gotFriend){
                            if( messages.data.budies[0].budi_id === my_info._id ){
                                meet_info.meet_budi = messages.data.budies[1];
                                meet_info.gotFriend = true;
                            }
                            else if( messages.data.budies[1].budi_id === my_info._id ){
                                meet_info.meet_budi = messages.data.budies[0];
                                meet_info.gotFriend = true;
                            } else meet_info.gotFriend = false;
                        }


                        updateMessages(messages.data.chat);
                        storage.save(); 
                    }  
                },
                function onError(e){
                    //console.log(e);
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
                    //console.log("New Meet Found", _meet);
                    intervalPromise = $interval(function(){self.getMsgs();}, 5000);
                    deferred.resolve();
                    storage.save();
                },
                function Error(e){
                    //console.log(e);
                    deferred.reject();
                }
            );
            return deferred.promise;
        };

        this.leaveMeet = function leaveMeet(){
            $budiAPI.leaveMeet(meet_info).then(
                function onSuccess(data){
                    $interval.cancel(intervalPromise);
                    meet_info.active = false;
                    storage.reset();
                },
                function onError(e){
                    //console.log(e);
                }
            );
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
            /*if(msg.type === "image"){
                go_msg.image = msg.message;
                nrOfPictures++;
            }
            else 
                go_msg.message = msg.message;*/
            try {
                var jimage = JSON.parse(msg.message);
                go_msg.image = jimage.image;
                go_msg.type = 'image';
                nrOfPictures++;
            } catch(e){
                go_msg.message = msg.message;
                go_msg.type = 'text';
            }
            
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

        this.addBudi = function addBudi(){
            $budiAPI.addBudi(my_info._id, meet_info._id).then(
                function onSuccess(res){
                    //show toast friend request sent
                    $cordovaToast.showShortBottom('Friend request sent!').then(function(success) {
                        // success
                    }, function (error) {
                        // error
                    });
                    meet_info.added_budi = true;
                    //console.log("Add Budi Success");
                    //console.log(JSON.stringify(res));
                },
                function onError(e){
                    //console.log(e);
                }
            );
        };
    }

})(this.app, this.angular);