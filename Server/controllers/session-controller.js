var mongoose = require('mongoose');
var moment = require('moment');
var Budi = require('../models/budi.js');

function SessionController() {

    function answer(res, code, data, error, reason) {
        return res.json({
            error: error || 0,
            reason: reason || '',
            data: data || {}
        }, code);
    }


    this.register = function register(req, res) {
        var fbId = req.body.fbId;
        var name = req.body.name;
        var gender = req.body.gender;
        var bornDate = req.body.bornDate;

        // validate mandatory input fields
        if(!fbId || !name || !gender || !bornDate) {
            return answer(res, 400, {}, 1, 'Missing arguments (fbId, name, gender, bornDate)');
        }

        // handle born date
        if ( moment(bornDate).isValid() ) {
            bornDate = moment(bornDate);
        }
        else {
            return answer(res, 400, {}, 2, 'Invalid Date');
        }


        // look for a budi with given FB id
        Budi.findOne({fb_id : fbId}).exec()
            .then(function handleQueryResult(b) {

                // if FB is already registered, return error
                if(b) {
                    return answer(res, 400, {}, 3, 'User already registered');
                }

                // create budi object
                budi = new Budi({
                    name : name,
                    fb_id : fbId,
                    genre : gender,
                    born_date : bornDate,
                    old_budis: [],
                    restrictions : {
                        genre : null,
                        age : false
                    }
                });

                budi.save(function (err) {
                    if(err) {
                        return answer(res, 500, {}, 4, 'An error occurred while saving the user');
                    }
                    return answer(res, 200, {budi: budi});
                });

            })
    };

    this.login = function login(req, res) {
        var fbId = req.body.fbId;
        var accessToken = req.body.accessToken;

        // validate mandatory input fields
        if (!fbId || !accessToken) {
            return answer(res, 400, {}, 1, 'Missing arguments (fbId, accessToken)');
        }

        // query FB id
        Budi.findOne({fb_id : fbId}).exec()
            .then(function handleQueryResult(b) {
                if (!b) {
                    return answer(res, 401, {}, 2, 'User is not registered');
                }
                return answer(res, 200, {budi: b});
            });
    }
}

module.exports = new SessionController();
