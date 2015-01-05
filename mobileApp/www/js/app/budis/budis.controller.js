(function BudisCtrl($app, $angular) 
 {
    'use strict';

    var _controller = 'BudisCtrl',
    _service = 'BudisService',
    _profileBS = 'ProfileBS',
    count = 0;

    $angular.module($app.appName)
        .controller(_controller, ['$scope', _service, '$ionicScrollDelegate', '$ionicPopover',
                                  '$ionicPopup', 'filterFilter', '$state', _profileBS, controller]);

    function controller($scope, $service, $ionicScrollDelegate, $ionicPopover, $ionicPopup, $filterFilter, $state, $profileBS) 
    {  
        var letters = [],
            currentCharCode = 'A'.charCodeAt(0) - 1,
            letterHasMatch = {};
        
        $scope.budi = $service.budi;
        
        $scope.user = $service.user;
        
        $scope.updateUser = function(user)
        {
            $profileBS.updateUser(user);
        };
        
        $scope.data = $service.data;

        $scope.budisList = [];
        
        //test. $scope.user.budis = empty at first. remove above line to actual budis list
        $scope.user.budis = $service.getBudisList();
        
        $scope.budisListUnsorted = $scope.user.budis; 

        $scope.budisBlocked = function()
        {
            for (var i = 0; i < $scope.user.blocked.length; i++)
            {
                for (var j = 0; j < $scope.budisListUnsorted.length; j++)
                {
                   if ($scope.budisListUnsorted[j].id === $scope.user.blocked[i])
                       $scope.budisListUnsorted[j].blocked = true;
                    
                    else;
                }
            }
        };
        
        $scope.budisBlocked();
        
        $scope.hasNoBudis = function() 
        {         
            for (var i = 0; i < $scope.budisList.length; i++) 
            {
                if ($scope.budisList[i].isLetter !== true) return false;
            }
            
            return true;
        };

        $scope.onBudiDelete = function(budi) 
        {     
            // função eliminar budi ->> servidor
            // $scope.deleteBudi = $service.deleteBudi();
            
            $scope.budisList.splice($scope.budisList.indexOf(budi), 1);
            
            $scope.budisListUnsorted.splice($scope.budisListUnsorted.indexOf(budi), 1);
            
            $scope.user.budis = $scope.budisListUnsorted;
            
            $scope.updateUser($scope.user);

            if ($scope.searchResults().length === 0) $scope.onButtonClick('cancel');
        };
        
        $scope.onBudiReport = function(budi) 
        {     
            //função reportar budi ->> servidor
            $scope.reportBudi = $service.reportBudi();
            
            if ($scope.searchResults().length === 0) $scope.onButtonClick('cancel');
        };
        
        $scope.onBudiBlock = function(budi) 
        {     
            budi.blocked = true;
            
            $scope.user.blocked.push(budi.id);
            console.log('blocked: ' + $scope.user.blocked);
            
            $scope.updateUser($scope.user);
            
            if ($scope.searchResults().length === 0) $scope.onButtonClick('cancel');
        };
        
        $scope.onBudiUnblock = function(budi) 
        {     
            budi.blocked = false;
            
            var index = $scope.user.blocked.indexOf(budi.id);
            
            $scope.user.blocked.splice(index, 1);
            
            console.log('blocked: ' + $scope.user.blocked);
            
            $scope.updateUser($scope.user);
            
            if ($scope.searchResults().length === 0) $scope.onButtonClick('cancel');
        };
        
        $scope.onButtonClick = function(button)
        {
            if (button === 'delete')
            {
                $scope.data.showDelete = true; 

                $scope.closePopover();
            }
            
            else if (button === 'report')
            {
                $scope.data.showReport = true;

                $scope.closePopover(); 
            }
            
            else if (button === 'block')
            {
                $scope.data.showBlock = true;

                $scope.closePopover();
            }
            
            else if (button === 'search')
            {
                $scope.data.showInput = true; 
                
                if (!$scope.data.search.length)
                {
                    $scope.clearSearch();

                    $scope.scrollTop();
                }

                $scope.closePopover();
            } 

            else if (button === 'more')
            {
                $scope.data.showInput = false; 

                $scope.data.showDelete = false; 
                
                $scope.data.showBlock = false;
                
                $scope.data.showReport = false;
            }
            
            else if (button === 'cancel')
            {
                $scope.onButtonClick('more');
                
                $scope.clearSearch();
                
                $scope.scrollTop();
            }
            
            else;
        };
        
        $scope.scrollBottom = function() 
        {
            $ionicScrollDelegate.scrollBottom(true);
        };
        
        $scope.scrollTop = function() 
        {
            $ionicScrollDelegate.scrollTop(true);
        };
        
        $scope.clearSearch = function() 
        {
            $scope.data.search = '';
        };
        
        $ionicPopover.fromTemplateUrl('templates/popover_budis.html', 
        {
            scope: $scope
        }).then(function(popover) 
        {
            $scope.popover = popover;
        });

        $scope.openPopover = function($event) 
        {
            if ($scope.hasNoBudis() === false) $scope.popover.show($event);
        };
        
        $scope.closePopover = function() 
        {
            $scope.popover.hide();
        };
        
        $scope.isSearchResultsEmpty = function()
        {
            if ($scope.hasNoBudis() === true) return 'You Have No Budi(s) Yet';
            
            else if ($scope.searchResults().length === 0) return 'No Search Results';
            
            else return false;
        };

        $scope.budisListUnsorted
        .sort(function(a, b) 
        {
            return a.first_name > b.first_name ? 1 : -1;
        })
        .forEach(function(person) 
        {
            var personCharCode = person.first_name.toUpperCase().charCodeAt(0),
                difference = personCharCode - currentCharCode;

            for (var i = 1; i <= difference; i++) 
            {
                addLetter(currentCharCode + i);
            }

            currentCharCode = personCharCode;

            $scope.budisList.push(person);
        });

        for (var i = currentCharCode + 1; i <= 'Z'.charCodeAt(0); i++) 
        {
            addLetter(i);
        }

        function addLetter(code) 
        {
            var letter = String.fromCharCode(code);

            $scope.budisList.push(
            {
                isLetter: true,
                letter: letter
            });

            letters.push(letter);
        }

        $scope.searchResults = function() 
        {
            letterHasMatch = {};
            
            return $scope.budisList.filter(function(item) 
            {
                var itemDoesMatch = !$scope.data.search || item.isLetter ||
                    item.first_name.toLowerCase().indexOf($scope.data.search.toLowerCase()) > -1 ||
                    item.last_name.toLowerCase().indexOf($scope.data.search.toLowerCase()) > -1;

                if (!item.isLetter && itemDoesMatch) 
                {
                    var letter = item.first_name.charAt(0).toUpperCase();
                    
                    letterHasMatch[letter] = true;
                }

                return itemDoesMatch;  
            }).filter(function(item) 
            {
                if (item.isLetter && !letterHasMatch[item.letter]) return false;

                else return true;
            });
        };
        
        $scope.emptySpaces = function(template)
        {
            var emptyspaces = 0,
                empty = '';
            
            if (template.length < 27) emptyspaces = ((35 - template.length) / 2 + 2).toFixed(0);
            
            else if (template.length < 31) emptyspaces = ((35 - template.length) / 2 + 1).toFixed(0);
            
            else if (template.length < 35) emptyspaces = Math.floor((35 - template.length) / 2);

            for (var i = 0; i < emptyspaces; i++)
            {
                empty = empty + '&nbsp';
            }

            return empty;
        };
        
        $scope.showConfirmDeleteBudi = function(budi) 
        {
            var template = budi.first_name + ' ' + budi.last_name + ' Will Be Erased',
                confirmPopup = $ionicPopup.confirm(
            {
               title: 'Delete Budi',
               template: $scope.emptySpaces(template) + template
            });

            confirmPopup.then(function(res) 
            {
                if(res) $scope.onBudiDelete(budi);
            });
        };
        
        $scope.showConfirmReportBudi = function(budi) 
        {
            var template = budi.first_name + ' ' + budi.last_name + ' Will Be Flagged',
                confirmPopup = $ionicPopup.confirm(
            {
               title: 'Report Budi',
               template: $scope.emptySpaces(template) + template
            });

            confirmPopup.then(function(res) 
            {
                if(res)
                {
                    $scope.onBudiReport(budi);
                    
                    $scope.showConfirmAsWellBlockBudi(budi);
                }
            });
        };
        
        $scope.showConfirmAsWellBlockBudi = function(budi) 
        {
            var template = 'Block ' + budi.first_name + ' ' + budi.last_name + ' As Well',
                confirmPopup = $ionicPopup.confirm(
            {
               title: 'Block Budi',
               template: $scope.emptySpaces(template) + template
            });

            confirmPopup.then(function(res) 
            {
                if(res) $scope.onBudiBlock(budi);
            });
        };
        
        $scope.showConfirmBlockBudi = function(budi) 
        {
            var template = budi.first_name + ' ' + budi.last_name + ' Will Be Blocked',
                confirmPopup = $ionicPopup.confirm(
            {
               title: 'Block Budi',
               template: $scope.emptySpaces(template) + template
            });

            confirmPopup.then(function(res) 
            {
                if(res) $scope.onBudiBlock(budi);
            });
        };
        
        $scope.showConfirmUnblockBudi = function(budi) 
        {
            var template = budi.first_name + ' ' + budi.last_name + ' Will Be Unblocked',
                confirmPopup = $ionicPopup.confirm(
            {
               title: 'Unblock Budi',
               template: $scope.emptySpaces(template) + template
            });

            confirmPopup.then(function(res) 
            {
                if(res) $scope.onBudiUnblock(budi);
            });
        };
        
        $scope.showConfirm = function(budi)
        {
            if ($scope.data.showDelete) $scope.showConfirmDeleteBudi(budi);
            
            else if ($scope.data.showReport) $scope.showConfirmReportBudi(budi);
            
            else if ($scope.data.showBlock && budi.blocked === true) $scope.showConfirmUnblockBudi(budi);
            
            else if ($scope.data.showBlock && (budi.blocked || budi.blocked === false)) $scope.showConfirmBlockBudi(budi);
            
            else;
        };
        
        $scope.buttonName = function(budi) 
        {
            if ($scope.data.showDelete) return 'Delete Budi';
            
            else if ($scope.data.showReport) return 'Report Budi';
            
            else if ($scope.data.showBlock && budi.blocked === true) return 'Unblock Budi';
            
            else if ($scope.data.showBlock && (budi.blocked || budi.blocked === false)) return 'Block Budi';
            
            else;
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
        
        $scope.age = $scope.calculateAge($scope.budi.birthday);
        
        $scope.seeBudiProfile = function(id)
        {
            $service.budi = $scope.user;

            $state.go('app.budi_profile');
        };
    }
})(this.app, this.angular);