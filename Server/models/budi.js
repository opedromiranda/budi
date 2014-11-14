/**
 * Created by pedromiranda on 04/10/14.
 */

var mongoose = require('mongoose');
var Meet = require('./meet');
var moment = require('moment');

var budiSchema = new mongoose.Schema({
    email : String,
    name : String,
    old_budis: [],
    settings : {
            genre :
                {
                    genre: String,
                    restriction: Boolean
                },
            age:
                {
                    age: String,
                    restriction: Boolean
                },
            reports: Array
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

budiSchema.methods.findMeets = function findMeets() {
    var budiReports = this.settings.reports.length,
        budiAgeRestriction = this.settings.age.restriction,
        budiGenreRestriction = this.settings.genre.restriction,
        oldBudis = this.old_budis,
        yearsOld = moment().diff(this.settings.age.age, 'years'),
        gender = this.settings.genre.genre;

    if (budiAgeRestriction && budiGenreRestriction) {

        return Meet.find({
            budies: {
                size: 1,
                $nin: oldBudis
            },
            settings : {
                reports: {
                    size: {
                        $gte: (budiReports - 3),
                        $lt: (budiReports + 3)
                    }
                },
                age : {
                    $gte: (yearsOld - 5),
                    $lt: (yearsOld + 5)
                },
                genre : gender
            }
        }).exec()
    }

    else if (budiAgeRestriction && !budiGenreRestriction) {
        return Meet.find({
            budies: {
                size: 1,
                $nin: oldBudis
            },
            settings : {
                reports: {
                    size: {
                        $gte: (budiReports - 3),
                        $lt: (budiReports + 3)
                    }
                },
                age : {
                    $gte: (yearsOld - 5),
                    $lt: (yearsOld + 5)
                }
            }
        }).exec()
    }

    else if (!budiAgeRestriction && budiGenreRestriction) {
        return Meet.find({
            budies: {
                $size: 1,
                $nin: oldBudis
            },
            settings : {
                reports: {
                    $size: {
                        $gte: (budiReports - 3),
                        $lt: (budiReports + 3)
                    }
                },
                genre : gender
            }
        }).exec()
    }

    else {
        return Meet.find({
            budies: {
                $size: 1,
                $nin: oldBudis
            },
            settings : {
                reports: {
                    $size: {
                        $gte: (budiReports - 3),
                        $lt: (budiReports + 3)
                    }
                }
            }
        }).exec()
    }
};

var Budi = mongoose.model('Budi', budiSchema);

module.exports = Budi;