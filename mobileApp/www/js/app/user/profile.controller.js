(function ProfileCtrl($app, $angular) {
    'use strict';

    var _controller = 'ProfileCtrl',
    	_profileBS = 'ProfileBS';

    $angular.module($app.appName)
        .controller(_controller, ['$scope', '$window', '$ionicModal', _profileBS, controller]);

    function controller($scope, $window, $ionicModal, $profileBS)
    {
        $scope.user = $profileBS.getUserInfo;

        $scope.edit = '';
        
        $scope.info = '';
        
        $scope.setEdit = function(edi)
        {
            $scope.edit = edi; 
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
        
        $scope.saveUserInfo = function(edit)
        {
          //  $scope.user.edit = $scope.info; console.log(edit); console.log($scope.user.edit);
            
            $scope.setEdit('');
            
            $scope.modal.hide();
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