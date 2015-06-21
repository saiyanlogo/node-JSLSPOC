var express = require('express');
var router = express.Router();
var usersData = require('../../schemas/usersData.js');
var mongoose = require('mongoose');

router.post('/', function(req,res){
	//.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
		
	
	if(req.body.profileDesc.length <= 500) {
		var profileDesc = req.body.profileDesc.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
		usersData.findOne({'username' : req.session.name})
				.select('username usernameAsTyped profilePic profilePicServer profilePicExtension ipAddress profileDesc')
				.exec(function(err, usersData){
					if(usersData == null || usersData.username == null){
						createUsersData();
						console.log(console.log(usersData.username));
					} else {
						usersData.profileDesc = profileDesc;
						usersData.save(function(err, doc){
							if (err) {
								res.send("There was an error: " + err);
							} else {
								res.send("Bio was saved successfully");
							}
						});
					}	
				});			
	} else { 
		res.send('Error: Length too long');
	}

	var createUsersData = function() {
		//var profilePicPath = 'http://localhost:3000/' + 'user/' + req.session.name + '/' + req.session.profilePicRename + validation.extension;
		new usersData({
						_id	: mongoose.Types.ObjectId(),
						username : req.session.name,
						usernameAsTyped: req.session.usernameAsTyped,
						profilePic: '',
						profilePicServer: '',
						profilePicExtension: '',
						profileDesc: profileDesc,
						ipAddress: req.ip,
					}).save(function(err, doc){
					if(err) {
						res.send("There was an error. <br /> " + err + err.code);
					} else {
						res.send("Bio updated successfully");
					}
				});
	}
	
});
module.exports = router;