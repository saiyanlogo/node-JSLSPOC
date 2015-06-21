var express = require('express');
var router = express.Router();
var navMenuData = require('../../routes/routesValidation/navmenudata.js');
var usersData = require('../../routes/routesValidation/usersdata.js');

/* GET users listing. */
router.get('/', function(req, res, next) {
	if(req.session.name != 'undefined') {
		var data = navMenuData(req, res);
		res.render('profileDesc', data);
	} else {
		res.send('You must be logged in.');
	}
});

module.exports = router;
