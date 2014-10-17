/**
 * Created by pedro on 05/10/14.
 */

var express = require('express');
var router = express.Router();

var meetController = require('../controllers/meet-controller.js');
var chatController = require('../controllers/chat-controller.js');

router.post('/find', meetController.findMeet);
router.post('/message/text', chatController.sendMessage);
router.post('/message/image', chatController.sendImage);
//router.get('/get/:meetId', meetController.get); TODO /api/meet/get/12312312312


module.exports = router;