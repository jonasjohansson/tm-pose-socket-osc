const WebSocket = require("ws");
const osc = require("osc");

/* CREATE SOCKET SERVER */
const wss = new WebSocket.Server({ port: 8080 });

/* CREATE OSC SERVER */
var udpPort = new osc.UDPPort({
  localAddress: "0.0.0.0",
  remoteAddress: "0.0.0.0",
  localPort: 7000,
  remotePort: 7001, // change this for TouchDesigner
  broadcast: true
});

udpPort.open();

wss.on("connection", ws => {
  ws.on("message", message => {
    message = JSON.parse(message);
    if (message.length > 0) {
      for (let kpt of message[0].pose.keypoints) {
        var pth = "/poses/" + kpt.part + "/";
        sendOsc(pth + "x", kpt.position.x);
        sendOsc(pth + "y", kpt.position.y);
        sendOsc(pth + "score", kpt.score);
      }
    }
  });
});

function sendOsc(addr, val) {
  val = Number(val);
  val = Math.round(val);
  udpPort.send({
    address: addr,
    args: [
      {
        type: "i",
        value: val
      }
    ]
  });
}
