jQuery(function($){
	var socket = io('http://localhost:3000/');
	socket.emit('room', room );
	
	$('#chatForm').submit(function(e){
		e.preventDefault();
		socket.emit('chatData', {message: $('#userChatMessage').val(), room: room });
		$('#userChatMessage').val('');
	});
	
	socket.on('chatData', function(data){
		$('#chat').append($('<li>').html(data.username + ": " + data.message));
	});	
});