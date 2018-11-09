const output = document.getElementById('app');
const btnConnect = document.getElementById('connect');
const btnDisconnect = document.getElementById('disconnect');
const sendMsg = document.getElementById('send');
let websocket = null;

// const url = "wss://echo.websocket.org/";

const onOpen = (e) => {
  writeToScreen("CONNECTED");
}

const onClose = (e) => {
  writeToScreen('DISCONNECTED');
}

const onMessage = (e) => {
  writeToScreen('<span style="color: blue;">RESPONSE: ' + e.data+'</span>');
}

const onError = (e) => {
  writeToScreen('<span style="color: red;">ERROR:</span> ' + e.data);
}

const doSend = (msg) => {
  writeToScreen(msg);
  websocket.send(msg);
}

const writeToScreen = (msg) => {
  let pre = document.createElement("p");
  pre.style.wordWrap = "break-word";
  pre.innerHTML = msg;
  output.appendChild(pre);
}

const init = (wsUri) => {
  websocket = new WebSocket(wsUri)
  websocket.onopen = (evt) => onOpen(evt);
  websocket.onclose = (evt) => onClose(evt);
  websocket.onmessage = (evt) => onMessage(evt);
  websocket.onerror = (evt) => onError(evt);
}

btnConnect.addEventListener('click', () => {
  const url = document.getElementById('url').value;
  init(url)
});

btnDisconnect.addEventListener('click', () => {
  websocket.close();
})

sendMsg.addEventListener('click', () => {
  const message = document.getElementById('message').value;
  console.log('Aloha from send')
  console.log(message);
  doSend(message);
})

