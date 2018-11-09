const output = document.getElementById('app');
const url = "wss://echo.websocket.org/";

const onOpen = (e) => {
  writeToScreen("CONNECTED");
  doSend('Hello from WebSocket!');
}

const onClose = (e) => {
  writeToScreen('DISCONNECTED');
}

const onMessage = (e) => {
  writeToScreen('<span style="color: blue;">RESPONSE: ' + e.data+'</span>');
  websocket.close();
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

document.addEventListener('load', init(url), false);