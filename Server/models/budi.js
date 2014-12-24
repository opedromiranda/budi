/**
 * Created by pedromiranda on 04/10/14.
 */

var mongoose = require('mongoose');
var Meet = require('./meet.js');
var moment = require('moment');

var budiSchema = new mongoose.Schema({
    name : String,
    fb_id : String,
    old_budis: [{
        id : String,
        friend : Boolean
    }],
    genre: String,
    born_date: String,
    reports: [],
    restrictions: {
        genre: String,
        age: Boolean
    },
    profile_picture : String
});

/**
 * Finds meets budi took part that happened between to dates
 * @param startDate
 * @param endDate
 * @returns {Promise|Array|{index: number, input: string}|*}
 */
budiSchema.methods.findMeets = function findMeets(startDate, endDate) {
    return Meet.find({
        date : {
            $gte : startDate,
            $lt : endDate
        },
        budies : this._id
    }).exec()
};

budiSchema.methods.findMeet = function findMeet() {

    var budiReports = this.reports.length,
        budiAgeRestriction = this.restrictions.age || false,
        budiGenreRestriction = this.restrictions.genre || false,
        oldBudis = [],
        yearsOld = moment().diff(this.born_date, 'years'),
        gender = this.genre;

        this.old_budis.forEach(function (oldBudi) {
            oldBudis.push(oldBudi.id);
        });
    var query = {
            budies: {
                $size: 1
            },
            'budies.id': {
                $nin: oldBudis
            },
            reports: {
                $gte: (budiReports - 3),
                $lt: (budiReports + 3)
            },

            $and: [
                {
                    $or: [{
                            "restrictions.genre": null
                        },
                        {
                            "restrictions.genre": gender
                        }]
                }, {
                    $or: [{
                            "restrictions.age": null
                        }, {
                            "age": {
                                $gte: (yearsOld - 5),
                                $lt: (yearsOld + 5)
                            }
                        }]
                }, {
                    "age": budiAgeRestriction ? {
                            $gte: (yearsOld - 5),
                            $lt: (yearsOld + 5)
                        } : { $exists: true },
                    "genre": budiGenreRestriction ? gender : { $exists: true }
                }
            ]
        };

    return Meet.findOne(query).exec();
};

budiSchema.methods.findFriends = function findFriends() {
    var result = [];

    this.old_budis.forEach(function(f){
        if (f.friend) {
            result.push(f.id);
        }
    });

    return result;
};

var Budi = mongoose.model('Budi', budiSchema);

module.exports = Budi;
