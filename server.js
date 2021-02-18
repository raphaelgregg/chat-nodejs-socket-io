// para mostrar aquivo estatico para rota
const express = require('express');
// path padrão do node, noa precisa ser instalada
const path = require('path');

// criar app pelo express;
const app = express();
//informar porta para o app a porta sera acessada pelo socket no protocolo http
const server = require('http').createServer(app);
// protocolo wss para o socket
const io = require('socket.io')(server);

// Definir pasta de arquivos public acessados pela aplicação
app.use(express.static(path.join(__dirname, 'public')));

//configurações para usar views como html , que como padrao o node utiliza o EJS
app.set('views', path.join(__dirname, 'public'));

// defini engine como html, comum quando node precisa usar o html
app.engine('html', require('ejs').renderFile);

// tudo pronto para utilizar html para views
app.set('view engine', 'html');


// acesso endereço do rervidor padrão, redenrizar view index.html 
app.use('/', (request, response) => {
    response.render('index.html');
});

let messages = [];

// Ouvir a porta 3000
io.on("connection", socket => {
    console.log(`Socket conectado: ${socket.id}`);

    socket.emit('previousMessage', messages);

    socket.on('sendMessage', data => {
        // console.log(data);
        messages.push(data);
        socket.broadcast.emit("receivedMessage", data);
        //socket tem tres metodos "on" para ouvir msgs, "emit" para enviar msgs e o "broadcast que envia para todos os sockets conectados"
    });
});

// Ouvir a porta 3000
server.listen(3000, () => {
    console.log('server started on port 3000!')
});


