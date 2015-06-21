var express = require('express');
var router = express.Router();
var navMenuData = require('../../routes/routesValidation/navmenudata.js');

/* GET registration page. */
router.get('/', function(req, res, next) {
	if((typeof req.session.name != 'undefined')) {
		res.render('changePassword', navMenuData(req, res));
	} else {
		throw new Error("You must be logged in to do that!");
	}
});

module.exports = router;
