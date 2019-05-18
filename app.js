const express= require("express");
const app = express();
const socketio = require('socket.io');
app.use(express.static(__dirname+'/public'));



const expressServer = app.listen(3000);
const io=socketio(expressServer);

io.on('connection',function(socket){
	socket.emit('messageFromServer',{data:'Welcome to the socketio server'});
	socket.on('messageToServer',function(dataFromClient){
		console.log(dataFromClient);
	})

	socket.on('newMessageToServer',function(msg){
		io.emit('messageToClients',{text:msg.text});
	});
});