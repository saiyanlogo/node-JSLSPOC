var express = require('express');
var router = express.Router();
var navMenuData = require('../routes/routesValidation/navmenudata.js');


/* GET registration page. */
router.get('/', function(req, res, next) {
	if((typeof req.session.name == 'undefined')) {
		console.log(req.session.name);
		res.render('login', navMenuData(req, res));
	} else {
		throw new Error("You\'re already logged in as " + req.session.name + "!");
	}
});

module.exports = router;
