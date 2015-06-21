var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var usersDataSchema = new Schema({
	_id	: Schema.Types.ObjectId,
	username : String,
	usernameAsTyped: String,
	profilePic: String,
	profilePicServer: String,
	profilePicExtension: String,
	profileDesc: String,
	ipAddress: [],
	date: {type: Date, default: Date.now},
		
});

var usersData = mongoose.model('usersData', usersDataSchema);
module.exports = usersData;