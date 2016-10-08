var express = require('express');
var sessionExpress = require('express-session');
var sharedsession = require("express-socket.io-session");
var multer = require('multer');
var app = express(); 
var http = require('http');
var server = http.createServer(app);

var io = require('socket.io')(server);

var ipfilter = require('express-ipfilter');
var mongoStore = require('connect-mongo')(sessionExpress);

var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var crypto = require('crypto');

var mongoose = require('mongoose');
mongoose.connect("mongodb://localhost/lit");

var routes = require('./routes/index');
var register = require('./routes/register');
var registerPost = require('./routes/registerPost');
var login = require('./routes/login');
var loginPost = require('./routes/loginPost');
var logout = require('./routes/logout');
var changePassword = require('./routes/settings/changePassword');
var changePasswordPost = require('./routes/settings/changePasswordPost');
var privilege = require('./routes/settings/privilege');
var privilegePost = require('./routes/settings/privilegePost');
var profilePic = require('./routes/settings/profilePic');
var profilePicPost = require('./routes/settings/profilePicPost');
var profileDesc = require('./routes/settings/profileDesc');
var profileDescPost = require('./routes/settings/profileDescPost');
var user = require('./routes/users');

var ips = []; 
app.use(ipfilter(ips, {mode : 'allow', errorCode : 403, errorMessage : 'You\'ve been banned! Email us for help.'}));

function redirectSec(req, res, next) {
  if (req.headers['x-forwarded-proto'] == 'http') {
      res.redirect('https://' + req.headers.host + req.path);
  } else {
      return next();
  }
}

var port = '3000';
app.set('port', port);
server.listen(port);


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hjs');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));

var session = sessionExpress({
				secret: 'spaghetti',
				store: new mongoStore({
					db: 'litSessions',
					host: 'localhost'
				}),
				saveUninitialized: true,
				resave: true,	
				});
				
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser('spaghetti'));
app.use(session);
app.use(require('less-middleware')(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));

app.enable('trust proxy');

app.use('/', routes);

app.use('/register', register);
app.use('/register/post', registerPost);
app.use('/login', login);
app.use('/login/post', loginPost);
app.use('/logout', logout);

app.use('/settings/changePassword', changePassword);
app.use('/settings/changePassword/post', changePasswordPost);

app.use('/settings/privilege', privilege);
app.use('/settings/privilege/post', privilegePost);

app.use('/settings/profilePic', profilePic);
app.use('/settings/profilePic/post', profilePicPost);

app.use('/settings/profileDesc', profileDesc);
app.use('/settings/profileDesc/post', profileDescPost);

//Socket Server
var io = require('socket.io')(server);
var p2p = require('socket.io-p2p-server').Server;

io.use(sharedsession(session));

io.on("connection", function(socket){
	console.log(socket.handshake.session);
	
	socket.on("room", function(data){
		
		socket.join(data);
		console.log("user joined room -> " + data);
	});
	
	socket.on('chatData', function(data){
		data.username = socket.handshake.session.usernameAsTyped;
		io.in(data.room).emit('chatData', data);
		console.log(data);
	});
	
	socket.on('disconnect', function(){
		delete socket;
	})
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// production error handler
// no stacktraces leaked to user

app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: err,
    });
});

console.log("Running on port: " + port);

module.exports = app;
