(function ChatCtrl($app, $angular) {
    'use strict';

    var _controller = 'ChatCtrl',
    	_userS = 'UserService';

    $angular.module($app.appName)
        .controller(_controller, ['$scope', _userS, controller]);

    function controller($scope, $userS) {
    	$scope.budiInfo = {
    		id: '2',
    		name: "Jessica Lorenz",
    		avatar: './img/avatar2.jpg'
    	};

    	$scope.myInfo = $userS.getUser();

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
    		if(msg.onwer != myInfo.name){
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

    }

})(this.app, this.angular);