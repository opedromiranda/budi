/*exported BudiApi*/
var BudiApi = angular.module('BudiApi', [])
    .service('BudiApiService', ['$http', '$budiappConfig', function($http, $config) {
        'use strict';

        var self = this;
        var serverURL = $config.proxy.web.url;
        var endpoints = $config.budi.api.endpoints;

        this.loggedBudi = null;

        /*function budiExists(budi) {
            console.log(budi);
            return $http.get(serverURL+endpoints.budiExists.url, { budi_id: budi.id});
        }

        function registerBudi(budi) {
            return $http.post(serverURL+endpoints.insertBudi.url, {
                name:budi.name,
                email:budi.email,
                fbId:budi.id
            }).then(function(response) {
                return response.data.budi;
            });
        }

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

        this.login = function login(user){
            return $http.post(serverURL+endpoints.login.url, 
            {
                fb_id: user.id,
                name: user.name,
                born_date: user.birthday,
                gender: user.gender
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

        this.getMessages = function getMessages(meet){
            console.log("Get messages of meet", meet);
            return $http.get(serverURL+endpoints.getMeetMessages.url, {meet_id: meet._id});
        };

        this.findMeet = function findMeet(budi) {
            return $http.post(
                serverURL+endpoints.findMeet.url,
                {
                    budi_id: budi.id
                })
            .then(function(response) {
                return response.data.meet;
            },
            function error(e){
                throw e;
            });
        };



        this.getBudi = function getBudi() {
            return this.loggedBudi;
        };
    }]);