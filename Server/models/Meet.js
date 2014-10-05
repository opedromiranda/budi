/**
 * Created by pedromiranda on 04/10/14.
 */

var mongoose = require('mongoose');

var meetSchema = new mongoose.Schema({
    budies : [{ type: mongoose.Schema.Types.ObjectId}],
    chat : 'array',
    date : 'date'
});

var Meet = mongoose.model('Meet', meetSchema);

module.exports = Meet;