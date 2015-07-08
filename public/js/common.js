/**
 * New node file
 */

jq = $.noConflict();
pageObj = {};
menuOpen = false;
getrooms = {};
socket = io.connect('http://192.168.0.3:3000');
// on connection to server, ask for user's name with an anonymous callback
socket.on('connect', function(){
	// call the server-side function 'adduser' and send one parameter (value of prompt)
	socket.emit('adduser', "wooyoungyoon");
});

// listener, whenever the server emits 'updatechat', this updates the chat body
socket.on('updatechat', function (username, data) {
	jq('#conversation').append('<b>'+username + ':</b> ' + data + '<br>');
});

// listener, whenever the server emits 'updaterooms', this updates the room the client is in
socket.on('updaterooms', function(rooms, current_room) {
	jq('#rooms').empty();
	getrooms = rooms;
	for(var i = 0; i < rooms.length; i++){
		if(rooms[i].clubname!=undefined){
			var days = rooms[i].clubday.split("-");
			jq('#club_idx').append('<li class="list_box" onclick=selectItem('+rooms[i].clubidx +')>'
					+ '<div class="img_box">' + '<img src='+rooms[i].img + '/>'+'</div>'
					+ '<div class="title">' + rooms[i].clubname + '</div>'
					+ '<div class="memo">' + rooms[i].memo + '</div>'
					+ '<div class="location">' + rooms[i].location + '</div>'
					+ '<div class="month">' + days[1] + '</div>'
					+ '<div class="day">' + days[2] + '</div>'
					+ '</li>');
		}
		
	}
});

pageObj.sendchat = function(messages){
	socket.emit('sendchat', messages);
};

pageObj.mLoadRooms = function(messages){
	socket.emit('getRooms', messages);
};