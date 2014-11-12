(function BudisService($app, $angular) {
    'use strict';

    var _service = 'BudisService',
    _userS = 'UserService',
    _budiApi = 'BudiApiService';

    $angular.module($app.appName)
        .service(_service, ['$q','$budiappConfig', _userS, _budiApi, service]);

    function service($q, $config, $userS, $budiApi) {
        /*jshint validthis:true */

        var user = $userS.getUser();

        this.getBudisList = function getBudisList() 
        {
 			// return $budiApi.budiList(user);
 			
 			var qual = 
 			[
	            { id: 1, name: 'Xuxinha', location: 'Caminha', image: 'img/avatar1.jpg' },
	            { id: 2, name: 'Liliana', location: 'Pau Douro', image: 'img/avatar2.jpg' },
	            { id: 3, name: 'Flávia', location: 'Porto', image: 'img/avatar1.jpg' },
	            { id: 4, name: 'Vânia', location: 'Lisboa', image: 'img/avatar2.jpg' },
	            { id: 5, name: 'Ana', location: 'Algarve', image: 'img/avatar1.jpg' },
	            { id: 6, name: 'Joana', location: 'Porto', image: 'img/avatar2.jpg' },
	            { id: 7, name: 'Adriana', location: 'Lisboa', image: 'img/avatar1.jpg' },
	            { id: 8, name: 'Ines', location: 'Pau Douro', image: 'img/avatar2.jpg' },
	            { id: 9, name: 'Daniela', location: 'Porto', image: 'img/avatar1.jpg' },
	            { id: 10, name: 'Maria', location: 'Lisboa', image: 'img/avatar2.jpg' }
        	];

        	return qual;
        };

        this.deleteBudi = function deleteBudi() 
        {
            // return $budiApi.budiList(user);
            

            return ;
        };
        
        this.data = 
        {
            showDelete: false,
            showBackButton: false
        };
    }

})(this.app, this.angular);