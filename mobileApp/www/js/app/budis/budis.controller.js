(function BudisCtrl($app, $angular) 
 {
    'use strict';

    var _controller = 'BudisCtrl',
    _service = 'BudisService';

    $angular.module($app.appName)
        .controller(_controller, ['$scope', _service, '$ionicScrollDelegate', '$ionicPopover', '$ionicPopup', 'filterFilter', controller]);

    function controller($scope, $service, $ionicScrollDelegate, $ionicPopover, $ionicPopup, $filterFilter) 
    {  
        var letters = [],
            currentCharCode = 'A'.charCodeAt(0) - 1,
            letterHasMatch = {};
        
        $scope.data = $service.data;
        
        $scope.blockedBudisList = $service.getBlockedBudisList();
        
        $scope.budisList = [];
        
        $scope.budisListUnsorted = $service.getBudisList(); 
        
        $scope.budisBlocked = function()
        {
            for (var i = 0; i < $scope.blockedBudisList.length; i++)
            {
                for (var j = 0; j < $scope.budisListUnsorted.length; j++)
                {
                   if ($scope.budisListUnsorted[j].id === $scope.blockedBudisList[i])
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
            //função eliminar budi ->> servidor
            $scope.deleteBudi = $service.deleteBudi();

            $scope.budisList.splice($scope.budisList.indexOf(budi), 1);

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
                
                $scope.clearSearch();
                
                $scope.scrollTop();

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
        
        $scope.showConfirm = function(budi)
        {
            if ($scope.data.showDelete) $scope.showConfirmDeleteBudi(budi);
            
            else if ($scope.data.showReport) $scope.showConfirmReportBudi(budi);
            
            else if ($scope.data.showBlock) $scope.showConfirmBlockBudi(budi);
            
            else;
        };
        
        $scope.buttonName = function() 
        {
            if ($scope.data.showDelete) return 'Delete Budi';
            
            else if ($scope.data.showReport) return 'Report Budi';
            
            else if ($scope.data.showBlock) return 'Block Budi';
            
            else;
        };
    }
})(this.app, this.angular);