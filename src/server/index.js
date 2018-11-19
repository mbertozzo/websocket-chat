var express = require('express');
var http = require('http');
var WebSocket = require('ws');

//initializign HTTP server
var app = express();
var server = http.createServer(app);

//initializing WebSocket Server instance
var wss = new WebSocket.Server({ server });

//helper variables
var history = [];
var htmlEntities = (str) => {
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
var colors = [ 'red', 'green', 'blue', 'magenta', 'purple', 'plum', 'orange' ];
colors.sort((a,b) => { return Math.random() > 0.5; } );

//accepting WS connection
wss.on('connection', (ws, req) => {
    const ip = req.connection.remoteAddress;
    var userName = false;
    var userColor = false;

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
            var obj = {
                time: (new Date()).getTime(),
                text: htmlEntities(message),
                author: userName,
                color: userColor
            };
            history.push(obj);
            history = history.slice(-100);

            // broadcast message to all connected clients
            var json = JSON.stringify({ type:'message', data: obj });
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