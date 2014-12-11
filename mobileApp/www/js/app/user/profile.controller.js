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
//console.log($scope.user);
        $scope.edit = '';
        
        $scope.settings = false;
        
        $scope.changeSettings = function()
        {
            $scope.settings = !$scope.settings;
        };

        $scope.userMods = function()
        {
            if ($scope.user.interested_in.length == 1) 
                $scope.user.interested_in = $scope.user.interested_in[0]; 
            
            else if ($scope.user.interested_in.length == 2) 
                $scope.user.interested_in = 'Female | Male';
            
            if ($scope.user.religion.length) 
                $scope.user.religion = $scope.user.religion.substr(0, $scope.user.religion.length - 3);
            
            if ($scope.user.political.length) 
                $scope.user.political = $scope.user.political.substr(0, $scope.user.political.length - 3);
        };
        
        $scope.userMods();
        
        $ionicModal.fromTemplateUrl('templates/app/change_profile_info.html', 
        {
            scope: $scope,
            focusFirstInput: true
        }).then(function(modal) 
        {
            $scope.modal = modal;
            
            $scope.modal.info = '';
        });
        
        $scope.setEdit = function(edi)
        {
            $scope.edit = edi; 
            
            $scope.modal.show();
        };
        
        $scope.clearInfo = function()
        {
            $scope.modal.info = ''; 
            
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
        
        $scope.saveUserInfo = function()
        {
            if ($scope.modal.info.length)
            {
                if ($scope.edit === 'picture')
                    $scope.user.picture = $scope.modal.info;
                
                else if ($scope.edit === 'location')
                    $scope.user.location.name = $scope.modal.info; 
                
                else if ($scope.edit === 'about me')
                    $scope.user.bio = $scope.modal.info; 
                
                else if ($scope.edit === 'interested in')
                    $scope.user.interested_in = $scope.modal.info; 
                
                else if ($scope.edit === 'religion')
                    $scope.user.religion = $scope.modal.info; 
                
                else if ($scope.edit === 'politics')
                    $scope.user.political = $scope.modal.info; 
                
                else if ($scope.edit === 'twitter')
                    $scope.user.twitter = $scope.modal.info; 
                
                else if ($scope.edit === 'linkedIn')
                    $scope.user.linkedin = $scope.modal.info; 
                
                else if ($scope.edit === 'instagram')
                    $scope.user.instagram = $scope.modal.info; 
                
                else if ($scope.edit === 'reddit')
                    $scope.user.reddit = $scope.modal.info; 
                
                else if ($scope.edit === 'googleplus')
                    $scope.user.googleplus = $scope.modal.info; 
                
                else if ($scope.edit === 'skype')
                    $scope.user.skype = $scope.modal.info;
                
                else;

                $scope.clearInfo();
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