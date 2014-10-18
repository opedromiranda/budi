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
            email : req.body.email,
            fbId : req.body.fbId
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

    this.exists = function (req, res) {
        Budi.findOne({
            fbId : req.params.id
        }, function (err, user) {
            if(err) {
                res.json({
                    error : 1
                });
            }
            var result = user ? true : false;
            res.json({
                error : 0,
                result : result,
                user : user
            });


        })
    }
}

module.exports = new BudiController();