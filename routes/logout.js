var express = require('express');
var router = express.Router();

/* GET registration page. */
router.get('/', function(req, res, next) {
	
	if(typeof req.session.name != 'undefined') {
		req.session.destroy();
		res.send('logged out! <a href="../">Click to go back</a>');
	} else {
		throw new Error("You're already logged out!");
	}
});

module.exports = router;
