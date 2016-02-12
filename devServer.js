var webpack = require('webpack');
var webpackDevMiddleware = require('webpack-dev-middleware');
var webpackHotMiddleware = require('webpack-hot-middleware');
var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var config = require('./webpack.config');
var toId = require('./toId');
var parse = require('./parse');

var port = process.env.PORT || 3000;

var compiler = webpack(config);
app.use(webpackDevMiddleware(compiler, { noInfo: true, publicPath: config.output.publicPath }));
app.use(webpackHotMiddleware(compiler));

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/index.html');
});

var users = {};
var history = [];

io.on('connection', function(socket){
  console.log('a user connected');

  socket.emit('chat history', {users: Object.keys(users).map(userid => users[userid].username), history: history});

  socket.on('chat message', function(data) {
    if (typeof data === 'object') {
        const markup = {__html: parse(data.message)};
        data = {username: data.username, message: markup};
    }
    history.push(data);
    io.emit('chat message', data);
  });

  socket.on('add user', function(username) {
    const userid = toId(username);
    if (!userid || userid.length > 15) return;
    if (socket.user && username !== socket.user.username && userid === socket.user.userid) {
      users[userid] = {userid: userid, username: username, ip: socket.handshake.address};
      socket.user = users[userid];
      io.emit('update users', Object.keys(users).map(userid => users[userid].username));
      return;
    }
    if (users[userid]) return;
    if (socket.user && socket.user.userid) {
      delete users[socket.user.userid];
    }
    users[userid] = {userid: userid, username: username, ip: socket.handshake.address};
    socket.user = users[userid];
    io.emit('update users', Object.keys(users).map(userid => users[userid].username));
  });

  socket.on('disconnect', function() {
    if (socket.user) delete users[socket.user.userid];
    io.emit('update users', Object.keys(users).map(userid => users[userid].username));
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
