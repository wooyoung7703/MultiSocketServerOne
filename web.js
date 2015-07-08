//var app = require('express').createServer()
//var io = require('socket.io').listen(app);
var express = require('express'); 
//var datas = require('./public/devdata.js');
//var app = express();
//app.use(express.static(__dirname + '/public'));
//var usernames = {};
//var rooms = ['room1','room2','room3'];
//var server = datas.server();
//var io = require('socket.io').listen(server);
//var Logger  = require(__dirname + "/lib/Logger");
//global.log  = new Logger(__dirname + "/logs/debug.log");
//global.loge = new Logger(__dirname + "/logs/exception.log");
//
//io.sockets.on('connection', function (socket) {
//
//	/*
//	 * 채팅 관련 소켓
//	 */
//	socket.on('adduser', function(username){
//		log.info('user name : '+username);
//		socket.username = username;
//		socket.room = 'room1';
//		usernames[username] = username;
//		socket.join('room1');
//		socket.emit('updatechat', 'SERVER', 'you have connected to room1');
//		socket.broadcast.to('room1').emit('updatechat', 'SERVER', username + ' has connected to this room');
//		socket.emit('updaterooms', rooms, 'room1');
//		log.info('user rooms : '+rooms);
//	});
//
//	socket.on('sendchat', function (data) {
//		log.info('*****************************************************************************');
//		log.info('socket_room : '+socket.room);
//		log.info('socket_username : '+socket.username);
//		log.info('socket_data : '+data);
//		log.info('*****************************************************************************');
//		io.sockets["in"](socket.room).emit('updatechat', socket.username, data);
//	});
//
//	socket.on('switchRoom', function(newroom){
//		log.info('*****************************************************************************');
//		log.info('socket_newroom : '+newroom);
//		log.info('*****************************************************************************');
//		socket.leave(socket.room);
//		socket.join(newroom);
//		socket.emit('updatechat', 'SERVER', 'you have connected to '+ newroom);
//		socket.broadcast.to(socket.room).emit('updatechat', 'SERVER', socket.username+' has left this room');
//		socket.room = newroom;
//		socket.broadcast.to(newroom).emit('updatechat', 'SERVER', socket.username+' has joined this room');
//		socket.emit('updaterooms', rooms, newroom);
//	});
//
//	socket.on('disconnect', function(){
//		delete usernames[socket.username];
//		io.sockets.emit('updateusers', usernames);
//		socket.broadcast.emit('updatechat', 'SERVER', socket.username + ' has disconnected');
//		socket.leave(socket.room);
//	});
//	
//	/*
//	 * Common 관련 소켓
//	 */
//	//uuid생성
//	socket.on('getUUID', function(){
//		var uuid = datas.createGenerateUUID();
//		log.info('user uuid : '+uuid);
//		socket.emit('getUUID', 'SERVER', uuid);
//	});
//	socket.on('getRooms', function(aaaaa){
//		var aaaaa = {
//				"clubname" : "가톨릭 청년들의 문화생활모임",
//				"clubidx" : "000000001",
//				"memo" : "대망의 첫모임 떠나자 길바닥으로.",
//				"location" : "강남",
//				"clubday" : "15-12-15",
//				"img" : "images/club_s/aaaaa.png"
//			};
//		var bbbbb = {
//				"clubname" : "명동불닭",
//				"clubidx" : "23232323233",
//				"memo" : "6월30일 GOGO!!!",
//				"location" : "명동",
//				"clubday" : "15-11-10",
//				"img" : "images/club_s/bbbbb.png"
//			};
//		var ccccc = {
//				"clubname" : "명동불닭",
//				"clubidx" : "23232323233",
//				"memo" : "6월30일 GOGO!!!",
//				"location" : "명동",
//				"clubday" : "15-10-30",
//				"img" : "images/club_s/ccccc.png"
//			};
//		var ddddd = {
//				"clubname" : "명동불닭",
//				"clubidx" : "23232323233",
//				"memo" : "6월30일 GOGO!!!",
//				"location" : "명동",
//				"clubday" : "15-9-1",
//				"img" : "images/club_s/ddddd.png"
//			};
//		var total = [aaaaa,bbbbb,ccccc,ddddd];
//		socket.emit('updaterooms', total, 'room1');
//	});
//	//deviceinfo 정보요청
//	socket.on('getDeviceInfo', function(user_uuid){
//		var mDeviceinfo = "";
//		log.info('user mDeviceinfo : '+mDeviceinfo);
//		socket.emit('getDeviceInfo', 'SERVER', mDeviceinfo);
//	});
//	//device token 저장
//	socket.on('setDeviceToken', function(user_data){
//		var mDeviceUuid = user_data.uuid;
//		var mDeviceToken = user_data.devicetoken;
//		log.info('user mDeviceUuid : '+mDeviceUuid);
//		log.info('user mDeviceToken : '+mDeviceToken);
//		socket.emit('setDeviceToken', 'SERVER', mDeviceinfo);
//	});
//	
//
//});
//
