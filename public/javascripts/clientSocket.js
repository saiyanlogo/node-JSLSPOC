jQuery(function($){
	var socket = io('http://localhost:3000/content');
	$('#chatForm').submit(function(e){
		e.preventDefault();
		socket.emit('chatData', $('#userChatMessage').val());
		$('#userChatMessage').val('');
	});
	
	socket.on('chatData', function(data){
		$('#chat').append($('<li>').html(data));
	});	
});