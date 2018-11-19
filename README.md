# websocket-chat
This is a basic full stack app, working as a chat room. It is made up of a WebSocket server, powered by Node.js and the **ws** library and a client part, that takes advantage of the WebSocket API.

## Getting started
To get a working copy of the project, first clone the repository to your local machine:

```bash
git clone git@github.com:mbertozzo/websocket-chat.git your-local-folder
```

Then install dependencies with

```bash
$ yarn
```

You can start the Node.js WebSocket server and the Webpack devServer with

```bash
$ yarn dev
```

You will then have the WebSocket server running at `http://localhost:8999` and the Webpack devServer running at `http://localhost:3000`.

Alternatively, you can run the two servers separately with the following commands, respectively `$ yarn client` for the Webpack devServer and `$ yarn server` for the Node.js WebSocket server.

You can get a deploy-ready `dist` folder for the client part running 

```bash
$ yarn build
```

Finally, if you want to build the client part to the `dist` folder **and** start the WebSocket server at `http://localhost:8999`, just type

```bash
$ yarn start
```

## What does this app do?
After having started the WebSocket server and launched the client interface, you'll get a chat room. Users will have the chance to choose a name for the session and send messages that will be broadcasted almost instantly to each connected client, thanks to the websocket protocol. To appreciate the feature, you can connect to the app from two different devices (or open it in two different browsers or tabs) and try to send some messages.

## Credits
Thanks to **Martin Sikora** for the tutorial that inspired this experiment.