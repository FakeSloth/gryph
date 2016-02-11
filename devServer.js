var webpack = require('webpack');
var webpackDevMiddleware = require('webpack-dev-middleware');
var webpackHotMiddleware = require('webpack-hot-middleware');
var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var config = require('./webpack.config');

var port = process.env.PORT || 3000;

var compiler = webpack(config);
app.use(webpackDevMiddleware(compiler, { noInfo: true, publicPath: config.output.publicPath }));
app.use(webpackHotMiddleware(compiler));

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/index.html');
});

var users = {};

io.on('connection', function(socket){
  console.log('a user connected');

  socket.on('chat message', function(message) {
    io.emit('chat message', message);
  });

  socket.on('add user', function(username) {
    if (users[username]) return;
    if (socket.username) {
      delete users[socket.username];
    }
    socket.username = username;
    users[username] = {username: username, ip: socket.handshake.address};
    io.emit('update users', Object.keys(users));
  });

  socket.on('disconnect', function() {
    delete users[socket.username];
    io.emit('update users', Object.keys(users));
    console.log('user disconnected');
  });
});

server.listen(port, function(error) {
  if (error) {
    console.error(error);
  } else {
    console.info('==> Listening on port %s. Open up http://localhost:%s/ in your browser.', port, port);
  }
});
