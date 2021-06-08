const username = prompt("Type in your username");
const socket = io("http://10.0.0.103:3000",{
    query:{
        username
    }
});



let nsSocket="";
socket.on('nslist',function(nsData){
    let namespacesDiv = document.querySelector('.namespaces');
    namespacesDiv.innerHTML ="";
    nsData.forEach((ns) => {
        namespacesDiv.innerHTML +=`<div class="namespace" ns=${ns.endpoint}><img src="${ns.img}" /></div>`
    });

   Array.from(document.getElementsByClassName('namespace')).forEach((elem)=>{
        elem.addEventListener('click',function(e){
            const nsEndpoint = elem.getAttribute('ns');
            joinNs(nsEndpoint);
        });
    });
   joinNs('/wiki');
});

