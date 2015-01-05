(function ChatCtrl($app, $angular) {
    'use strict';

    var _controller = 'ChatCtrl',
        _chatBS = 'ChatBS';

    $angular.module($app.appName)
        .controller(_controller, ['$scope', '$ionicModal', '$ionicPopover', '$interval', _chatBS, controller]);

    function controller($scope, $ionicModal, $ionicPopover, $interval, $chatBS) {
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
                   // $scope.sendForm.pictureSEND = dataURItoBlob("data:image/jpeg;base64,"+data.image);
                    $scope.sendForm.picture = "data:image/jpeg;base64,"+ data.image;
                    console.log("IMAGE");
                    console.log($scope.sendForm.picture);
                    //console.log($scope.sendForm.pictureSEND);
                }
            );
            //$scope.sendForm.picture = "./img/camera.png";
        };

        $scope.sendImage = function sendImage() {
            $scope.modal.hide();
            $chatBS.sendImage($scope.sendForm.pictureSEND).then(
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
                    console.log(err);
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
                    console.log(err);
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

        console.log($chatBS.getMeetInfo());
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
            return false;
            if($chatBS.getNrOfPictures() >= 5)
                return false;
            else return true;
        };

        $interval(function(){$scope.messages = $chatBS.meet_messages;}, 2500);

        function dataURItoBlob(dataURI) {
        // convert base64/URLEncoded data component to raw binary data held in a string
         var byteString = atob(dataURI.split(',')[1]);
         var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0]

         var ab = new ArrayBuffer(byteString.length);
         var ia = new Uint8Array(ab);
         for (var i = 0; i < byteString.length; i++)
         {
            ia[i] = byteString.charCodeAt(i);
         }

         var bb = new Blob([ab], { "type": mimeString });
         return bb;
        }

        /*function encodeImageUri(imageUri)
        {
             var c=document.createElement('canvas');
             var ctx=c.getContext("2d");
             var img=new Image();
             img.onload = function(){
               c.width=this.width;
               c.height=this.height;
               ctx.drawImage(img, 0,0);
             };
             img.src=imageUri;
             var dataURL = c.toDataURL("image/jpeg");
             return dataURL;
        }*/
    }

})(this.app, this.angular);
