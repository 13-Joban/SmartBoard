const express = require('express');
const socket = require('socket.io');

const port=process.env.PORT || 3000;


 const app = express();  // initilize and server ready

 
 app.use(express.static("public"));

 const server = app.listen(port,() =>{
    console.log("port is listening at "+ port);
});

const io = socket(server);



//  connecting socket with server

io.on("connection",(socket) => {
    console.log("connection successful")
    // data received on the server

        socket.on('beginPath', (data)  => {
            // data represents data from frontEnd

            // now transfer data to all the computers

            io.sockets.emit('beginPath', data);

                
        });

        socket.on('Fillpath', (data) => {

            io.sockets.emit('Fillpath', data);
        });

        socket.on('undoredo', (data) => {

            io.sockets.emit('undoredo', data);

        });

});


