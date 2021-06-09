function joinRoom(roomName) {
  nsSocket.emit("joinRoom", roomName, function (newNumberOfMembers) {
    document.querySelector(
      ".curr-room-num-users"
    ).innerHTML = `${newNumberOfMembers} <i class="fa fa-user" aria-hidden="true"></i>`;
  });

  nsSocket.on("historyCatchUp", function (history) {
    const messagesUl = document.querySelector("#messages");
    messagesUl.innerHTML = "";
    history.forEach(function (msg) {
      const newMessage = buildHTML(msg);
      const currentMessage = messagesUl.innerHTML;
      messagesUl.innerHTML = currentMessage + newMessage;
    });
    messagesUl.scrollTo(0, messagesUl.scrollHeight);
  });
  nsSocket.on("updateMembers", function (numMembers) {
    document.querySelector(
      ".curr-room-num-users"
    ).innerHTML = `${numMembers} <i class="fa fa-user" aria-hidden="true"></i>\ `;
    document.querySelector(".curr-room-text").innerText = `${roomName}`;
  });

  let searchBox = document.querySelector("#search-box");
  searchBox.addEventListener("input", function (e) {
    let messages = Array.from(
      document.getElementsByClassName("message-wrapper")
    );
    messages.forEach(function (msg) {
      if (
        msg.innerText.toLowerCase().indexOf(e.target.value.toLowerCase()) === -1
      ) {
        msg.style.display = "none";
      } else {
        msg.style.display = "flex";
      }
    });
  });
}
