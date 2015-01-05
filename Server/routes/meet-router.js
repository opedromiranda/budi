/**
 * Created by pedro on 05/10/14.
 */

var express = require('express');
var router = express.Router();

var meetController = require('../controllers/meet-controller.js');
var chatController = require('../controllers/chat-controller.js');

router.post('/find', meetController.findMeet); //budi_id = id
router.post('/message/text', chatController.sendMessage);
router.post('/message/image', chatController.sendImage);
router.get('/get/:meetId', chatController.get); //TODO /api/meets/get/12312312312
router.post('/leave', meetController.leave);


module.exports = router;