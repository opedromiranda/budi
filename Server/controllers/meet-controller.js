/**
 * Created by pedromiranda on 04/10/14.
 */

var Meet = require('../models/meet.js');
var Budi = require('../models/budi.js');

function MeetController () {

    var budi;

    /**
     * Returns tomorrow's date
     * Hours, minutes and seconds are set to midnight
     * @returns {Date}
     */
    function getTomorrowDate () {
        var tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(0, 0, 0, 0);
        return tomorrow;
    }

    /**
     * Returns today's date
     * Hours, minutes and seconds are set to midnight
     * @returns {Date}
     */
    function getTodayDate () {
        var today = new Date();
        today.setHours(0, 0, 0, 0);
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
                error: 1,
                error_object : e
            });
        }
        return err;
    }

    /**
     * Returns a function that will interpret parameter b (budi)
     * The returning function will answer {error : 1} if budi is a null object, otherwise it will return a promise
     * that will search for budi's meets for today
     * @param res
     * @returns {Function}
     */
    function findTodayBudiMeets(res) {

        return function (b) {
            var today = getTodayDate(),
                tomorrow = getTomorrowDate();
            budi = b;

            if(!budi) {
                res.json({
                    error: 1
                });
                return;
            }
            return budi.findMeets(today, tomorrow);
        }
    }

    /**
     * If the meets array size is 0, returns a promise that search for any available meets for today,
     * otherwise returns first position of the array
     * @param meets
     * @returns {Meet|Promise}
     */
    function findAvailableMeets(meets) {
        var today = getTodayDate(),
            tomorrow = getTomorrowDate(),
            meet = meets.length > 0 ? meets[0] : null;

        if(!meet) {
            return Meet.findAvailableMeets(today, tomorrow);
        } else {
            return meet;
        }
    }

    /**
     * Returns a function that will receive a meet object
     * If the meet object is null, it will create and save a new meet object with budi._id
     * If the meet object isn't null but budi isn't part of the event, it will update the document adding budi._id
     * Uses res object to answer to the client the meet object
     * @param res
     * @returns {Function}
     */
    function handleMeet(res) {

        return function(meet) {
            console.log('handleMeet');
            if(!meet) {
                meet = new Meet({
                    date : getTodayDate(),
                    budies : [budi._id]
                });

                meet.save(function (err, meet) {
                    if(err) {
                        handleError(res);
                    }
                    res.json({
                        error: 0,
                        meet: meet
                    });
                });

            } else {
                if(meet.budies.indexOf(budi._id) == -1) {

                    meet.budies.push(budi._id);

                    Meet.update({_id : meet._id}, {
                        $push: {budies : budi._id}
                    }, function(err, numAffected, rawResponse) {
                        if(err) {
                            handleError(res);
                        }
                        res.json({
                            error: 0,
                            meet: meet
                        });
                    });
                } else {
                    res.json({
                        error: 0,
                        meet: meet
                    });
                }
            }
        }
    }

    this.findMeet = function (req, res) {

        if(!req.body.hasOwnProperty('budi_id')) {
            res.json({
                error: 1
            }, handleError(res));
            return;
        }

        Budi.findOne({_id : req.body.budi_id}).exec()
            .then(findTodayBudiMeets(res), handleError(res))
            .then(findAvailableMeets, handleError(res))
            .then(handleMeet(res));
    };
}

module.exports = new MeetController();