/**
 * Created by pedromiranda on 04/10/14.
 */

var mongoose = require('mongoose');
var Budi = require('../models/budi.js');
var moment = require('moment');

function BudiController () {

    function handleAnswer(res) {
        function answer(a) {
            res.json(a);
        }
        return answer;
    }

    /**
     * Uses the response object to send a JSON object with error set to 1
     * @param res
     * @returns {err}
     */
    function handleError(res) {
        function err(e) {
            res.json({
                error: 1,
                error_object : e
            });
        }
        return err;
    }

    this.insert = function (req, res) {
        var budi, bornDate;

        // validate mandatory Budi fields
        if( !req.body.hasOwnProperty('email') ||
            !req.body.hasOwnProperty('name') ||
            !req.body.hasOwnProperty('bornDate') || // yyyy-mm-dd
            !req.body.hasOwnProperty('genre')) {
                res.json({
                    error: 1,
                    reason: 'Missing arguments'
                });
                return;
            }

        if ( moment(req.body.bornDate, "YYYYMMDD").isValid() ) {
            bornDate = moment(req.body.bornDate, "YYYY-MM-DD");
        }
        else {
            throw new Error('Invalid date born');
        }

        budi = new Budi({
            name : req.body.name,
            email : req.body.email,
            genre: req.body.genre,
            born_date: bornDate,
            restrictions: {
                genre: null,
                born_date: false
            }
        });

        budi.save(function (err) {
            if(err) {
                console.log(err);
                res.json({
                    error: 1,
                    reason: 'An error occurred on registration'
                });
            } else {
                res.json({
                    error: 0,
                    budi : budi
                });
            }
        });
    };

    this.count = function (req, res) {
        Budi.count(function (err, count) {
            if(err) {
                // TODO best way to throw error
            }
            res.json({
                error : 0,
                count : count
            });
        });
    };

    function setRestrictions(restrictions){
        return function(b){

            var restrictionsJson = JSON.parse(restrictions);
            var result = new mongoose.Promise;
            var newRestrictions = {
                age: restrictionsJson.age || false,
                genre: restrictionsJson.genre || null
            };
            b.restrictions = newRestrictions;
            b.save(function (err) {
                if(err) {
                    result.reject({
                        error: 1,
                        reason: 'Error updating budi settings'
                    })
                }
                result.fulfill({
                    error: 0
                });
            });

            return result;
        }
    }

    this.restrictions = function (req, res) {
        if( !req.body.hasOwnProperty('budi_id') ||
            !req.body.hasOwnProperty('restrictions') ) {
                res.json({
                    error: 1
                });
                return;
            }

        Budi.findOne({_id : req.body.budi_id}).exec()
            .then(setRestrictions(req.body.restrictions))
            .then(handleAnswer(res))
            .onReject(function (err) {
                console.log(err);
            });
    };
}

module.exports = new BudiController();