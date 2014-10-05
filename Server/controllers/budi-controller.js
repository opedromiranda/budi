/**
 * Created by pedromiranda on 04/10/14.
 */

var Budi = require('../models/budi.js');

function BudiController () {
    this.insert = function (req, res) {
        var budi;

        // validate mandatory Budi fields
        if( !req.body.hasOwnProperty('email') ||
            !req.body.hasOwnProperty('name') ) {

            res.json({
                error: 1
            });
            return;
        }

        budi = new Budi({
            name : req.body.name,
            email : req.body.email
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