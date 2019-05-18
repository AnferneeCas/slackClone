class Room{
    constructor(roomid,roomtitle,namespace,privateRoom=false){
        this.roomid=roomid;
        this.roomtitle=roomtitle;
        this.namespace= namespace;
        this.history =[];
    }
    addMessage(message){
        this.history.push(message);
    }
    clearHistory(){
        this.history=[];
    }
}

module.exports = Room;