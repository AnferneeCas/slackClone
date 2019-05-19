class Namespace{
    constructor(id,nstitle,img,endpoint){
        this.id= id;
        this.img= img;
        this.nstitle= nstitle;
        this.endpoint= endpoint;
        this.rooms = [];
    }

    addRoom(roomObj){
        this.rooms.push(roomObj);
    }
}

module.exports = Namespace;