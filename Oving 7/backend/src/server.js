'use strict';

const net = require('net');

// Simple HTTP server responds with a simple WebSocket client test
const httpServer = net.createServer(connection => {
  connection.on('data', () => {
    let content = `<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
  </head>
  <body>
    WebSocket test page <br/>
    <h2 id="msgFromServer">sdf</h2> <br/>
    <input type="text" placeholder="Your name..." id="nameInp" />
    <input type="text" placeholder="Your message..." id="msgToServer" />
    <button id="btn" onclick="sendMsg()">Submit </button>
    <hr>
    <h2>Messages sent: </h2> <br />
    <p id="msg"> </p>
    <script>
      let ws = new WebSocket('ws://localhost:3001');
      let messageDisplay = "";

      ws.onmessage = event => {
        let data = JSON.parse(event.data);                                        //Parsing the message to an JSON-object
        let name = data["name"];
        let msg = data["msg"];
        let newLine = '<b>' + name + '</b> ' + msg +  "</br>";                    //Creats the new line to display
        messageDisplay += newLine;
        document.getElementById("msg").innerHTML = messageDisplay;
      }

      let sendMsg = () => {
        let msg = document.getElementById("msgToServer").value;
        let name = document.getElementById("nameInp").value;
        if (msg === "" || msg === undefined) {
          alert("Both name and message must be filled out");
        } else {
          if (name === "" || name === undefined) {
            name = "Anonymous duck";
          }
          let json_msg = {
            "name": name,
            "msg" : msg
          };
          messageDisplay += '<b>' + name + ':</b>' + msg + "</br>";
          document.getElementById("msg").innerHTML = messageDisplay;
          ws.send(JSON.stringify(json_msg));
          document.getElementById("msgToServer").value = "";
        }
      }

    </script>
  </body>
</html>
`;
    connection.write('HTTP/1.1 200 OK\r\nContent-Length: ' + content.length + '\r\n\r\n' + content);  //Sends the header
  });
});
httpServer.listen(3000, () => {
  console.log('HTTP server listening on port 3000');
});

const createHandshake = (data) => {                                                     //Method to create the handshake
    let resp = data.toString();
    let arr = resp.split("\n");
    let line = arr[11].split(" ");
    let key = line[1].slice(0,-1);
    let sec = key + '258EAFA5-E914-47DA-95CA-C5AB0DC85B11';
    let hash = require('crypto').createHash('SHA1').update(sec).digest('base64');
    //let handshake = "HTTP/1.1 101 Web Socket Protocol Handshake\r\n" + "Upgrade: WebSocket\r\n" + "Connection: Upgrade\r\n" + "Sec-WebSocket-Accept: " + hash + "\r\n" + "\r\n";
    let handshake = "HTTP/1.1 101 Switching Protocols\r\n" + "Upgrade: websocket\r\n" + "Connection: Upgrade\r\n" + "Sec-WebSocket-Accept: " + hash + "\r\n" + "\r\n";
    return handshake;
}

function dec2hexString(dec) {                                                           //Converts decimal number to hex(string)
   return '0x' + (dec+0x10000).toString(16).substr(-4).toUpperCase();
}

const connectedClients = new Set();                                                     //Set to keep track of all connected clients

const createMsg = (msg) => {
  let buf1 = new Buffer([0x81]);                                                        //Specifies that we are sending a string
  let length = msg.length;
  let buf2 = new Buffer([dec2hexString(length)]);                                       //Specifies the lenght of the msg
  let buf3 = Buffer.from(msg);                                                          //The message itself
  return Buffer.concat([buf1, buf2,buf3]);
}

connectedClients.broadcast = function(data, except) {                                   //Sends a message to all clients, except the one who sent it
  for (let sock of this) {
    if (sock !== except) {
      sock.write(createMsg(data));
    }
  }
}
const wsServer = net.createServer(connection => {
  console.log('Client connected');

  connection.on('data', data => {
    if (!(connectedClients.has(connection))) {                                      //If conn is not in Set; send handshake
      console.log("Not connected yet. Sending handshake");
      let handshake = createHandshake(data);
      connection.write(handshake);
      connectedClients.add(connection);
    } else {                                                                        //Is connected, read the msg
      let bytes = Buffer.from(data);
      let length = bytes[1] & 127;
      let maskStart = 2;
      let dataStart = maskStart + 4;
      let msg = "";
      for (let i = dataStart; i < dataStart + length; i++) {
        let byte = bytes[i] ^ bytes[maskStart + ((i - dataStart) % 4)];
        msg += String.fromCharCode(byte);
      }
      connectedClients.broadcast(msg, connection);                                  //Sends the message to all other clients
    }
  })



  connection.on('end', () => {
    console.log('Client disconnected');
    connectedClients.delete(connection);
  });
});
wsServer.on('error', error => {
  console.error('Error: ', error);
});
wsServer.listen(3001, () => {
  console.log('WebSocket server listening on port 3001');});
