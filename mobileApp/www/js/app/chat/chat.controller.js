(function ChatCtrl($app, $angular) {
    'use strict';

    var _controller = 'ChatCtrl',
    	_chatBS = 'ChatBS',
    	_userS = 'UserService';

    $angular.module($app.appName)
        .controller(_controller, ['$scope', '$ionicModal', '$ionicPopover', _chatBS, _userS, controller]);

    function controller($scope, $ionicModal, $ionicPopover, $chatBS, $userS) {
    	$scope.budiInfo = {
    		id: '2',
    		name: "Jessica Lorenz",
    		avatar: './img/avatar2.jpg'
    	};

    	$scope.myInfo = $userS.getUser();

    	$scope.sendForm = {
    		message: undefined,
    		picture: undefined
    	};

    	$scope.messages = [
    		{
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
    		}
    	];



    	function insertMsg(msg){
    		var go_msg = {};
    		go_msg.image = msg.image;
    		go_msg.message = msg.message;
    		if(msg.onwer != myInfo.id){
    			go_msg.owner = 'budi';
    			go_msg.side = 'left';
    			go_msg.avatar = $scope.budiInfo.avatar;
    		}
    		else {
    			go_msg.owner = 'my';
    			go_msg.side = 'right';
    			go_msg.avatar = $scope.myInfo.avatar;
    		}
    		$scope.messages.push(go_msg);
    	}

    	$ionicModal.fromTemplateUrl('./templates/app/get_picture.html', function modal($ionicModal){
            $scope.modal = $ionicModal;
        }, {
            // Use our scope for the scope of the modal to keep it simple
            scope: $scope,
            // The animation we want to use for the modal entrance
            animation: 'slide-in-left'
        });

        $scope.showPicturePage = function showPicturePage(){
        	if($scope.modal)
        		$scope.modal.show();
        };

        $scope.clearPicture = function clearPicture(){
        	$scope.sendForm.picture = undefined;
        };

        $scope.takePicture = function takePicture(){
        	$chatBS.takePicture().then(
        		function success(data){
        			$scope.sendForm.picture = data.image;
        		});
        };

        $scope.sendImage = function sendImage(){
        	$scope.modal.hide();
        	$chatBS.sendImage().then(
        		function success(data){
        			var msg = {
        				owner: $scope.myInfo.id
        			}
        			msg.image = angular.copy(sendForm.picture);
        			insertMsg(msg);
        			$scope.clearPicture();
        		},
        		function error(err){
        			console.log(err);
        		});
        };

        $scope.sendMsg = function sendMsg(){
        	$chatBS.sendMsg().then(
        		function success(data){
        			var msg = {
        				owner: $scope.myInfo.id
        			}
        			msg.image = angular.copy(sendForm.picture);
        			insertMsg(msg);
        			$scope.clearPicture();
        		},
        		function error(err){
        			console.log(err);
        		});
        };

        $scope.toggleInput = function toggleInput(){
        	if($scope.inputVisible){ // disable input
        		$scope.inputVisible = false;
        	} 
        	else {
				$scope.inputVisible = true;
         	}
        };

        $scope.getMessages = function getMessages(){
        	
        };

        $scope.hasMeet = false;

        $scope.findBudi = function findBudi(){
            $scope.hasMeet = true;
        };

        $scope.endMeet = function endMeet(){
            $scope.hasMeet = false;
        };

        $ionicPopover.fromTemplateUrl('templates/popover.html', {
            scope: $scope
        }).then(function(popover) {
            $scope.popover = popover;
        });

        $scope.openPopover = function($event) {
            $scope.popover.show($event);
        };
        $scope.closePopover = function() {
            $scope.popover.hide();
        };

    }
// 1416301545283139
})(this.app, this.angular);
