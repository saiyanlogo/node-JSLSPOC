var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var userSchema = new Schema({
	_id	: Schema.Types.ObjectId,
	username : String,
	usernameAsTyped: String,
	salt: String,
	password : String,
	privilege: String,
	reason: String
	
});

/*
privilege statuses

user
banned
mod
admin
dev
creator

*/

var users = mongoose.model('users', userSchema);

module.exports = users;