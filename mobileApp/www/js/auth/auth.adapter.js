(function AuthAdapter($app, $angular) {
    'use strict';

    var _adapter = 'AuthAdapter';

    $angular.module($app.appName)
        .service(_adapter, ['$q','$budiappConfig', '$cordovaFacebook', adapter]);

    function adapter($q, $config, $cordovaFacebook) {
        /*jshint validthis:true */
        this.getUserPicture = function getUserPicture(){
    		var deferred = $q.defer();
    		$cordovaFacebook.api("/me/picture")
            .then(
                function(response) {
                  console.log("GOT PIC");
                  console.log(JSON.stringify(response));
                  deferred.resolve({});
                }, function (error) {
                  //console.log("API ERROR");
                  console.log(error);
                  deferred.reject();
                }
            );
    		/*FB.api(
			    "/me/picture",
			    {
			        "redirect": false,
			        "height": "400",
			        "type": "square",
			        "width": "400"
			    },
			    function (response) {
			      if (response && !response.error) {
			        deferred.resolve({
			        	pictureURL: response.data.url
			        });
			      }else {
			      	 deferred.reject();
			      }
			    }
			);*/
			return deferred.promise;
    	};
    }

})(this.app, this.angular);