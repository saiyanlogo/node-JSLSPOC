var sockets = function (io, req, res) {
	room = io.of('/content');
	
	room.on('connection', function(socket){	
		setTimeout(function() {
			try {
				socket.join(req.session.roomChannel);
				room.to(req.session.roomChannel).emit('chatData', '<b>' + req.session.name + ' has joined!</b>');
				console.log(req.session.name + ' has joined ' + req.session.roomChannel + ' with ID ' + socket.id);
			} catch(e) {
				console.log(e);
			};
		}, 3000);
		
		socket.on('chatData', function(data){
			//The Data always gets sent to the server, yet *sometimes* won't be sent to the clients?
			room.to(req.session.roomChannel).emit('chatData', req.session.name + ': ' + data.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;'));
			console.log(req.session.name + ': ' + data + ' :: in room :: ' + req.session.roomChannel);
		});
		
		/*
		socket.on('videoData', function(id, data){
			if(req.session.name == req.session.roomChannel) {
				socket.broadcast.to(req.session.roomChannel).emit('videoData', data);
			} else {
				if(io.sockets.connected[id]) {
					socket.broadcast.to(id).emit('chatData', '<b>You are not the channel\'s broadcaster.</b>');
				}
			}
		});
		*/
		socket.on('disconnect', function(){
			socket.leave(req.session.roomChannel);
			console.log(req.session.name + ' with ID '+ socket.id +' has left ' + req.session.roomChannel);		
		});
	});
}


module.exports = sockets;