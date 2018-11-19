const content = document.getElementById('content');
const input = document.getElementById('input');
const status = document.getElementById('status');
let websocket = null;

let myColor = false;
let myName = false;

let json = null;

if(!window.WebSocket) {
  content.innerHTML = `Sorry, your browser doesn't support WebSocket.`;
}

const ws = new WebSocket('ws://localhost:8999');

ws.onopen = (e) => {
  input.removeAttribute('disabled');
  status.innerHTML = 'Choose name:';
}

ws.onerror = (e) => {
  const text = document.createElement('p');
  const innerNode = document.createTextNode(`Sorry, there's a problem with your connection or the server is down.`);
  
  text.appendChild(innerNode);
  content.appendChild(text);
}

ws.onmessage = (e) => {
  try {
    json = JSON.parse(e.data);
  } catch (e) {
    console.log('Invalid JSON: ', e.data);
    return;
  }

  if(json.type === 'color'){
    myColor = json.data;
    status.innerHTML = (myName + ': ');
    status.style.color= myColor;
    input.focus();
  } else if (json.type === 'history'){
    json.data.map(msg => {
      addMessage(msg.author, msg.text,
        msg.color, new Date(msg.time));
    })
  } else if(json.type === 'message'){
      addMessage(json.data.author, json.data.text,
        json.data.color, new Date(json.data.time));
  } else {
    console.log('Provided JSON not recognised', json);
  }
}

ws.onClose = (e) => {
  content.innerHTML = 'Closed';
}

input.addEventListener('keydown', (e) => {
  if (e.keyCode === 13) {
    var msg = e.target.value;
    if (!msg) {
        return;
    }
    // send the message as an ordinary text and reset input value
    ws.send(msg);
    e.target.value = '';

    // the first message sent from a user is his name
    if (myName === false) {
        myName = msg;
    }
  }
});

const addMessage = (author, message, color, dt) => {
  const msgParagraph = document.createElement('p');
  const authorSpan = document.createElement('span');
  const authorNode = document.createTextNode(author);
  const msgContent = document.createTextNode(' @ ' 
    + (dt.getHours() < 10 ? '0'
    + dt.getHours() : dt.getHours()) + ':'
    + (dt.getMinutes() < 10
      ? '0' + dt.getMinutes() : dt.getMinutes())
    + ': ' + message
  );

  authorSpan.appendChild(authorNode);
  authorSpan.style.color = color;

  msgParagraph.appendChild(authorSpan);
  msgParagraph.appendChild(msgContent);

  content.prepend(msgParagraph);
}