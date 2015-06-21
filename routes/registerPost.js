//.replace(/[^A-Za-z0-9-_]/gi, '')
var express = require('express');
var router = express.Router();
var crypto = require('crypto');
var users = require('../schemas/userSchema.js');
var usersData = require('../schemas/usersData.js');
var mongoose = require('mongoose');

/*

var Schema = mongoose.Schema;
var userSchema = new Schema({
	_id	: Schema.Types.ObjectId,
	username : String,
	usernameAsTyped: String,
	salt: String,
	password : String
});
var users = mongoose.model('users', userSchema);
*/
var regexSpecialChars = new RegExp(/[^A-Za-z0-9-_]/gi);

/* GET registration page. */
router.post('/', function(req, res, next) {
	if(req.body.username.length < 4 || req.body.username.length > 20) {
			//err = new Error("Username length too short");
			res.send("Username is either too short or too long <br> <a href='../register'>Click to go back</a>");
		} else if(req.body.password.length < 6 || req.body.password.length > 20) {
			//err = new Error("Password length too short");
			res.send("Password is either too short or too long <br> <a href='../register'>Click to go back</a>");
		} else if ((regexSpecialChars.test(req.body.username) == true) || (regexSpecialChars.test(req.body.password) == true)){
			res.send("<b style='color:red;'>Special Characters, excluding dashes and underscores, can not be used in the username or password fields.</b> <br> <a href='../register'>Click to go back</a>");
		} else if(req.body.username.toLowerCase() == 'undefined'){
			res.send("Banned Username <br> <a href='../register'>Click to go back</a>")
		} else {
			var sha256Hash = crypto.createHash('sha256');
			var salt = crypto.randomBytes(256).toString('base64');
		
			sha256Hash.update(sha256Hash.update(req.body.password.replace(/[^A-Za-z0-9-_]/gi, ''), 'ascii') + salt, 'ascii');
			var hash = sha256Hash.digest("base64");
			
			new users({
				_id		: mongoose.Types.ObjectId(),
				username: req.body.username.toLowerCase().replace(/[^A-Za-z0-9-_]/gi, ''),
				usernameAsTyped: req.body.username.replace(/[^A-Za-z0-9-_]/gi, ''),
				salt: salt,
				password: hash,
				privilege: 'user',
				reason: ''	
			}).save(function(err, doc){
				if(err) {
					if(err.code == 11000) {
						res.send("<b style='color:red;'>User already exist!</b><br><a href='../register'>Click here to go back</a>");
					} else {
						res.send("<b style='color:red;'>There was an error.</b><br>" + err + err.code);
					}
				} else {
					new usersData({
						_id	: mongoose.Types.ObjectId(),
						username : req.body.username.toLowerCase().replace(/[^A-Za-z0-9-_]/gi, ''),
						usernameAsTyped: req.body.username.replace(/[^A-Za-z0-9-_]/gi, ''),
						profilePic: '',
						profilePicServer: '',
						profilePicExtension: '',
						profileDesc: '',
						ipAddress: req.ip,
					}).save(function(err, doc){
						if(err) {
							res.send("There was an error. <br /> " + err + err.code);
						} else {
							res.send('<b style="color:green;">registration Success</b><br><a href="../">Click to return to home page</a>')//, { title: 'Success' });
						}
				});	
		}
	});
	}
});

module.exports = router;