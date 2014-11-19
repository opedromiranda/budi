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
        
        $scope.budisList = [];
        
        $scope.budisListUnsorted = $service.getBudisList(); 

        $scope.data = $service.data;

        $scope.onBudiDelete = function(budi) 
        {         
            $scope.budisList.splice($scope.budisList.indexOf(budi), 1);

            //função eliminar budi ->> servidor
            $scope.deleteBudi = $service.deleteBudi();
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
                $scope.data.showInput = !$scope.data.showInput; 

                $scope.data.showDelete = false; 

                $scope.clearSearch();
                
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

                $scope.clearSearch();
            }
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
        
        $ionicPopover.fromTemplateUrl('templates/popover_budis.html', {
            scope: $scope
        }).then(function (popover) 
        {
            $scope.popover = popover;
        });

        $scope.openPopover = function ($event) 
        {
            $scope.popover.show($event);
        };
        
        $scope.closePopover = function () 
        {
            $scope.popover.hide();
        };


      $scope.budisListUnsorted
        .sort(function(a, b) {
          return a.last_name > b.last_name ? 1 : -1;
        })
        .forEach(function(person) {
          //Get the first letter of the last name, and if the last name changes
          //put the letter in the array
          var personCharCode = person.last_name.toUpperCase().charCodeAt(0);
          //We may jump two letters, be sure to put both in
          //(eg if we jump from Adam Bradley to Bob Doe, add both C and D)
          var difference = personCharCode - currentCharCode;
          for (var i = 1; i <= difference; i++) {
            addLetter(currentCharCode + i);
          }
          currentCharCode = personCharCode;
          $scope.budisList.push(person);
        });

      //If names ended before Z, add everything up to Z
      for (var i = currentCharCode + 1; i <= 'Z'.charCodeAt(0); i++) {
        addLetter(i);
      }

      function addLetter(code) {
        var letter = String.fromCharCode(code);
        $scope.budisList.push({
          isLetter: true,
          letter: letter
        });
        letters.push(letter);
      }

      //Letters are shorter, everything else is 52 pixels
      $scope.getItemHeight = function(item) 
      {
        return item.isLetter ? 10 : 100;
      };
        
      $scope.getItemWidth = function(item) 
      {
        return '100%';
      };

      $scope.getContacts = function() {
        letterHasMatch = {};
        //Filter contacts by $scope.search.
        //Additionally, filter letters so that they only show if there
        //is one or more matching contact
        return $scope.budisList.filter(function(item) {
          var itemDoesMatch = !$scope.search || item.isLetter ||
            item.last_name.toLowerCase().indexOf($scope.search.toLowerCase()) > -1 ||
            item.last_name.toLowerCase().indexOf($scope.search.toLowerCase()) > -1;

          //Mark this person's last name letter as 'has a match'
          if (!item.isLetter && itemDoesMatch) {
            var letter = item.last_name.charAt(0).toUpperCase();
            letterHasMatch[letter] = true;
          }

          return itemDoesMatch;
        }).filter(function(item) {
          //Finally, re-filter all of the letters and take out ones that don't
          //have a match
          if (item.isLetter && !letterHasMatch[item.letter]) {
            return false;
          }
          return true;
        });
      };
    }

})(this.app, this.angular);
