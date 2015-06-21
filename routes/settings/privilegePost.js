//.replace(/[^A-Za-z0-9-_]/gi, '')
var express = require('express');
var router = express.Router();
var crypto = require('crypto');
var mongoose = require('mongoose');
var users = require('../../schemas/userSchema.js');

var regexSpecialChars = new RegExp(/[^A-Za-z0-9-_]/gi);
var regexSpecialCharsReason = new RegExp(/([()[{*+.$^\\|?])/g);

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
router.post('/', function(req, res, next) {
	if(req.body.username.length < 4 || req.body.username.length > 20) {
			//err = new Error("Username length too short");
			res.send("Username is either too short or too long <br> <a href='../login'>Click to go back</a>");
		} else if(req.body.reason.length > 500) {
			//err = new Error("Password length too short");
			res.send("Reason is too long <br> <a href='../'>Click to go back</a>");
		} else if ((regexSpecialChars.test(req.body.username) == true) || (regexSpecialCharsReason.test(req.body.reason) == true)){
			res.send("<b style='color:red;'>Special Characters, excluding dashes and underscores, can not be used in the username or reason fields.</b> <br> <a href='../register'>Click to go back</a>");
		} else {
			var usersQuery = users.findOne({'username' : req.body.username.toLowerCase()})
							.select('username usernameAsTyped privilege')
			.exec(function(err, users){
				if(users == null) {
					res.send('User does not exist');
				} else {
					if(req.body.privilege == 'banned' || req.body.privilege  == 'user' || req.body.privilege  == 'mod' || req.body.privilege  == 'admin' || req.body.privilege  == 'dev'){
						oldPrivilege = users.privilege;
						if(req.body.privilege  == 'mod' || req.body.privilege  == 'admin' || req.body.privilege  == 'dev') {
							users.privilege = "<b style='color:purple;'>" + req.body.privilege + "</b>";
							users.usernameAsTyped = "<b style='color:purple;'>" + users.usernameAsTyped + "</b>";
						} else { 
							users.privilege = req.body.privilege;
						}
						users.reason = req.body.reason;
						users.save();

						res.send("User '" + users.usernameAsTyped + "' had status changed from: " + oldPrivilege + ", to: " + users.privilege + "by: " + req.session.name + "<br> because: " + users.reason);
					} else {
						res.send('Check your privileges');	
					}
				}					
			});
	}
});

module.exports = router;
