/**
 * Created by pedromiranda on 04/10/14.
 */

var mongoose = require('mongoose');
var Meet = require('./meet.js')

var budiSchema = new mongoose.Schema({
    email : 'string',
    name : 'string',
    profile_picture : 'string'
});

/**
 * Finds meets budi took part that happened between to dates
 * @param startDate
 * @param endDate
 * @returns {Promise|Array|{index: number, input: string}|*}
 */
budiSchema.methods.findMeets = function findMeets(startDate, endDate) {
    console.log('findMeets');
    return Meet.find({
        date : {
            $gte : startDate,
            $lt : endDate
        },
        budies : this._id
    }).exec()
};

var Budi = mongoose.model('Budi', budiSchema);

module.exports = Budi;