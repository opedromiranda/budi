/**
 * Created by pedromiranda on 04/10/14.
 */

var mongoose = require('mongoose'),
    meetSchema = new mongoose.Schema({
        budies : [{ id : mongoose.Schema.Types.ObjectId, friendReq: Boolean }],
        chat : 'array',
        age : Number,
        genre: String,
        reports: Number,
        restrictions: {
            age: Boolean,
            genre: String
        },
        finish: Boolean,
        date : Date
    });

/**
 * Search for meets that contain less than 2 budis and that are between 2 dates
 * @param startDate
 * @param endDate
 * @returns {Promise}
 */
meetSchema.statics.findAvailableMeets = function findAvailableMeets(startDate, endDate) {
    return Meet.findOne({
        date : {
            $gte : startDate,
            $lt : endDate
        },
        budies : {
            $not : {
                $size : 2
            }
        }
    }).exec();
};

meetSchema.methods.findBudis = function findBudis() {
    return Meet.find({
        budies : { id: this._id }
    }).exec()
};

var Meet = mongoose.model('Meet', meetSchema);

module.exports = Meet;