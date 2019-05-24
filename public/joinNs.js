function joinNs(endpoint){
if(nsSocket){
    nsSocket.close();
    console.log('socket closed');
    //remove eventLIstener befor its added again
    document.querySelector('#user-input').removeEventListener('submit',formSubmission);
}

 nsSocket = io(`http://localhost:3000${endpoint}`);

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
            joinRoom(e.target.innerText);
        });
    })
    const topRoom = document.querySelector('.room');
    const topRoomName= topRoom.innerText;
    joinRoom(topRoomName);
});


nsSocket.on('messageToClients',function(msg){
    console.log(msg);
    const newMsg = buildHTML(msg);
    document.querySelector('#messages').innerHTML +=newMsg;
   
});


document.querySelector('.message-form').addEventListener('submit',formSubmission);
}

function formSubmission(event){
    event.preventDefault();
    const newMessage= document.querySelector('#user-message').value;
    nsSocket.emit('newMessageToServer',{text:newMessage});
};

function buildHTML(msg){
    const convertedDate = new Date(msg.time).toLocaleDateString();
   const newHTML= `
   <li>
   <div class="user-image">
   <img src="https://via.placeholder.com/30" />
</div>
<div class="user-message">
   <div class="user-name-time">${msg.username} <span>${convertedDate}</span></div>
   <div class="message-text">${msg.text}</div>
</div>  </li>` 
return newHTML;
}