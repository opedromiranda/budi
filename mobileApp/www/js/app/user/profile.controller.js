(function ProfileCtrl($app, $angular) 
 {
    'use strict';

    var _controller = 'ProfileCtrl',
    	_profileBS = 'ProfileBS';

    $angular.module($app.appName)
        .controller(_controller, ['$scope', '$window', '$ionicModal', _profileBS, controller]);

    function controller($scope, $window, $ionicModal, $profileBS)
    {
        $scope.user = $profileBS.getUserInfo;
console.log($scope.user);
        $scope.edit = '';
        
        $scope.info = '';
        
        $scope.userMods = function()
        {
            if($scope.user.gender === 'female') $scope.user.gender = 'Female';
         
            else if($scope.user.gender === 'male') $scope.user.gender = 'Male';
            
            if($scope.user.interested_in.length == 1) 
            {
                $scope.user.interested_in = $scope.user.interested_in[0]; 
                
                if($scope.user.interested_in === 'female') $scope.user.interested_in = 'Female';
         
                else if($scope.user.interested_in === 'male') $scope.user.interested_in = 'Male';
            }
            
            else if($scope.user.interested_in.length == 2) 
                $scope.user.interested_in = 'Female | Male';
            
            if($scope.user.religion.length) 
                $scope.user.religion = $scope.user.religion.substr(0, $scope.user.religion.length - 3);
            
            if($scope.user.political.length) 
                $scope.user.political = $scope.user.political.substr(0, $scope.user.political.length - 3);
        };
        
        $scope.userMods();
        
        $scope.setEdit = function(edi)
        {
            $scope.edit = edi; 
            
            $scope.modal.show();
        };
        
        $scope.setInfo = function(inf)
        {
            $scope.info = inf; 
            
            $scope.modal.hide();
        };
        
        $scope.openBrowser = function(link)
        {
            $window.open(link, '_self', 'location = no');
            
            return true;
        };
        
        $scope.calculateAge = function(birth)
        {
            var todayDate = new Date(),
                todayYear = todayDate.getFullYear(),
                todayMonth = todayDate.getMonth(),
                todayDay = todayDate.getDate(),
                birthDate = new Date(birth),
                birthYear = birthDate.getFullYear(),
                birthMonth = birthDate.getMonth(),
                birthDay = birthDate.getDate(),
                age = todayYear - birthYear;
            
            if (todayMonth < birthMonth) age--;

            else if (todayMonth === birthMonth && todayDay < birthDay) age--;

            return age;
        };
        
        $scope.age = $scope.calculateAge($scope.user.birthday);
        
        $ionicModal.fromTemplateUrl('templates/app/change_profile_info.html', 
        {
            scope: $scope
        }).then(function(modal) 
        {
            $scope.modal = modal;
        });
        
        $scope.saveUserInfo = function()
        {
            if( $scope.info.length < 0)
            {
                var edit2 = $scope.edit;

                console.log('Info: ' + $scope.info); console.log('Edit: ' + edit2); 

                $scope.user.edit2 = $scope.info; console.log('hey: ' + $scope.user.edit2);

                $scope.info = '';

                $scope.modal.hide();
            }
        };
        
        // TODO update profile as necessary, so if offline we have something
        /*$profileBS.getUserInfo().then(
        	function onSuccess(data){
       			$scope.user = data;
        	},
        	function onError(error){
        		console.log(error);
        	}
        );*/
    }

})(this.app, this.angular);