/**
 * Created by pedromiranda on 04/10/14.
 */

var express = require('express');
var router = express.Router();

var budiController = require('../controllers/budi-controller.js');
var sessionController = require('../controllers/session-controller.js');


router.get('/count', budiController.count);
router.post('/insert', budiController.insert);  //email, name, bornDate, genre
router.post('/settings/restrictions', budiController.restrictions); // budi_id , restrictions = {"age"=false||true, "genre"= false | true
router.post('/login', sessionController.login);
router.post('/register', sessionController.register);
router.post('/add', budiController.addBudi);
router.get('/list/:budiId', budiController.getBudiFriendList);

module.exports = router;
