//.replace(/[^A-Za-z0-9-_]/gi, '')
var express = require('express');
var router = express.Router();
var crypto = require('crypto');
var mongoose = require('mongoose');
var users = require('../../schemas/userSchema.js');

var regexSpecialChars = new RegExp(/[^A-Za-z0-9-_]/gi);

/* GET registration page. */
router.post('/', function(req, res, next) {
	if(req.body.oldPassword.length < 6 || req.body.oldPassword.length > 20) {
			//throw new Error("Old Password length too short");
			res.send("Old Password is either too short or too long <br> <a href='../login'>Click to go back</a>");
		} else if(req.body.newPassword.length < 6 || req.body.newPassword.length > 20) {
			//throw new Error("Password length too short");
			res.send("Password is either too short or too long <br> <a href='../login'>Click to go back</a>");
		} else if ((regexSpecialChars.test(req.body.oldPassword) == true) || (regexSpecialChars.test(req.body.newPassword) == true)){
			//throw new Error('Special Characters not allowed');
			res.send("<b style='color:red;'>Special Characters, excluding dashes and underscores, can not be used in the username or password fields.</b> <br> <a href='../register'>Click to go back</a>");
		} else {	
			var sha256Hash = crypto.createHash('sha256');
			var usersQuery = users.findOne({'username' : req.session.name})
							.select('salt password')
			.exec(function(err, users){
				//console.log('username: %s salt: %s', users.username, users.salt);
				sha256Hash.update(sha256Hash.update(req.body.oldPassword.replace(/[^A-Za-z0-9-_]/gi, ''), 'ascii') + users.salt, 'ascii');
				var hash = sha256Hash.digest("base64");
				
				if(users.password == hash) {
					var sha256HashNew = crypto.createHash('sha256');
					var saltNew = crypto.randomBytes(256).toString('base64');
					sha256HashNew.update(sha256HashNew.update(req.body.newPassword.replace(/[^A-Za-z0-9-_]/gi, ''), 'ascii') + saltNew, 'ascii');
					var hashNew = sha256HashNew.digest('base64');
					
					users.password = hashNew;
					users.salt = saltNew;
					
					users.save();
					res.send('Password has been successfully changed.');
				} else {
					res.send('Incorrect Password.' + "<br><a href='../changePassword'>Click to go back</a>");
				}
			});
	}
});

module.exports = router;
