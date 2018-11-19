const express = require('express');
const http = require('http');
const WebSocket = require('ws');

//initializing HTTP server
const app = express();
const server = http.createServer(app);

//initializing WebSocket Server instance
const wss = new WebSocket.Server({ server });

//helper variables
let history = [];
const htmlEntities = (str) => {
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
const colors = [ 'red', 'green', 'blue', 'magenta', 'purple', 'plum', 'orange' ];

//accepting WS connection
wss.on('connection', (ws, req) => {
    const ip = req.connection.remoteAddress;
    let userName = false;
    let userColor = false;

    if (history.length > 0) {
        ws.send(JSON.stringify({ type: 'history', data: history} ));
    }

    //connection is up
    ws.on('message', (message) => {
        if (userName === false) { // first message sent by user is their name
            // remember user name
            userName = message;
            // get random color and send it back to the user
            userColor = colors.shift();
            ws.send(JSON.stringify({ type:'color', data: userColor }));
            console.log((new Date()) + ' User is known as: ' + userName
                        + ' with ' + userColor + ' color.');

        } else { // log and broadcast the message
            console.log((new Date()) + ' Received Message from '
                        + userName + ': ' + message);
            
            // we want to keep history of all sent messages
            const obj = {
                time: (new Date()).getTime(),
                text: htmlEntities(message),
                author: userName,
                color: userColor
            };
            history.push(obj);
            history = history.slice(-100);

            // broadcast message to all connected clients
            const json = JSON.stringify({ type:'message', data: obj });
            wss.clients.forEach(client => {
                client.send(json);
            });
        }
    });

    ws.on('close', (ip) => {
        if (userName !== false && userColor !== false) {
          console.log((new Date()) + " Peer "
              + ip + " disconnected.");
          // push back user's color to be reused by another user
          colors.push(userColor);
        }
      });

});

//start our server
server.listen(process.env.PORT || 8999, () => {
    console.log(`Server started on port ${server.address().port} :)`);
});