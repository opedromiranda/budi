(function AuthAdapter($app, $angular) {
    'use strict';

    var _adapter = 'AuthAdapter';

    $angular.module($app.appName)
        .service(_adapter, ['$q','$budiappConfig', adapter]);

    function adapter($q, $config) {
        /*jshint validthis:true */
        this.getUserPicture = function getUserPicture(){
    		var deferred = $q.defer;
    		FB.api(
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
			        	pictureURL: response.url
			        });
			      }else {
			      	 deferred.reject();
			      }
			    }
			);
			return deferred.promise;
    	}
    }

})(this.app, this.angular);