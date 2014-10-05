/**
 * Created by pedromiranda on 04/10/14.
 */

var express = require('express');
var router = express.Router();

var budiController = require('../controllers/budi-controller.js');


router.get('/count', budiController.count);
router.post('/insert', budiController.insert);

module.exports = router;