/**
 * Created by Emanuelpinho on 15/10/14.
 */

var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var handleClient = function (socket) {

    socket.emit("tweet", {user: "nodesource", text: "Hello, world!"});
};

io.on("connection", handleClient);

server.listen(8080);

module.exports = new SocketController();
