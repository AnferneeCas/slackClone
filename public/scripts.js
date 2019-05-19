const socket = io("http://localhost:3000");

socket.on('nslist',function(nsData){
    let namespacesDiv = document.querySelector('.namespaces');
    namespacesDiv.innerHTML ="";
    nsData.forEach((ns) => {
        namespacesDiv.innerHTML +=`<div class="namespace" ns=${ns.endpoint}><img src="${ns.img}" /></div>`
    });

    console.log(document.querySelectorAll('.namespace'));
   Array.from(document.getElementsByClassName('namespace')).forEach((elem)=>{
        elem.addEventListener('click',function(e){
            const nsEndpoint = elem.getAttribute('ns');
            console.log(``);
        });
    });
    joinNs("mozilla");
});

