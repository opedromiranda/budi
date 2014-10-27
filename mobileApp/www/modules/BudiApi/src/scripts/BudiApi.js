/*exported BudiApi*/
var BudiApi = angular.module('BudiApi', [])
    .service('BudiApiService', ['$http', 'API_ENDPOINTS', function($http, apiEndpoints) {
        'use strict';

        var self = this;

        this.loggedBudi = null;

        function budiExists(budi) {
            return $http.get(apiEndpoints.budiExists + budi.id);
        }

        function registerBudi(budi) {
            return $http.post(apiEndpoints.insertBudi, {
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
            return $http.post(apiEndpoints.sendMessage, {
                budi_id: budi._id,
                meet_id: meet._id,
                message: message
            });
        };

        this.findMeet = function findMeet(budi) {
            return $http.post(apiEndpoints.findMeet, {
                budiId: budi._id
            }).then(function(response) {
                return response.data.meet;
            });
        };



        this.getBudi = function getBudi() {
            return this.loggedBudi;
        };


    }]).constant('API_ENDPOINTS', {
        insertBudi : 'http://murmuring-thicket-4981.herokuapp.com/api/budies/insert',
        budiExists : 'http://murmuring-thicket-4981.herokuapp.com/api/budies/exists/',
        findMeet : 'http://murmuring-thicket-4981.herokuapp.com/api/meets/find',
        sendMessage : 'http://murmuring-thicket-4981.herokuapp.com/api/meets/message/text',
        baseURL : 'http://murmuring-thicket-4981.herokuapp.com'
    });