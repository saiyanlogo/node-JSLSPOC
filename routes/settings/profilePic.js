var express = require('express');
var router = express.Router();

var data = {}

/* GET registration page. */
router.get('/', function(req, res, next) {
	if(typeof req.session.name != 'undefined') {
		res.render('profilePic', data);
	} else {
		throw new Error("You're already logged out!");
	}
});

module.exports = router;
