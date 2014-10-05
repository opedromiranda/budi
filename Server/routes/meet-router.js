/**
 * Created by pedro on 05/10/14.
 */

var express = require('express');
var router = express.Router();

var meetController = require('../controllers/meet-controller.js');

router.post('/find', meetController.findMeet);
// sendMessage
// exitMeet
// reportBudi
// shareContactInformation

module.exports = router;