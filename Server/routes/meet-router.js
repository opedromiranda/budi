/**
 * Created by pedro on 05/10/14.
 */

var express = require('express');
var router = express.Router();

var meetController = require('../controllers/meet-controller.js');
var chatController = require('../controllers/chat-controller.js');

router.post('/find', meetController.findMeet);
router.post('/message/text', chatController.sendMessage); // Falta imagens
router.post('/message/image', charController.sendImage);

// exitMeet
// reportBudi
// shareContactInformation
// Social login
// Chat unlock


module.exports = router;