var webpack = require('webpack');
var webpackDevMiddleware = require('webpack-dev-middleware');
var webpackHotMiddleware = require('webpack-hot-middleware');
var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var config = require('./webpack.config');
var toId = require('./toId');
var parse = require('./parse');
var Deque = require("double-ended-queue");
var got = require('got');
var moment = require('moment');

var port = process.env.PORT || 3000;

var compiler = webpack(config);
app.use(webpackDevMiddleware(compiler, { noInfo: true, publicPath: config.output.publicPath }));
app.use(webpackHotMiddleware(compiler));

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/index.html');
});

var users = {};
var history = [];
var videos = new Deque();
var isPlaying = false;
var currentVideo = {videoid: '', start: 0};

function getDuration(id) {
  return new Promise((resolve, reject) => {
    const url = 'https://www.googleapis.com/youtube/v3/videos?id=' + id + '&key=AIzaSyDYwPzLevXauI-kTSVXTLroLyHEONuF9Rw&part=snippet,contentDetails';
    got(url)
      .then(response => {
        const json = JSON.parse(response.body);
        if (!json.items.length) return reject();
        const time = json.items[0].contentDetails.duration;
        resolve(moment.duration(time).asMilliseconds());
      })
      .catch(error => console.log(error.response.body));
  });
}

function nextVideo(io, socket) {
  if (isPlaying) return;
  if (videos.isEmpty()) {
    isPlaying = false;
    io.emit('next video', '');
    return;
  }
  const videoid = videos.shift();
  getDuration(videoid)
    .then(duration => {
      isPlaying = true;
      currentVideo = {videoid: videoid, start: Date.now()};
      setTimeout(() => {
        isPlaying = false;
        nextVideo(io);
      }, duration);
      io.emit('next video', currentVideo);
    })
    .catch(error => {
      socket.emit('error video', {message: 'Invalid video url.'});
    });
}

io.on('connection', function(socket){
  console.log('a user connected');

  socket.emit('chat history', {users: Object.keys(users).map(userid => users[userid].username), history: history});
  if (isPlaying) {
    socket.emit('start video', currentVideo);
  }

  socket.on('add video', function(video) {
    videos.push(video);
    nextVideo(io, socket);
  });

  socket.on('chat message', function(data) {
    if (data.message.length > 300) return;
    if (typeof data === 'object' && data.hasOwnProperty('username')) {
        const markup = {__html: parse(data.message)};
        data = {username: data.username, message: markup};
    }
    history.push(data);
    io.emit('chat message', data);
  });

  socket.on('add user', function(username) {
    const userid = toId(username);
    if (!userid || userid.length > 19) return;
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
