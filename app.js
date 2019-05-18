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
});

io.of('/admin').on('connection',function(socket){
	console.log("SOmeone connected to the admin anesmapce;")
	io.of('/admin').emit('welcome',"welcome to the admin channel")
});