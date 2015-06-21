//.replace(/[^A-Za-z0-9-_]/gi, '')
var express = require('express');
var router = express.Router();
var crypto = require('crypto');
var users = require('../schemas/userSchema.js');
var mongoose = require('mongoose');

var regexSpecialChars = new RegExp(/[^A-Za-z0-9-_]/gi);

/* GET registration page. */
router.post('/', function(req, res, next) {
	if(req.body.username.length < 4 || req.body.username.length > 20) {
			//err = new Error("Username length too short");
			res.send("Username is either too short or too long <br> <a href='../login'>Click to go back</a>");
		} else if(req.body.password.length < 6 || req.body.password.length > 20) {
			//err = new Error("Password length too short");
			res.send("Password is either too short or too long <br> <a href='../login'>Click to go back</a>");
		} else if ((regexSpecialChars.test(req.body.username) == true) || (regexSpecialChars.test(req.body.password) == true)){
			res.send("<b style='color:red;'>Special Characters, excluding dashes and underscores, can not be used in the username or password fields.</b> <br> <a href='../register'>Click to go back</a>");
		} else if(req.body.username == 'undefined') {
			res.send("Username 'undefined' is not allowed");
		} else {
			
			var sha256Hash = crypto.createHash('sha256');
			var usersQuery = users.findOne({'username' : req.body.username.toLowerCase()})
							.select('username usernameAsTyped salt password privilege')
							.exec(function(err, users){
				//console.log('username: %s salt: %s', users.username, users.salt);
				if(users == null) {
					res.send('User does not exist');
				}else if(users.privilege == "banned") {
					res.send('You were banned!');
				} else if(typeof users != null && typeof users != 'undefined'){
					sha256Hash.update(sha256Hash.update(req.body.password.replace(/[^A-Za-z0-9-_]/gi, ''), 'ascii') + users.salt, 'ascii');
					var hash = sha256Hash.digest("base64");
					
					if(users.password == hash) {
						req.session.name = users.username;
						req.session.usernameAsTyped = users.usernameAsTyped;
						res.send('Welcome, ' + users.usernameAsTyped);
					} else {
						res.send('Incorrect Password.' + "<br><a href='../login'>Click to go back</a>");
					}
				}
			});
	}
});

module.exports = router;