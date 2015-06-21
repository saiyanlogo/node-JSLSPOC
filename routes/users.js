var express = require('express');
var router = express.Router();
var navMenuData = require('../routes/routesValidation/navmenudata.js');
var usersData = require('../routes/routesValidation/usersdata.js');

/* GET users listing. */
router.get('/', function(req, res, next) {
		var data = navMenuData(req, res);
		res.render('users', data);
});

module.exports = router;
