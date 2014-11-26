(function BudisCtrl($app, $angular) 
 {
    'use strict';

    var _controller = 'BudisCtrl',
    _service = 'BudisService';

    $angular.module($app.appName)
        .controller(_controller, ['$scope', _service, '$ionicScrollDelegate', '$ionicPopover', 'filterFilter', controller]);

    function controller($scope, $service, $ionicScrollDelegate, $ionicPopover, $filterFilter) 
    {  
        var letters = [];
        
        var currentCharCode = 'A'.charCodeAt(0) - 1;
        
        var letterHasMatch = {};
        
        $scope.data = $service.data;
        
        $scope.budisList = [];
        
        $scope.budisListUnsorted = $service.getBudisList(); 
        
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

            if ($scope.searchResults().length === 0) $scope.onButtonClick('search_clear');
        };
        
        $scope.onButtonClick = function(button)
        {
            if (button === 'delete')
            {
                $scope.data.showDelete = !$scope.data.showDelete; 

                $scope.data.showInput = false; 

                $scope.closePopover();
            }
            
            else if (button === 'search')
            {
                $scope.data.showInput = true; 

                $scope.data.showDelete = false; 

                $scope.clearSearch();
                
                $scope.scrollTop();

                $scope.closePopover();
            } 
            
            else if (button === 'search_clear')
            {
                $scope.clearSearch();
                
                $scope.data.showInput = false; 

                $scope.data.showDelete = false; 
                
                $scope.scrollTop();

                $scope.closePopover();
            }
            
            else if (button === 'top')
            {
                $scope.data.showInput = false;
                
                $scope.data.showDelete = false; 
                
                $scope.scrollTop();
                
                $scope.closePopover();
            }
            
            else if (button === 'bottom')
            {
                $scope.data.showInput = false;
                
                $scope.data.showDelete = false; 
                
                $scope.scrollBottom();
                
                $scope.closePopover();
            }

            else if (button === 'more')
            {
                $scope.data.showInput = false; 

                $scope.data.showDelete = false; 
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
            $scope.search = '';
        };
        
        $scope.getSearch = function() 
        {
            return $scope.search;
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
            if ($scope.hasNoBudis() === false && !$scope.data.showDelete) $scope.popover.show($event);
        };
        
        $scope.closePopover = function() 
        {
            $scope.popover.hide();
        };
        
        $scope.isSearchResultsEmpty = function()
        {
            if ($scope.hasNoBudis() === true) return 'No Budi(s) Yet';
            
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
            var personCharCode = person.first_name.toUpperCase().charCodeAt(0);

            var difference = personCharCode - currentCharCode;

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
                var itemDoesMatch = !$scope.search || item.isLetter ||
                    item.first_name.toLowerCase().indexOf($scope.search.toLowerCase()) > -1 ||
                    item.last_name.toLowerCase().indexOf($scope.search.toLowerCase()) > -1;

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
    }

})(this.app, this.angular);