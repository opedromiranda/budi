(function ChatCtrl($app, $angular) {
    'use strict';

    var _controller = 'ChatCtrl',
        _chatBS = 'ChatBS';

    $angular.module($app.appName)
        .controller(_controller, ['$scope', '$ionicModal', '$ionicPopover', _chatBS, controller]);

    function controller($scope, $ionicModal, $ionicPopover, $chatBS) {
        $scope.myInfo = $chatBS.getMyInfo();

        $scope.sendForm = {
            message: undefined,
            picture: undefined
        };

        $scope.messages = [
            /*{
             owner: 'my',
             side: 'right',
             avatar: './img/avatar1.jpg',
             message: 'hi!'
             },
             {
             owner: 'my',
             side: 'right',
             avatar: './img/avatar1.jpg',
             message: 'how r u?'
             },
             {
             owner: 'budi',
             side: 'left',
             avatar: './img/avatar2.jpg',
             message: 'hey!'
             },
             {
             owner: 'budi',
             side: 'left',
             avatar: './img/avatar2.jpg',
             image: 'http://www.snappypixels.com/wp-content/uploads/2013/08/bunch-of-random-funny-pictures-6.jpg'
             }*/
        ];


        function insertMsg(msg) {
            var go_msg = {};
            go_msg.image = msg.image;
            go_msg.message = msg.message;
            if (msg.onwer != myInfo.id) {
                go_msg.owner = 'budi';
                go_msg.side = 'left';
                go_msg.avatar = $scope.budiInfo.avatar;
            }
            else {
                go_msg.owner = 'my';
                go_msg.side = 'right';
                go_msg.avatar = $scope.myInfo.picture;
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
        };

        $scope.takePicture = function takePicture() {
            $chatBS.takePicture().then(
                function success(data) {
                    $scope.sendForm.picture = data.image;
                }
            );
        };

        $scope.sendImage = function sendImage() {
            $scope.modal.hide();
            $chatBS.sendImage(sendForm.picture).then(
                function success(data) {
                    var msg = {
                        owner: $scope.myInfo.id
                    };
                    msg.image = angular.copy(sendForm.picture);
                    insertMsg(msg);
                    $scope.clearPicture();
                },
                function error(err) {
                    console.log(err);
                }
            );
        };

        $scope.sendMsg = function sendMsg() {
            $chatBS.sendMsg(sendForm.message).then(
                function success(data) {
                    var msg = {
                        owner: $scope.myInfo.id
                    };
                    msg.message = sendForm.message;
                    insertMsg(msg);
                    $scope.inputVisible = false;
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

        $scope.findBudi = function findBudi() {
            $scope.meetAnimation = true;
            $chatBS.findMeet().then(
                function success(){
                    $scope.meetAnimation = false;
                    $scope.meet.active = true;
                },
                function error(e){
                    $scope.meetAnimation = false;
                }
            );
        };

        $scope.endMeet = function endMeet() {
            $scope.meet.active = false
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
    }

})(this.app, this.angular);
