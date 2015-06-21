var express = require('express');
var router = express.Router();
var navMenuData = require('../routes/routesValidation/navmenudata.js');
var users = require('../schemas/usersData.js');
var mongoose = require('mongoose');
var data = {};

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', navMenuData(req, res));
});

router.get('/user/:user/:profilePic', function(req, res, next) {
	var user = req.params.user;
	var profilePic = req.params.profilePic;	
	res.sendFile(__dirname + '/usersProfilePic/' + user + '/' + profilePic);
});

router.get('/user/:user', function(req, res, next){
	var user = req.params.user;
	
	if(req.session != 'undefined') {
		if(req.session.name == req.params.user) {
			data.scripts = [{scriptSrc : 'https://cdn.webrtc-experiment.com/MediaStreamRecorder.js'}, {scriptSrc: 'http://localhost:3000/javascripts/getUserData.js'}];
		} else { 
			data.scripts = '';
		}
	} else {
		data.scripts = '';
	}
	
	var usersQuery = users.findOne({username : user})
					.select('usernameAsTyped profilePic profileDesc')
					.exec(function(err, users){
						if(users == null) {
							res.sendStatus(404);
						} else {
							data = navMenuData(req, res);
							data.user = user;
							data.title = user + "'s channel";
							data.profilePic = users.profilePic;
							data.profileDesc = users.profileDesc;
							req.session.roomChannel = user;
							//console.log('index.js - roomChannel name is: ' + req.session.roomChannel);
							res.render('users', data);
						}
					});
});

module.exports = router;
