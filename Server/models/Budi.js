/**
 * Created by pedromiranda on 04/10/14.
 */

var mongoose = require('mongoose');

var budiSchema = new mongoose.Schema({
    email : 'string',
    name : 'string',
    profile_picture : 'string'
});

var Budi = mongoose.model('Budi', budiSchema);

module.exports = Budi;

/*
module.exports.list = function(req, res) {
    User.find(function(err, users) {
        res.send(users);
    });
};
*/