/**
 * Created by pedromiranda on 04/10/14.
 */

var Budi = require('../models/budi.js');
var moment = require('moment');

function BudiController () {
    this.insert = function (req, res) {
        var budi, age, now = moment(), bornDate;

        // validate mandatory Budi fields
        if( !req.body.hasOwnProperty('email') ||
            !req.body.hasOwnProperty('name') ||
            !req.body.hasOwnProperty('dateBorn') || // yyyy-mm-dd
            !req.body.hasOwnProperty('genre')) {

            res.json({
                error: 1
            });
            return;
        }

        bornDate = moment(req.body.dateBorn);
        age = now.diff(bornDate, 'years');

        budi = new Budi({
            name : req.body.name,
            email : req.body.email,
            settings : [{
                genre: req.body.genre,
                age: age,
                numberReports: 0
            }]
        });

        budi.save(function (err) {
            if(err) {
                res.json({error: 1});
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
    }
}

module.exports = new BudiController();