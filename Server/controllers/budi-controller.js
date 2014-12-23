/**
 * Created by pedromiranda on 04/10/14.
 */

var mongoose = require('mongoose');
var Budi = require('../models/budi.js');
var Meet = require('../models/meet.js');
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

    function insertBudi(req){
        return function(b){
            var result = new mongoose.Promise;
            var budi, bornDate;

            if (!b) {
                if ( moment(req.body.born_date).isValid() ) {
                    bornDate = moment(req.body.born_date );
                }
                else {
                    throw new Error('Invalid date born');
                }

                budi = new Budi({
                    name : req.body.name,
                    fb_id : req.body.fb_id,
                    genre : req.body.gender,
                    born_date : bornDate,
                    old_budis: [],
                    restrictions : {
                        genre : null,
                        age : false
                    }
                });

                budi.save(function (err) {
                    if(err) {
                        console.log(err);
                        result.fulfill({
                            error: 1,
                            reason: 'An error occurred on registration'
                        });
                    } else {
                        result.fulfill({
                            error: 0,
                            budi : budi
                        });
                    }
                });
            }
            else {
                result.fulfill({
                    error : 0,
                    budi : budi
                });
            }
            return result;
        }
    }

    this.insert = function (req, res) {
        var budi, bornDate;

        // validate mandatory Budi fields
        if( !req.body.hasOwnProperty('fb_id') ||
            !req.body.hasOwnProperty('name') ||
            !req.body.hasOwnProperty('born_date') ||
            !req.body.hasOwnProperty('gender')) {
                res.json({
                    error: 1,
                    reason: 'Missing arguments'
                });
                return;
            }

        if ( moment(req.body.born_date).isValid() ) {
            bornDate = moment(req.body.born_date );
        }
        else {
            throw new Error('Invalid date born');
        }

        budi = new Budi({
            name : req.body.name,
            fb_id : req.body.fb_id,
            genre : req.body.gender,
            born_date : bornDate,
            old_budis: [],
            restrictions : {
                genre : false,
                age : false
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

    function updateFriendList(meet){
        var budi1 = meet.budies[0], budi2 = meet.budies[1];

        if (budi1.friendReq && budi2.friendReq) {

            Budi.update(
                { "_id": budi1.id, "old_budis.id": budi2.id },
                { "old_budis.$.friend" : true },
                function(err,numAffected) {
                    if(err) {
                        console.log(err);
                    }
                    else
                        console.log(numAffected);
                }
            );

            Budi.update(
                { "_id": budi2.id, "old_budis.id": budi1.id },
                { "old_budis.$.friend" : true },
                function(err,numAffected) {
                    if(err) {
                        console.log(err);
                    }
                    else
                        console.log(numAffected);
                }
            );
        }
    }

    function addBudi(b){
        return function(m){
            var result = new mongoose.Promise;

            Meet.findById(m._id,function(err, doc) {
                if (err) {
                    result.error(err);
                    return;
                }
                else {
                    doc.budies.forEach(function(budi){
                        if(budi.id == b){
                            budi.friendReq = true;
                        }
                    });
                    doc.save(function (err, meet) {
                        if (err) {
                            result.error(meet);
                            return;
                        }
                        updateFriendList(meet);
                        result.fulfill({
                            error: 0,
                            meet: meet
                        });
                    });
                }
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

    this.login = function (req, res) {
        if(!req.body.hasOwnProperty('fb_id') ||
            !req.body.hasOwnProperty('access_token')) {
            res.json({
                error:1
            });
            return;
        }

        Budi.findOne({fb_id : req.body.fb_id}).exec()
            .then(insertBudi(req))
            .then(handleAnswer(res))
            .onReject(function (err) {
                res.json({
                    error: 1,
                    reason: err.message
                });
            });
    };

    this.addBudi = function (req, res){
        var budiId = req.body.budi_id,
            meetId = req.body.meet_id;

        if (!meetId || !budiId) {
            res.json({
                error: 1
            });
            return
        }

        Meet.findOne({_id: meetId}).exec()
            .then(addBudi(budiId))
            .then(handleAnswer(res))
            .onReject(function (err){
                console.log(err);
            })

    };
}

module.exports = new BudiController();
