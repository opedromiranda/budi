/**
 * Created by pedromiranda on 04/10/14.
 */

var mongoose = require('mongoose');
var Meet = require('../models/meet');
var Budi = require('../models/budi');
var moment = require('moment');

function MeetController () {

    /**
     * Object of the budi that is making the request
     */
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
     * Uses response object to send a JSON object with given object
     * @param res
     * @returns {answer}
     */
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
            //throw e;
            res.json({
                error: 1,
                error_object : e
            });
        }
        return err;
    }

    /**
     * Returns a promise that will query for meets that budi b might have for today
     * @param b
     * @returns {mongoose.Promise}
     */
    function findTodayBudiMeets(b) {
        var today = getTodayDate(),
            tomorrow = getTomorrowDate();
        budi = b;
        return budi.findMeets(today, tomorrow);
    }

    /**
     * If the meets array size is 0, returns a promise that search for any available meets for today,
     * otherwise returns first position of the array
     * @param meets
     * @returns {Meet|Promise}
     */
    /*function findAvailableMeets(meets) {
        var today = getTodayDate(),
            tomorrow = getTomorrowDate(),
            meet = meets.length > 0 ? meets[0] : null;

        if(!meet) {
            return Meet.findAvailableMeets(today, tomorrow);
        } else {
            return meet;
        }
    }
    */

    function findAvailableMeets(b) {
        budi = b;
        return budi.findMeet();
    }

    function updateOldBudis(meet, callback){
        var budi1 = meet.budies[0];
        var budi2 = meet.budies[1];

        Budi.findOne({_id : budi1}, function(err, doc){
            if(err || !doc){
                callback(new Error());
            }
            else {
                Budi.update({_id : doc._id},{
                    $push : {
                        old_budis : {
                            id : budi2,
                            friend: false
                            }
                        }
                }, callback);
            }
        });
    }

    /**
     * Returns a promise that will try to be fulfilled with a meet object to be answered to client
     * If the meet object is null, it will create and save a new meet object with budi._id
     * If the meet object isn't null but budi isn't part of the event, it will update the document adding budi._id
     * @param meet
     * @returns {mongoose.Promise}
     */
    function handleMeet(meet) {
        var result = new mongoose.Promise;

        // no meet is available, create new one
        if(!meet) {
            meet = new Meet({
                date : moment(),
                budies : [budi._id],
                age : moment().diff(budi.born_date, 'years'),
                genre : budi.genre,
                reports : budi.reports.length,
                restrictions : {
                    age : budi.restrictions.age,
                    genre : budi.restrictions.genre
                }
            });

            meet.save(function (err, meet) {

                if(err) {
                    result.error(err);
                }
                result.fulfill({
                    error: 0,
                    meet: meet
                });
            });
        }
        // found a valid meet
        else {
            // budi isn't part of selected meet, therefore should become a member
            if(meet.budies.indexOf(budi._id) == -1) {

                meet.budies.push(budi._id);

                Meet.update({_id : meet._id}, {
                    $push: {budies : budi._id}
                }, updateOldBudis(meet, function(err) {
                    if(err) {
                        result.error(err);
                    }
                    result.fulfill({
                        error: 0,
                        meet: meet
                    });
                }));
            }
            // budi is part of the meet
            else {
                result.fulfill({
                    error: 0,
                    meet: meet
                });
            }
        }

        return result;
    }

    this.findMeet = function (req, res) {

        if(!req.body.hasOwnProperty('budi_id')) {
            res.json({
                error: 1
            }, handleError(res));
            return;
        }

        // findAvailableMeets  -> meets    -> ver questão de delay, e só verificar se tem um budi no fim.

        Budi.findOne({_id : req.body.budi_id}).exec()
            .then(findAvailableMeets)
            .then(handleMeet)
            .then(handleAnswer(res))
            .onReject(handleError(res));
    };

}


module.exports = new MeetController();
