var data = {};

var getNavBar = function(req, res) {
	if (typeof req.session.name == 'undefined') {
		data.url = [{link : '/login', linkName: 'Login'}, {link:'/register', linkName: 'Register'}, {link: '/', linkName: 'Home'}];
		data.user = "Register today!";
		data.title = "Hi";
	} else if(typeof req.session.name != 'undefined') {
		data.url = [{link : '/logout', linkName: 'Logout'}, {link: '/settings/profilePic', linkName: 'Change Your Profile Image'}, {link:'/settings/changePassword', linkName: 'Change Password'}, {link:'/settings/profileDesc', linkName: 'Update Profile Description'}, {link: '/', linkName: 'Home'}];
		data.user = req.session.usernameAsTyped;
		data.title = "Welcome Back, " + data.user;
	}
	return data;
}


module.exports = getNavBar;