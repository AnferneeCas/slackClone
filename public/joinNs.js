function joinNs(endpoint){


const nsSocket = io(`http://localhost:3000/${endpoint}`);

nsSocket.on('nsRoomLoad',function(nsRooms){
    console.log(nsRooms);
    let roomList = document.querySelector(".room-list");
    roomList.innerHTML="";
    nsRooms.forEach((room)=>{
        let glyph;
        if(room.privateRoom){
            glyph='lock'
        }
        else{
            glyph= 'globe'  
        }
        roomList.innerHTML +=`<li class="room" > <span class="glyphicon glyphicon-${glyph}"></span>${room.roomtitle}</li>`
    });
    let roomNodes= document.getElementsByClassName('room');
    Array.from(roomNodes).forEach((room)=>{
        room.addEventListener('click',(e)=>{
            
        });
    })
});


nsSocket.on('messageToClients',function(msg){
    console.log(msg);
    document.querySelector('#messages').innerHTML +=`<li> ${msg.text}</li>`
});


document.querySelector('.message-form').addEventListener('submit',function(event){
    event.preventDefault();
    const newMessage= document.querySelector('#user-message').value;
    socket.emit('newMessageToServer',{text:newMessage});
});
}