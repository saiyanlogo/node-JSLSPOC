var express = require('express');
var router = express.Router();
var multer = require('multer');
var fs = require('fs');
var bt = require('buffer-type');
var usersData = require('../../schemas/usersData.js');
var mongoose = require('mongoose');
var gm = require('gm').subClass({ imageMagick: true });

var multerImageUpload = multer({
			dest: __dirname + '/temp',
			limits : {
				files: 1,
				fieldNameSize: 20,
				fileSize: (1024 * 1024 * 4),
				fieldSize: (1024 * 1024 * 4),
			},
			rename: function(fieldname, filename, req, res) {
				req.session.profilePicRename = fieldname.replace(/[\s]/, '') + '_' + filename.replace(/[\s]/, '') + '_' + Date.now();
				return req.session.profilePicRename;
			},
			changeDest: function(dest, req, res) {
				dest = __dirname + '/../usersProfilePic/' + req.session.name;
				if (!fs.existsSync(dest)) fs.mkdirSync(dest);
				return dest;
				
			},
			onFileUploadStart: function(file, req, res){
				if(file.mimetype != 'image/png' && file.mimetype != 'image/jpg' && file.mimetype != 'image/gif' && file.mimetype != 'image/webp') {
					return false;
					res.send('Invalid File');
				}
			},
			onFileUploadComplete: function(file, req, res) {
				req.session.forwardSlashFilePath = file.path.replace(/\\/g, "/");		
			},
			
});

router.post('/', multerImageUpload, function(req,res){
	var validation = bt(fs.readFileSync(req.session.forwardSlashFilePath));
	if(validation != 'undefined') {
		if(validation.type == 'image/gif' || validation.type == 'image/jpg' || validation.type == 'image/png' || validation.type == 'image/webp') {
			var new_size = (validation.width + validation.height) / (validation.width * (validation.height / 100));
			
			gm(req.session.forwardSlashFilePath)
				.autoOrient()
				.resize((new_size * validation.width))
				.write(req.session.forwardSlashFilePath, function(err){
					if (err) console.log(err);
				});
			
			var profilePicPath = 'http://localhost:3000/' + 'user/' + req.session.name + '/' + req.session.profilePicRename + validation.extension;//req.session.forwardSlashFilePath;
			var usersDataQuery = usersData.findOne({'username' : req.session.name})
								.select("username profilePic profilePicServer ipAddress date")
								.exec(function(err, usersData){
				if(usersData == null || usersData.username == null){
					createUsersData();
				} else if(usersData.username == req.session.name){
					try {fs.unlinkSync(usersData.profilePicServer)} catch (e) {console.log("Unable to unlink file: " + e)};
					
				
					usersData.profilePic = profilePicPath;
					usersData.profilePicServer = req.session.forwardSlashFilePath;
					usersData.profilePicExtension = validation.extension;
					usersData.usernameAsTyped = req.session.usernameAsTyped;
					usersData.ipAddress = req.ips;
					usersData.date = Date.now();
					usersData.save(function(err, doc){
						if(err) {
							res.send("There was an error. " + err + err.code);
						} else {
							setTimeout(function(){res.send("File uploaded successfully! <br><br> <img src='" + usersData.profilePic + "' />" )}, 3000);
						}
					});
				};
			});
		} else {
			fs.unlinkSync(req.session.forwardSlashFilePath);
			res.send('Invalid File');
		}
	} else {
		fs.unlinkSync(req.session.forwardSlashFilePath);
		res.send('Invalid File');
	}
	
	var createUsersData = function() {
		var profilePicPath = 'http://localhost:3000/' + 'user/' + req.session.name + '/' + req.session.profilePicRename + validation.extension;
		new usersData({
						_id	: mongoose.Types.ObjectId(),
						username : req.session.name,
						usernameAsTyped: req.session.usernameAsTyped,
						profilePic: profilePicPath,
						profilePicServer: req.session.forwardSlashFilePath,
						profilePicExtension: validation.extension,
						profileDesc: '',
						ipAddress: req.ip,
					}).save(function(err, doc){
					if(err) {
						res.send("There was an error. " + err + err.code);
					} else {
						setTimeout(function(){res.send("File uploaded successfully! <br><br> <img src='" + profilePicPath + "' />" )}, 3000);
					}
				});
	}
});

module.exports = router;