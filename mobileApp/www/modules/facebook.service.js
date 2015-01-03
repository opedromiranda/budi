(function FBService($app, $angular) {
    'use strict';

    var _service = 'FacebookService';

    $angular.module($app.appName)
        .service(_service, [ service]);

    function service() 
    {
        //  Uncomment the line below to store the Facebook token in localStorage instead of sessionStorage
        openFB.init({appId: '868824609795999', tokenStore: window.localStorage});

        this.login = function login() {
            openFB.login(
                function(response) {
                    if(response.status === 'connected') {
                        console.log('Facebook login succeeded, got access token: ' + response.authResponse.token);
                    } else {
                        alert('Facebook login failed: ' + response.error);
                    }
                }, {scope: 'email,read_stream,publish_stream'});
        };

        this.getInfo = function getInfo() {
            openFB.api({
                path: '/me',
                success: function(data) {
                    console.log(JSON.stringify(data));
                },
                error: function(e){
                    console.log(e);
                }
            });
        };

        this.revoke = function revoke() {
            openFB.revokePermissions(
                function() {
                    alert('Permissions revoked');
                },
                function(e){
                    console.log(e);
                }
            );
        };

        this.logout = function logout() {
            openFB.logout(
                function() {
                    alert('Logout successful');
                },
                function(e){
                    console.log(e);
                }
            );
        };
    }

})(this.app, this.angular);