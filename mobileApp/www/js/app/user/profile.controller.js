(function ProfileCtrl($app, $angular) 
 {
    'use strict';

    var _controller = 'ProfileCtrl',
    	_profileBS = 'ProfileBS',
        count = 0;

    $angular.module($app.appName)
        .controller(_controller, ['$scope', '$window', '$ionicModal', '$ionicScrollDelegate', _profileBS, controller]);

    function controller($scope, $window, $ionicModal, $ionicScrollDelegate, $profileBS)
    {
        $scope.user = $profileBS.getUserInfo;
console.log($scope.user);
        
        $scope.userMods = function()
        {
            if (!$scope.user.interested_in) $scope.user.interested_in = '';
            
            else if ($scope.user.interested_in.length == 1) 
                $scope.user.interested_in = $scope.user.interested_in[0]; 
            
            else if ($scope.user.interested_in.length == 2) 
                $scope.user.interested_in = 'Female | Male';
            
            if (!$scope.user.religion) $scope.user.religion = '';
                
            else if ($scope.user.religion.length) 
                $scope.user.religion = $scope.user.religion.substr(0, $scope.user.religion.length - 3);
            
            if (!$scope.user.political) $scope.user.political = '';
                
            else if ($scope.user.political.length) 
                $scope.user.political = $scope.user.political.substr(0, $scope.user.political.length - 3);
            
            count = count + 1;
        };
        
        if (count === 0) $scope.userMods();
        
        $scope.edit = '';
        
        $scope.settings = false;
        
        $scope.changeShow = function(show)
        {
            if (show === 'show')
            {
                if ($scope.user.show.show) $scope.scrollTop();
                
                // else if (!$scope.user.show.show) $scope.scrollBottom();
                
                else;
                    
                $scope.user.show.show = !$scope.user.show.show;
                
                $scope.settings = false;
            }
            
            else if (show === 'bio') $scope.user.show.bio = !$scope.user.show.bio;
            
            else if (show === 'interested_in') $scope.user.show.interested_in = !$scope.user.show.interested_in;
            
            else if (show === 'religion') $scope.user.show.religion = !$scope.user.show.religion;
            
            else if (show === 'political') $scope.user.show.political = !$scope.user.show.political;
            
            else if (show === 'facebook') $scope.user.show.facebook = !$scope.user.show.facebook;
            
            else if (show === 'twitter') $scope.user.show.twitter = !$scope.user.show.twitter;
            
            else if (show === 'linkedin') $scope.user.show.linkedin = !$scope.user.show.linkedin;
            
            else if (show === 'instagram') $scope.user.show.instagram = !$scope.user.show.instagram;
            
            else if (show === 'reddit') $scope.user.show.reddit = !$scope.user.show.reddit;
            
            else if (show === 'googleplus') $scope.user.show.googleplus = !$scope.user.show.googleplus;
            
            else if (show === 'skype') $scope.user.show.skype = !$scope.user.show.skype;
            
            else;
        };
        
        $scope.changeSettings = function()
        {
            $scope.scrollTop();
            
            $scope.settings = !$scope.settings;
            
            $scope.user.show.show = false;
        };
        
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
            if (!$scope.settings && !$scope.user.show.show)
                $window.open(link, '_self', 'location = no');
            
            return true;
        };
        
        $scope.scrollBottom = function() 
        {
            $ionicScrollDelegate.scrollBottom(true);
        };
        
        $scope.scrollTop = function() 
        {
            $ionicScrollDelegate.scrollTop(true);
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