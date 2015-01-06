(function BudisService($app, $angular) {
    'use strict';

    var _service = 'BudisService',
    _userS = 'UserService',
    _budiApi = 'BudiApiService';

    $angular.module($app.appName)
        .service(_service, ['$q','$budiappConfig', _userS, _budiApi, service]);

    function service($q, $config, $userS, $budiApi) 
    {
        /*jshint validthis:true */
        var self = this;
        this.data = 
        {
            showDelete: false,
            showInput: false,
            showReport: false,
            showBlock: false,
            search: ''
        };
        
        this.user = $userS.getUser();
        
        this.budi = {};
        
        this.getBudisList = function()
        { 
            var deferred = $q.defer();
            self.user = $userS.getUser();
 			$budiApi.getBudis(self.user._id)
            .then(
                function onSuccess(data){
                    console.log(JSON.stringify(data.data.budiFriends));
                    var budisgot = [];
                    for(var i=0; i<data.data.budiFriends.length; i++){
                        var bd = {};
                        bd.id = data.data.budiFriends[i].fb_id;
                        bd.name = data.data.budiFriends[i].name;
                        if( data.data.budiFriends[i].genre === 'm' )
                            bd.gender = 'male';
                        else bd.gender = 'female';
                        bd.picture = 'http://graph.facebook.com/'+data.data.budiFriends[i].fb_id+'/picture?type=square';
                        bd.blocked = false;
                        bd.link = 'https://www.facebook.com/app_scope_user_id/'+data.data.budiFriends[i].fb_id+'/';
                        budisgot.push(bd);
                    }
                    console.log(JSON.stringify(budisgot));
                    deferred.resolve({budis: budisgot});
                },
                function onError(e){
                    console.log(e);
                    deferred.reject(e);
                });

            return deferred.promise;
            
 			/*var qual = 
 			[
                {id:1, first_name: 'Patrick', last_name: 'Rogers', location: 'Cyprus', 
                 gender: 'male', picture: 'img/avatar1.jpg',  blocked: 'false'},
                {id:2, first_name: 'Janet', last_name: 'Gordon', location: 'Croatia', 
                 gender: 'female', picture: 'img/avatar2.jpg',  blocked: 'false'},
                {id:3, first_name: 'Kathy', last_name: 'Hamilton', location: 'Armenia', 
                 gender: 'female', picture: 'img/avatar2.jpg',  blocked: 'false'},
                {id:4, first_name: 'Stephanie', last_name: 'Johnson', location: 'Mauritius', 
                 gender: 'female', picture: 'img/avatar2.jpg',  blocked: 'false'},
                {id:5, first_name: 'Jerry', last_name: 'Palmer', location: 'Thailand', 
                 gender: 'male', picture: 'img/avatar1.jpg',  blocked: 'false'},
                {id:6, first_name: 'Lillian', last_name: 'Franklin', location: 'Germany', 
                 gender: 'female', picture: 'img/avatar2.jpg',  blocked: 'false'},
                {id:7, first_name: 'Melissa', last_name: 'Gordon', location: 'Serbia', 
                 gender: 'female', picture: 'img/avatar2.jpg',  blocked: 'false'}
        	];

        	return qual;*/
        };

        this.deleteBudi = function() 
        {
            // return $budiApi.budiList(user);    

            return ;
        };
        
        this.reportBudi = function() 
        {
            // return $budiApi.budiReport(user);      

            return ;
        };
    }

})(this.app, this.angular);