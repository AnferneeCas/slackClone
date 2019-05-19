const socket = io("http://localhost:3000");
const socket2= io("http://localhost:3000/wiki");
const socket3= io("http://localhost:3000/mozilla");
const socket4= io("http://localhost:3000/linux");


socket.on("messageFromServer",function(dataFromServer){
    console.log(dataFromServer);
    socket.emit('dataToServer',{data:"Data from the CLient"});

});

socket2.on('welcome',function(dataFromServer){
    console.log(dataFromServer);
});

document.querySelector('#message-form').addEventListener('submit',function(event){
    event.preventDefault();
    const newMessage= document.querySelector('#user-message').value;
    socket.emit('newMessageToServer',{text:newMessage});
});
