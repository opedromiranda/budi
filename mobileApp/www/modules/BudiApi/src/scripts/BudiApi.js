/*exported BudiApi*/
var BudiApi = angular.module('BudiApi', [])
    .service('BudiApiService', ['$q','$http', '$budiappConfig', function($q, $http, $config) {
        'use strict';

        var self = this;
        var serverURL = $config.proxy.web.url;
        var endpoints = $config.budi.api.endpoints;

        this.loggedBudi = null;

        /*function budiExists(budi) {
            console.log(budi);
            return $http.get(serverURL+endpoints.budiExists.url, { budi_id: budi.id});
        }
        */
        this.register = function register(user) {
            return $http.post(serverURL+endpoints.register.url, {
                fbId:user.id,
                name: user.name,
                bornDate: user.birthday,
                gender: user.gender.charAt(0)
            });
        };
        /*
        this.validateUser = function validateUser(user) {
            return budiExists(user)
                .then(function (response) {
                    var data = response.data;
                    return data.result ? data.user : registerBudi(user);
                })
                .then(function(budi) {
                    self.loggedBudi = budi;
                    return budi;
                });

        };*/

        this.login = function login(user, token){
            console.log("TOKEN");
            console.log(token);
            return $http.post(serverURL+endpoints.login.url, 
            {
                fbId: user.id,
                accessToken: token,
                name: user.name,
                born_date: user.birthday,
                gender: user.gender.charAt(0)
            });
        }

        this.sendMessage = function sendMessage(budi, meet, message) {
            console.log( {
                budi_id: budi._id,
                meet_id: meet._id,
                message: message
            });
            return $http.post(serverURL+endpoints.sendMessage.url, {
                budi_id: budi._id,
                meet_id: meet._id,
                message: message
            });
        };

        this.sendImage = function sendImage(budi, meet, image) {
            var deferred = $q.defer();
            console.log( JSON.stringify({
                budi_id: budi._id,
                meet_id: meet._id,
                image: image
            }));

            var formData = new FormData();

            formData.append('image', image);
            formData.append('budi_id', budi._id);
            formData.append('meet_id', meet._id);

            /*var xhr = new XMLHttpRequest(); 

            xhr.open( 'POST', serverURL+endpoints.sendImage.url , true );
            xhr.onreadystatechange = function(){
                console.log('state changed');
            };
            xhr.addEventListener("load", xhrSuccess, false);
            xhr.addEventListener("error", xhrError, false);

            xhr.setRequestHeader("Content-Type", "Content-Type:multipart/form-data;");
            xhr.send( formData );

            function xhrSuccess (response) {
                console.log(JSON.stringify(response));
                deferred.resolve(response);
            }

            function xhrError(error){
                console.log(error);
                deferred.reject();
            }

            return deferred.promise;*/
            return $http({
                method: 'POST',
                url: serverURL+endpoints.sendImage.url, 
                data: formData,
                headers: {'Content-Type': 'multipart/form-data'}
            });
        };

        this.getMessages = function getMessages(meet){
            //console.log("Get messages of meet", meet);
            return $http.get(serverURL+endpoints.getMeetMessages.url+'/'+meet._id);
        };

        this.findMeet = function findMeet(budi) {
            /*console.log(serverURL+endpoints.findMeet.url,
                {
                    budi_id: budi._id
                });*/
            return $http.post(
                serverURL+endpoints.findMeet.url,
                {
                    budi_id: budi._id
                })
            .then(function(response) {
                console.log("Log - FindMeet", response);
                return response.data.meet;
            },
            function error(e){
                throw e;
            });
        };



        this.getBudi = function getBudi() {
            return this.loggedBudi;
        };

        this.addBudi = function addBudi(myID, meetID){
            return $http.post(serverURL+endpoints.budiAdd.url, {
                budi_id : myID,
                meet_id : meetID 
            });
        };

        this.leaveMeet = function leaveMeet(meet){
            return $http.post(serverURL+endpoints.leaveMeet.url, {
                meet_id: meet._id
            });
        };
    }]);