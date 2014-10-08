/**
 * Created by Emanuelpinho on 08/10/14.
 */

var mongoose = require('mongoose');
var Meet = require('../models/meet.js');
var Budi = require('../models/budi.js');

function ChatController () {

    /**
     * Object of the budi that is making the request
     */
    var meet;

    function findBudis(m) {
        meet = m;

        return meet.findBudis();
    }

    this.sendMessage = function (req,res) {

        if (!req.body.message || !req.body.meet_id || !req.body.budi.id) {
            res.json({
                error: 1
            }, handleError(res));
            return;
        }

        Budi.findOne({_id : req.body.meet_id}).exec()
            .then(findBudis(req.body.budi.id));


        /*Budi.findOne({_id : req.body.budi_id}).exec()
            .then(findTodayBudiMeets)
            .then(findAvailableMeets)
            .then(handleMeet)
            .then(handleAnswer(res))
            .onReject(handleError(res));
            */

    };
}

module.exports = new ChatController();
