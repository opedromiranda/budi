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
        
        this.data = 
        {
            showDelete: false,
            showInput: false,
            showReport: false,
            showBlock: false,
            search: ''
        };
        
        this.user = $userS.getUser();
        
        this.getBudisList = function () 
        { 
 			// return $budiApi.budiList(user);
            
 			var qual = 
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
                 gender: 'female', picture: 'img/avatar2.jpg',  blocked: 'false'},
                {id:8, first_name: 'Sarah', last_name: 'Burns', location: 'Grenada', 
                 gender: 'female', picture: 'img/avatar2.jpg',  blocked: 'false'},
                {id:9, first_name: 'Willie', last_name: 'Burton', location: 'Croatia', 
                 gender: 'male', picture: 'img/avatar1.jpg',  blocked: 'false'},
                {id:10, first_name: 'Tina', last_name: 'Simmons', location: 'United States', 
                 gender: 'female', picture: 'img/avatar2.jpg',  blocked: 'false'},
                {id:11, first_name: 'Kenneth', last_name: 'Larson', location: 'Mexico', 
                 gender: 'male', picture: 'img/avatar1.jpg',  blocked: 'false'},
                {id:12, first_name: 'Philip', last_name: 'Welch', location: 'Cuba', 
                 gender: 'male', picture: 'img/avatar1.jpg',  blocked: 'false'},
                {id:13, first_name: 'Nicholas', last_name: 'Parker', location: 'Scotland', 
                 gender: 'male', picture: 'img/avatar1.jpg',  blocked: 'false'},
                {id:14, first_name: 'Nicole', last_name: 'Webb', location: 'Moldova', 
                 gender: 'female', picture: 'img/avatar2.jpg',  blocked: 'false'},
                {id:15, first_name: 'Clarence', last_name: 'Schmidt', location: 'China', 
                 gender: 'female', picture: 'img/avatar2.jpg',  blocked: 'false'},
                {id:16, first_name: 'Jessica', last_name: 'Murray', location: 'Ireland', 
                 gender: 'female', picture: 'img/avatar2.jpg',  blocked: 'false'},
                {id:17, first_name: 'Willie', last_name: 'Schmidt', location: 'Greece', 
                 gender: 'male', picture: 'img/avatar1.jpg',  blocked: 'false'},
                {id:18, first_name: 'Margaret', last_name: 'Evans', location: 'Bhutan', 
                 gender: 'female', picture: 'img/avatar2.jpg',  blocked: 'false'},
                {id:19, first_name: 'Arthur', last_name: 'Morales', location: 'Faroe Islands', 
                 gender: 'male', picture: 'img/avatar1.jpg',  blocked: 'false'},
                {id:20, first_name: 'Charles', last_name: 'Perez', location: 'Italy', 
                 gender: 'male', picture: 'img/avatar1.jpg',  blocked: 'false'},
                {id:21, first_name: 'Jeffrey', last_name: 'Webb', location: 'Liechtenstein', 
                 gender: 'male', picture: 'img/avatar1.jpg',  blocked: 'false'},
                {id:22, first_name: 'Andrea', last_name: 'Simpson', location: 'Nauru', 
                 gender: 'female', picture: 'img/avatar2.jpg',  blocked: 'false'},
                {id:23, first_name: 'Steve', last_name: 'Reynolds', location: 'Morocco', 
                 gender: 'male', picture: 'img/avatar1.jpg',  blocked: 'false'},
                {id:24, first_name: 'Gerald', last_name: 'Reyes', location: 'Isle of Man', 
                 gender: 'male', picture: 'img/avatar1.jpg',  blocked: 'false'},
                {id:25, first_name: 'Judy', last_name: 'Washington', location: 'Sweden', 
                 gender: 'female', picture: 'img/avatar2.jpg',  blocked: 'false'},
                {id:26, first_name: 'Brandon', last_name: 'Patterson', location: 'Vietnam', 
                 gender: 'male', picture: 'img/avatar1.jpg',  blocked: 'false'},
                {id:27, first_name: 'Jacqueline', last_name: 'Stephens', location: 'Cambodia', 
                 gender: 'female', picture: 'img/avatar2.jpg',  blocked: 'false'},
                {id:28, first_name: 'Carlos', last_name: 'Harrison', location: 'Burkina Faso', 
                 gender: 'male', picture: 'img/avatar1.jpg',  blocked: 'false'},
                {id:29, first_name: 'Carol', last_name: 'Payne', location: 'Estonia', 
                 gender: 'female', picture: 'img/avatar2.jpg',  blocked: 'false'},
                {id:30, first_name: 'David', last_name: 'Baker', location: 'Montenegro', 
                 gender: 'male', picture: 'img/avatar1.jpg',  blocked: 'false'},
                {id:31, first_name: 'Justin', last_name: 'Watkins', location: 'Timor-Leste', 
                 gender: 'male', picture: 'img/avatar1.jpg',  blocked: 'false'},
                {id:32, first_name: 'Roy', last_name: 'Meyer', location: 'Seychelles', 
                 gender: 'male', picture: 'img/avatar1.jpg',  blocked: 'false'},
                {id:33, first_name: 'Kelly', last_name: 'Richardson', location: 'France', 
                 gender: 'female', picture: 'img/avatar2.jpg',  blocked: 'false'},
                {id:34, first_name: 'Howard', last_name: 'Mason', location: 'Portugal', 
                 gender: 'male', picture: 'img/avatar1.jpg',  blocked: 'false'},
                {id:35, first_name: 'Karen', last_name: 'Jackson', location: 'Swaziland', 
                 gender: 'female', picture: 'img/avatar2.jpg',  blocked: 'false'},
                {id:36, first_name: 'Christine', last_name: 'Bennett', location: 'France', 
                 gender: 'female', picture: 'img/avatar2.jpg',  blocked: 'false'},
                {id:37, first_name: 'Ashley', last_name: 'Jordan', location: 'Malta', 
                 gender: 'female', picture: 'img/avatar2.jpg',  blocked: 'false'},
                {id:38, first_name: 'David', last_name: 'Lopez', location: 'Mongolia', 
                 gender: 'male', picture: 'img/avatar1.jpg',  blocked: 'false'},
                {id:39, first_name: 'Andrew', last_name: 'Pierce', location: 'Italy', 
                 gender: 'male', picture: 'img/avatar1.jpg',  blocked: 'false'},
                {id:40, first_name: 'Michael', last_name: 'Hughes', location: 'New Caledonia', 
                 gender: 'male', picture: 'img/avatar1.jpg',  blocked: 'false'},
                {id:41, first_name: 'Earl', last_name: 'Henderson', location: 'Spain', 
                 gender: 'male', picture: 'img/avatar1.jpg',  blocked: 'false'},
                {id:42, first_name: 'Frank', last_name: 'Simpson', location: 'Uruguay', 
                 gender: 'male', picture: 'img/avatar1.jpg',  blocked: 'false'},
                {id:43, first_name: 'Jane', last_name: 'Simpson', location: 'New Zealand', 
                 gender: 'female', picture: 'img/avatar2.jpg',  blocked: 'false'},
                {id:44, first_name: 'Sarah', last_name: 'Cook', location: 'Thailand', 
                 gender: 'female', picture: 'img/avatar2.jpg',  blocked: 'false'},
                {id:45, first_name: 'Marilyn', last_name: 'Tucker', location: 'Western Sahara', 
                 gender: 'female', picture: 'img/avatar2.jpg',  blocked: 'false'},
                {id:46, first_name: 'Scott', last_name: 'Lewis', location: 'Spain', 
                 gender: 'male', picture: 'img/avatar1.jpg',  blocked: 'false'},
                {id:47, first_name: 'Tammy', last_name: 'Mills', location: 'Spain', 
                 gender: 'female', picture: 'img/avatar2.jpg',  blocked: 'false'},
                {id:48, first_name: 'Susan', last_name: 'Crawford', location: 'Slovenia', 
                 gender: 'female', picture: 'img/avatar2.jpg',  blocked: 'false'},
                {id:49, first_name: 'Barbara', last_name: 'Palmer', location: 'Oman', 
                 gender: 'female', picture: 'img/avatar2.jpg',  blocked: 'false'},
                {id:50, first_name: 'Stephanie', last_name: 'Diaz', location: 'Equatorial Guinea', 
                 gender: 'female', picture: 'img/avatar2.jpg',  blocked: 'false'},
                {id:51, first_name: 'Jeremy', last_name: 'Adams', location: 'Dominica', 
                 gender: 'male', picture: 'img/avatar1.jpg',  blocked: 'false'},
                {id:52, first_name: 'Sean', last_name: 'Hill', location: 'British Virgin Islands', 
                 gender: 'male', picture: 'img/avatar1.jpg',  blocked: 'false'},
                {id:53, first_name: 'Joseph', last_name: 'Evans', location: 'Honduras', 
                 gender: 'male', picture: 'img/avatar1.jpg',  blocked: 'false'},
                {id:54, first_name: 'Carlos', last_name: 'Rice', location: 'Zimbabwe', 
                 gender: 'male', picture: 'img/avatar1.jpg',  blocked: 'false'},
                {id:55, first_name: 'Beverly', last_name: 'Little', location: 'Turkmenistan', 
                 gender: 'male', picture: 'img/avatar1.jpg',  blocked: 'false'},
                {id:56, first_name: 'Craig', last_name: 'Jacobs', location: 'Saint Lucia', 
                 gender: 'male', picture: 'img/avatar1.jpg',  blocked: 'false'},
                {id:57, first_name: 'Marilyn', last_name: 'Fowler', location: 'Guinea', 
                 gender: 'female', picture: 'img/avatar2.jpg',  blocked: 'false'},
                {id:58, first_name: 'Henry', last_name: 'Rice', location: 'Antigua and Barbuda', 
                 gender: 'male', picture: 'img/avatar1.jpg',  blocked: 'false'},
                {id:59, first_name: 'Kathy', last_name: 'Wilson', location: 'Belarus', 
                 gender: 'female', picture: 'img/avatar2.jpg',  blocked: 'false'},
                {id:60, first_name: 'Arthur', last_name: 'Moore', location: 'Honduras', 
                 gender: 'male', picture: 'img/avatar1.jpg',  blocked: 'false'},
                {id:61, first_name: 'Ralph', last_name: 'Palmer', location: '\u00c5land', 
                 gender: 'male', picture: 'img/avatar1.jpg',  blocked: 'false'},
                {id:62, first_name: 'Daniel', last_name: 'Welch', location: 'Estonia', 
                 gender: 'male', picture: 'img/avatar1.jpg',  blocked: 'false'},
                {id:63, first_name: 'Carl', last_name: 'Young', location: 'Bahamas', 
                 gender: 'male', picture: 'img/avatar1.jpg',  blocked: 'false'},
                {id:64, first_name: 'Frank', last_name: 'Gordon', location: 'Aruba', 
                 gender: 'male', picture: 'img/avatar1.jpg',  blocked: 'false'},
                {id:65, first_name: 'Louise', last_name: 'Gonzalez', location: 'Suriname', 
                 gender: 'female', picture: 'img/avatar2.jpg',  blocked: 'false'},
                {id:66, first_name: 'Rebecca', last_name: 'Gibson', location: 'Romania', 
                 gender: 'female', picture: 'img/avatar2.jpg',  blocked: 'false'},
                {id:67, first_name: 'Denise', last_name: 'Holmes', location: 'Korea, North', 
                 gender: 'female', picture: 'img/avatar2.jpg',  blocked: 'false'},
                {id:68, first_name: 'Robert', last_name: 'Sanders', location: 'Saint Barthelemy', 
                 gender: 'male', picture: 'img/avatar1.jpg',  blocked: 'false'},
                {id:69, first_name: 'Willie', last_name: 'Spencer', location: 'Nigeria', 
                 gender: 'male', picture: 'img/avatar1.jpg',  blocked: 'false'},
                {id:70, first_name: 'Stephen', last_name: 'Carpenter', location: 'Nicaragua', 
                 gender: 'male', picture: 'img/avatar1.jpg',  blocked: 'false'},
                {id:71, first_name: 'Fred', last_name: 'Ortiz', location: 'Portugal', 
                 gender: 'male', picture: 'img/avatar1.jpg',  blocked: 'false'},
                {id:72, first_name: 'Wanda', last_name: 'Perkins', location: 'Laos', 
                 gender: 'female', picture: 'img/avatar2.jpg',  blocked: 'false'},
                {id:73, first_name: 'Annie', last_name: 'Martinez', location: 'Macau', 
                 gender: 'female', picture: 'img/avatar2.jpg',  blocked: 'false'},
                {id:74, first_name: 'Mildred', last_name: 'Riley', location: 'Jordan', 
                 gender: 'male', picture: 'img/avatar1.jpg',  blocked: 'false'},
                {id:75, first_name: 'Judy', last_name: 'Reyes', location: 'Montserrat', 
                 gender: 'female', picture: 'img/avatar2.jpg',  blocked: 'false'},
                {id:76, first_name: 'Frances', last_name: 'Garza', location: 'Sierra Leone', 
                 gender: 'male', picture: 'img/avatar1.jpg',  blocked: 'false'},
                {id:77, first_name: 'Henry', last_name: 'Martinez', location: 'Norway', 
                 gender: 'male', picture: 'img/avatar1.jpg',  blocked: 'false'},
                {id:78, first_name: 'Louise', last_name: 'Walker', location: 'Guinea', 
                 gender: 'female', picture: 'img/avatar2.jpg',  blocked: 'false'},
                {id:79, first_name: 'Scott', last_name: 'Reynolds', location: 'Armenia', 
                 gender: 'male', picture: 'img/avatar1.jpg',  blocked: 'false'},
                {id:80, first_name: 'Lori', last_name: 'Graham', location: 'Guatemala', 
                 gender: 'female', picture: 'img/avatar2.jpg',  blocked: 'false'},
                {id:81, first_name: 'Doris', last_name: 'Simpson', location: 'Angola', 
                 gender: 'female', picture: 'img/avatar2.jpg',  blocked: 'false'},
                {id:82, first_name: 'Paul', last_name: 'Thompson', location: 'Senegal', 
                 gender: 'male', picture: 'img/avatar1.jpg',  blocked: 'false'},
                {id:83, first_name: 'Joyce', last_name: 'Peters', location: 'Burundi', 
                 gender: 'male', picture: 'img/avatar1.jpg',  blocked: 'false'},
                {id:84, first_name: 'Frank', last_name: 'Lewis', location: 'Jamaica', 
                 gender: 'male', picture: 'img/avatar1.jpg',  blocked: 'false'},
                {id:85, first_name: 'Ann', last_name: 'Long', location: 'Sudan', 
                 gender: 'female', picture: 'img/avatar2.jpg',  blocked: 'false'},
                {id:86, first_name: 'Christopher', last_name: 'Garrett', location: 'Tokelau', 
                 gender: 'male', picture: 'img/avatar1.jpg',  blocked: 'false'},
                {id:87, first_name: 'Barbara', last_name: 'Thompson', location: 'Korea, South', 
                 gender: 'female', picture: 'img/avatar2.jpg',  blocked: 'false'},
                {id:88, first_name: 'Albert', last_name: 'Bennett', location: 'Colombia', 
                 gender: 'male', picture: 'img/avatar1.jpg',  blocked: 'false'},
                {id:89, first_name: 'Lillian', last_name: 'Powell', location: 'Belgium', 
                 gender: 'female', picture: 'img/avatar2.jpg',  blocked: 'false'},
                {id:90, first_name: 'Mary', last_name: 'Sims', location: 'Spain', 
                 gender: 'female', picture: 'img/avatar2.jpg',  blocked: 'false'},
                {id:91, first_name: 'Brian', last_name: 'Dunn', location: 'Togo', 
                 gender: 'male', picture: 'img/avatar1.jpg',  blocked: 'false'},
                {id:92, first_name: 'Arthur', last_name: 'Young', location: 'Mali', 
                 gender: 'male', picture: 'img/avatar1.jpg',  blocked: 'false'},
                {id:93, first_name: 'Johnny', last_name: 'Hayes', location: 'Uruguay', 
                 gender: 'male', picture: 'img/avatar1.jpg',  blocked: 'false'},
                {id:94, first_name: 'Ryan', last_name: 'Sanchez', location: 'United Kingdom', 
                 gender: 'male', picture: 'img/avatar1.jpg',  blocked: 'false'},
                {id:95, first_name: 'Juan', last_name: 'Garrett', location: 'Malaysia', 
                 gender: 'male', picture: 'img/avatar1.jpg',  blocked: 'false'},
                {id:96, first_name: 'Christina', last_name: 'Matthews', location: 'Iran', 
                 gender: 'female', picture: 'img/avatar2.jpg',  blocked: 'false'},
                {id:97, first_name: 'Timothy', last_name: 'Taylor', location: 'Bermuda', 
                 gender: 'male', picture: 'img/avatar1.jpg',  blocked: 'false'},
                {id:98, first_name: 'Marie', last_name: 'Ramos', location: 'Netherlands', 
                 gender: 'female', picture: 'img/avatar2.jpg',  blocked: 'false'},
                {id:99, first_name: 'Jimmy', last_name: 'Adams', location: 'Armenia', 
                 gender: 'male', picture: 'img/avatar1.jpg',  blocked: 'false'},
                {id:100, first_name: 'Edward', last_name: 'Hill', location: 'Korea, North', 
                 gender: 'male', picture: 'img/avatar1.jpg',  blocked: 'false'}
        	];

        	return qual;
        };
        
        this.getBlockedBudisList = function() 
        {
            // return $budiApi.blockedBudiList(user);
 			
 			var qual = 
 			[ 
                1, 4, 8, 13, 17, 23, 29, 30 , 35, 38, 43, 
                48, 50, 54, 56, 57, 65, 78, 82, 89, 94, 99 
            ];
            
            return qual;
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