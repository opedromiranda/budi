(function AuthAdapter($app, $angular) {
    'use strict';

    var _adapter = 'AuthAdapter';

    $angular.module($app.appName)
        .service(_adapter, ['$q','$budiappConfig', '$cordovaFacebook', adapter]);

    function adapter($q, $config, $cordovaFacebook) {
        /*jshint validthis:true */
        this.getUserPicture = function getUserPicture(){
    		var deferred = $q.defer();
    		$cordovaFacebook.api("me/picture?redirect=0")
            .then(
                function(response) {
                  //console.log("GOT PIC");
                  //console.log(JSON.stringify(response));
                  //console.log(response);
                  deferred.resolve({
                  	picture: response.data.url
                  });
                }, function (error) {
                  //console.log("API ERROR");
                  console.log(JSON.stringify(error));
                  deferred.reject();
                }
            );
			return deferred.promise;
    	};
    }

})(this.app, this.angular);