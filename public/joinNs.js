function joinNs(endpoint){
if(nsSocket){
    nsSocket.close();

    //remove eventLIstener befor its added again
    document.querySelector('#user-input').removeEventListener('submit',formSubmission);
}

 nsSocket = io(`http://10.0.0.103:3000/${endpoint}`,{ query:{
    username
}});

nsSocket.on('nsRoomLoad',function(nsRooms){

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

    const newMsg = buildHTML(msg);
    document.querySelector('#messages').innerHTML +=newMsg;
   
});


document.querySelector('.message-form').addEventListener('submit',formSubmission);
}

function formSubmission(event){
    event.preventDefault();
    var input = document.querySelector('#user-message-input');
    const newMessage= input.value;
    nsSocket.emit('newMessageToServer',{text:newMessage});
    input.value='';

    const messagesUl = document.querySelector('#messages');

    // history.forEach(function(msg){
    //     const newMessage = buildHTML(msg);
    //     const currentMessage = messagesUl.innerHTML;
    //     messagesUl.innerHTML = currentMessage+newMessage;
    // });
    messagesUl.scrollTo(0,messagesUl.scrollHeight);
};

function buildHTML(msg){
    const convertedDate = new Date(msg.time).toLocaleDateString();
   const newHTML= `
   <li class="message-wrapper">
   <div class="user-image" >
   <img style="width:30px; height:30px" src="https://www.automotiveone.com/wp-content/uploads/2019/02/placeholder-user-image.jpg" />
</div>
<div class="user-message">
   <div class="user-name-time">${msg.username} <span>${convertedDate}</span></div>
   <div class="message-text">${msg.text}</div>
</div>  </li>` 
return newHTML;
}