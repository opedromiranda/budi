(function ChatCtrl($app, $angular) {
    'use strict';

    var _controller = 'ChatCtrl',
        _chatBS = 'ChatBS';

    $angular.module($app.appName)
        .controller(_controller, ['$scope', '$ionicModal', '$ionicPopover', '$ionicPopup', '$interval', '$cordovaToast', _chatBS, controller]);

    function controller($scope, $ionicModal, $ionicPopover, $ionicPopup, $interval, $cordovaToast, $chatBS) {
        $scope.myInfo = $chatBS.getMyInfo();

        $scope.sendForm = {
            message: undefined,
            picture: undefined
        };

        
        $scope.messages = $chatBS.meet_messages;

        $scope.meetInfo = undefined;

        function insertMsg(msg) {
            var go_msg = {};
            if(msg.type === "image")
                go_msg.image = msg.message;
            else 
                go_msg.message = msg.message;

            if (msg.budiSending != $scope.myInfo._id) {
                go_msg.owner = 'budi';
                go_msg.side = 'left';
            }
            else {
                go_msg.owner = 'my';
                go_msg.side = 'right';
            }
            $scope.messages.push(go_msg);
        }

        $ionicModal.fromTemplateUrl('./templates/app/get_picture.html', function modal($ionicModal) {
            $scope.modal = $ionicModal;
        }, {
            // Use our scope for the scope of the modal to keep it simple
            scope: $scope,
            // The animation we want to use for the modal entrance
            animation: 'slide-in-left'
        });

        $scope.showPicturePage = function showPicturePage() {
            if ($scope.modal)
                $scope.modal.show();
        };

        $scope.clearPicture = function clearPicture() {
            $scope.sendForm.picture = undefined;
            $scope.sendForm.pictureSEND = undefined;
        };

        $scope.takePicture = function takePicture(src) {
            $chatBS.takePicture(src).then(
                function success(data) {
                    //$scope.sendForm.pictureSEND = "data:image/jpeg;base64,"+data.image;
                    $scope.sendForm.picture = "data:image/jpeg;base64,"+ data.image;
                    //console.log("IMAGE");
                    //console.log($scope.sendForm.picture);
                    //console.log($scope.sendForm.pictureSEND);
                }
            );
            //$scope.sendForm.picture = "./img/camera.png";
        };

        $scope.sendImage = function sendImage() {
            $scope.modal.hide();
            $chatBS.sendImage($scope.sendForm.picture).then(
                function success(data) {
                    var msg = {};
                    msg.budiSending = $scope.myInfo._id;
                    msg.image = $scope.sendForm.picture;
                    msg.type = "image";
                    insertMsg(msg);
                    $scope.clearPicture();
                    $scope.sendForm.message = "";
                },
                function error(err) {
                    //console.log(JSON.stringify(err));
                    $scope.clearPicture();
                }
            );
        };

        $scope.sendMsg = function sendMsg() {
            if($scope.sendMsg.message === "")
                return;
            $chatBS.sendMsg($scope.sendForm.message).then(
                function success(data) {
                    var msg = {};
                    msg.budiSending = $scope.myInfo._id;
                    msg.message = $scope.sendForm.message;
                    msg.type = "text";
                    insertMsg(msg);
                    $scope.inputVisible = false;
                    $scope.sendForm.message = "";
                },
                function error(err) {
                    //console.log(err);
                });
        };

        $scope.toggleInput = function toggleInput() {
            if ($scope.inputVisible) { // disable input
                $scope.inputVisible = false;
            }
            else {
                $scope.inputVisible = true;
            }
        };

        $scope.meet = $chatBS.getMeetInfo();
        $scope.meetAnimation = false;

        $scope.findBudi = function findBudi() {
            $scope.meetAnimation = true;
            $chatBS.findMeet().then(
                function success(){
                    $scope.meetAnimation = false;
                    $scope.meetInfo = $chatBS.getMeetInfo();
                    $scope.myInfo = $chatBS.getMyInfo();
                },
                function error(e){
                    $scope.meetAnimation = false;
                }
            );
        };

        $scope.endMeet = function endMeet() {
            $chatBS.leaveMeet();
        };

        $ionicPopover.fromTemplateUrl('templates/app/popover-chat.html', {
            scope: $scope
        }).then(function (popover) {
            $scope.popover = popover;
        });

        $scope.openPopover = function ($event) {
            $scope.popover.show($event);
        };
        $scope.closePopover = function () {
            $scope.popover.hide();
        };

        $scope.reset = function reset(){
            $chatBS.resetMeet();
        };

        $scope.locked = function(){
            if($chatBS.getNrOfPictures() >= 2)
                return false;
            else return true;
        };

        $interval(function(){
            if($scope.messages.length != $chatBS.meet_messages.length)
                $scope.messages = $chatBS.meet_messages;
            $scope.meet = $chatBS.getMeetInfo();
            /*$scope.meet.active = true;
            $scope.meet.gotBudi = true;
            $scope.messages = [
                {
                    owner : 'budi',
                    side : 'left',
                    type : 'text',
                    message : 'ola',
                },
                {
                    owner : 'my',
                    side : 'right',
                    type : 'text',
                    message : 'ola2',
                },
                {
                    owner : 'budi',
                    side : 'left',
                    type : 'image',
                    image : '/img/avatar1.jpg',
                },
                {
                    owner : 'my',
                    side : 'right',
                    type : 'image',
                    image : '/img/avatar2.jpg',
                }
            ];*/
        }, 1000);

        $scope.addBudi = function(){
            $chatBS.addBudi();
        };

        $scope.reportBudi = function reportBudi(){
            var confirmPopup = $ionicPopup.confirm({
                title: 'Report Budi',
                template: 'Are you sure you want to report this budi?'
            });
            
            confirmPopup.then(function(res) {
                $chatBS.leaveMeet();
                
                // show Toast 'budi reported'
                $cordovaToast.showShortBottom('Budi reported').then(function(success) {
                    // success
                }, function (error) {
                    // error
                });
            });
        };
    }

})(this.app, this.angular);
