/**
 * Created by Emanuelpinho on 08/10/14.
 */

var mongoose = require('mongoose');
var Meet = require('../models/meet.js');
var Budi = require('../models/budi.js');


function ChatController () {

    /**
     * Object of the meet .l.
     */
    var meet;

    /**
     * Uses the response object to send a JSON object with error set to 1
     * @param res
     * @returns {err}
     */
    function handleError(res) {
        function err(e) {
            console.log(e);
            res.json({
                error: 1,
                error_object : e
            });
        }
        return err;
    }

    function handleMeetMessage(budiId, message) {

        return function(meet) {
            var result = new mongoose.Promise;

            if(meet.budies.indexOf(budiId) != -1) {

                Meet.update(
                    { _id : meet._id },
                    { $push: {chat : message } },
                    function(err) {
                        if(err) {
                            result.error(err);
                        }
                        result.fulfill({
                            error: 0,
                            //meet: meet
                        });
                    }
                );

            } else {
                result.err();
            }

            return result;
        }
    }

    function handleAnswer(res) {
        return function(answer) {
            res.json(answer);
        }
    }

    this.sendMessage = function (req,res) {

        var budiId = req.body.budi_id,
            meetId = req.body.meet_id,
            message = req.body.message;

        if (!message || !meetId || !budiId) {
            res.json({
                error: 1
            });
            return;
        }

        Meet.findOne({_id : meetId}).exec()
            .then(handleMeetMessage(budiId, message))
            .then(handleAnswer(res))
            .onReject(handleError(res));

    };
}

module.exports = new ChatController();
