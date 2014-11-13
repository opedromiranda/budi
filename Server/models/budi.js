/**
 * Created by pedromiranda on 04/10/14.
 */

var mongoose = require('mongoose');
var Meet = require('./meet.js');

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
            reports: []
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
    var budiReports = this.options.numberReports;

    return Meet.find({
        budies: {
            size: 1,
            $nin: this.oldBudis
        },
        settings : {
            reports: {
                reports : {
                    $gte: (budiReports - 3),
                    $lt: (budiReports + 3)
                }
            }
        }
    }).exec()
};

var Budi = mongoose.model('Budi', budiSchema);

module.exports = Budi;