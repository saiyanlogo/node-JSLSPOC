var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var users = require('../../schemas/userSchema.js');
var navMenuData = require('../routesValidation/navmenudata.js');



/*
privilege statuses

user
banned
mod
admin
dev
creator

*/

/* GET registration page. */
router.get('/', function(req, res, next) {
	
	if(typeof req.session.name != 'undefined') {
		
		var usersQuery = users.findOne({'username' : req.session.name})
			.select("privilege")
			.exec(function(err, users){	
				if(users.privilege == 'creator') {
					res.render('privilege', navMenuData(req, res));
				} else {
					res.status(403).send('You must have proper privileges to do that!');
				}
			});
		
		
	} else {
		res.status(403).send('You must have proper privileges to do that!');
	}
});

module.exports = router;
