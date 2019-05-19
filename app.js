const express= require("express");
const app = express();
const socketio = require('socket.io');

let namespaces = require("./data/namespaces")


app.use(express.static(__dirname+'/public'));

const expressServer = app.listen(3000);
const io=socketio(expressServer);




io.on('connection',function(socket){
	socket.emit('messageFromServer',{data:'Welcome to the socketio server'});
	socket.on('messageToServer',function(dataFromClient){
		console.log(dataFromClient);
	})
});

namespaces.forEach((namespace)=>{
	io.of(namespace.endpoint).on('connection',function(socket){
		console.log(`${socket.id}`+ " has join "+ `${namespace.endpoint}`);
	});
})
