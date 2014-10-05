/**
 * Created by pedromiranda on 04/10/14.
 */
var mongoose = require('mongoose');
var Meet = require('../models/meet.js');
var Budi = require('../models/budi.js');

function MeetController () {

    /**
     * Returns tomorrow's date
     * Hours, minutes and seconds are set to 0
     * @returns {Date}
     */
    function getTomorrowDate () {
        var tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(0);
        tomorrow.setMinutes(0);
        tomorrow.setSeconds(0);

        return tomorrow;
    }

    /**
     * Returns today's date
     * Hours, minutes and seconds are set to 0
     * @returns {Date}
     */
    function getTodayDate () {
        var today = new Date();
        today.setHours(0);
        today.setMinutes(0);
        today.setSeconds(0);

        return today;
    }

    /**
     * Uses the response object to send a JSON object with error set to 1
     * @param res
     * @returns {err}
     */
    function handleError(res) {
        function err(e) {
            res.json({
                error: 1
            });
        }
        return err;
    }

    this.findMeet = function (req, res) {
        var budi,
            today = getTodayDate(),
            tomorrow = getTomorrowDate();

        if(!req.body.hasOwnProperty('budi_id')) {
            res.json({
                error: 1
            }, handleError(res));
            return;
        }

        Budi.findOne({_id : req.body.budi_id}).exec()
            .then(function handleBudi (b) {
                budi = b;
                if(!budi) {
                    res.json({
                        error: 1
                    });
                    return;
                }

                return Meet.findOne({
                    date : {
                        $gte : today,
                        $lt : tomorrow
                    },
                    budies : budi._id
                }).exec();

            }, handleError(res))
            .then(function (meet) {
                if(!meet) {
                    return  Meet.findOne({
                        date : {
                            $gte : today,
                            $lt : tomorrow
                        },
                        budies : {
                            $not : {
                                $size : 2
                            }
                        }
                    }).exec();
                } else {
                    return meet;
                }
            }, handleError(res))
            .then(function (meet) {
                if(!meet) {
                    meet = new Meet({
                        date : getTodayDate(),
                        budies : [budi._id]
                    });

                } else {
                    if(meet.budies.indexOf(budi._id) == -1)
                        meet.budies.push(budi._id)
                }

                meet.save(function (err, meet) {
                    if(err) {
                        handleError(res);
                    }
                    res.json({
                        error: 0
                    });
                });
            });
    };
}

module.exports = new MeetController();