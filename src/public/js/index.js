const socket = io();
let userMail;
let chatBox = document.getElementById("chatBox");

Swal.fire({
  title: "Identifícate",
  input: "text",
  text: "Ingresa tu mail para identificarte en el chat",
  inputValidator: (value) => {
    return !value && "¡Escribe tu mail para continuar!"
  },
  allowOutsideClick: false
}).then(result =>{
  userMail= result.value
  socket.emit("connectionMail", userMail)
});

chatBox.addEventListener('keyup',evt=>{
  if(evt.key==="Enter"){
    if(chatBox.value.trim().length>0){
      socket.emit("message",{userMail: userMail, message: chatBox.value});
      chatBox.value = "";
    }
  }
})

socket.on('previousMessages', data=>{
  let log = document.getElementById('messageLogs');
  let messages = "";
  data.forEach(message => {
    messages = messages + `${message.userMail} dice ${message.message}</br>`
  });
  log.innerHTML = messages  
})

socket.on('messageLogs', data=>{
  let log = document.getElementById('messageLogs');
  let messages = "";
  data.forEach(message => {
    messages = messages + `${message.userMail} dice ${message.message}</br>`
  });
  log.innerHTML = messages  
})

socket.on('newUser', (data) =>{
  Swal.fire({
    text: `${data} se ha conectado`,
    toast: true,
    position: "top-right"
  })
})