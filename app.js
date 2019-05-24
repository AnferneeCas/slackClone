const express= require("express");
const app = express();
const socketio = require('socket.io');

let namespaces = require("./data/namespaces")


app.use(express.static(__dirname+'/public'));

const expressServer = app.listen(3000);
const io=socketio(expressServer);

io.on('connection',function(socket){
	let nsData = namespaces.map((ns)=>{
		return {
			img: ns.img,
			endpoint: ns.endpoint
		};
	})
	
	socket.emit('nslist',nsData);
});

namespaces.forEach((namespace)=>{
	io.of(namespace.endpoint).on('connection',function(nsSocket){
		console.log(`${nsSocket.id}`+ " has join "+ `${namespace.endpoint}`);
		nsSocket.emit("nsRoomLoad",namespace.rooms);
		
		nsSocket.on('joinRoom',function(roomToJoin,numberOfUsersCallback){
			const roomToLeave = Object.keys(nsSocket.rooms)[1];
			
			
			nsSocket.leave(roomToLeave);
			updateUsersInRoom(namespace,roomToLeave);
			nsSocket.join(roomToJoin);
			
			//console.log(nsSocket.rooms);
			console.log(roomToJoin);
			io.of(namespace.endpoint).in(roomToJoin).clients(function(error,clients){
				numberOfUsersCallback(clients.length);
			});

			var nsRoom = namespace.rooms.find(function(room){
				return room.roomtitle===roomToJoin;
			})
			
			nsSocket.emit('historyCatchUp',nsRoom.history);
			updateUsersInRoom(namespace,roomToJoin);

			nsSocket.on('disconnect',function(){
				io.of(namespace.endpoint).in(roomToJoin).clients(function(error,clients){
					io.of(namespace.endpoint).in(roomToJoin).emit('updateMembers',clients.length);
				});
			})
		});
		nsSocket.on('newMessageToServer',function(msg){
			const fullMsg ={
				text:msg.text,
				time:Date.now(),
				username:"rbunch",
				avatar:'https://via.placeholder.com/30'
			};
			const roomTitle = Object.keys(nsSocket.rooms)[1];
			
			var nsRoom = namespace.rooms.find(function(room){
				return room.roomtitle===roomTitle;
			})
			console.log(nsRoom);
			nsRoom.addMessage(fullMsg);
			io.of(namespace.endpoint).to(roomTitle).emit('messageToClients',fullMsg);
		});
		
	});
})

function updateUsersInRoom(namespace, roomToJoin){
	io.of(namespace.endpoint).in(roomToJoin).clients(function(error,clients){
		io.of(namespace.endpoint).in(roomToJoin).emit('updateMembers',clients.length);
	});
}