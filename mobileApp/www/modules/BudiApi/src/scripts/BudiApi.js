/*exported BudiApi*/
var BudiApi = angular.module('BudiApi', [])
    .service('BudiApiService', ['$http', '$budiappConfig', function($http, $config) {
        'use strict';

        var self = this;
        var endpoints = $config.budi.api.endpoints;

        this.loggedBudi = null;

        function budiExists(budi) {
            return $http.get(endpoints.budiExists + budi.id);
        }

        function registerBudi(budi) {
            return $http.post(endpoints.insertBudi, {
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

        };

        this.sendMessage = function sendMessage(budi, meet, message) {
            console.log( {
                budi_id: budi._id,
                meet_id: meet._id,
                message: message
            });
            return $http.post(endpoints.sendMessage, {
                budi_id: budi._id,
                meet_id: meet._id,
                message: message
            });
        };

        this.findMeet = function findMeet(budi) {
            return $http.post(endpoints.findMeet, {
                budiId: budi._id
            }).then(function(response) {
                return response.data.meet;
            });
        };



        this.getBudi = function getBudi() {
            return this.loggedBudi;
        };
    }]);