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
		nsSocket.emit("nsRoomLoad",namespaces[0].rooms);
	});
})
