/**
 * Created by pedromiranda on 04/10/14.
 */

var mongoose = require('mongoose');
var Meet = require('./meet');
var moment = require('moment');

var budiSchema = new mongoose.Schema({
    email : String,
    fbId : String,
    name : String,
    old_budis: [],
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

/*budiSchema.methods.findMeets = function findMeets(startDate, endDate) {
    return Meet.find({
        date : {
            $gte : startDate,
            $lt : endDate
        },
        budies : this._id
    }).exec()
};
*/

budiSchema.methods.findMeet = function findMeet() {

    var budiReports = this.reports.length,
        budiAgeRestriction = this.restrictions.age || false,
        budiGenreRestriction = this.restrictions.genre || false,
        oldBudis = this.old_budis,
        yearsOld = moment().diff(this.born_date, 'years'),
        gender = this.genre,
        query = {
            budies: {
                $size: 1,
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

    console.log(JSON.stringify(query, null, 15));

    return Meet.findOne(query).exec();
};

var Budi = mongoose.model('Budi', budiSchema);

module.exports = Budi;