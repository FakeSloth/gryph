import React, {Component} from 'react';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import Navbar from './Navbar';
import UserList from './UserList';
import Player from './Player';

var socket = require('socket.io-client')();

class App extends Component {
  constructor() {
    super();

    this.state = {
      messages: [],
      users: [],
      username: '',
      videoStarted: false,
      videoTimeStart: 0,
      videoUrl: ''
    };

    this.addMessage = this.addMessage.bind(this);
    this.onAddMessage = this.onAddMessage.bind(this);
    this.onAddUser = this.onAddUser.bind(this);
    this.onAddVideo = this.onAddVideo.bind(this);
  }

  componentDidMount() {
    socket.on('connect', function(){console.log("YEAH")});
    socket.on('chat message', (message) => {
      this.addMessage(message);
    });
    socket.on('next video', (url) => {
      this.setState(Object.assign(this.state, {}, {
        videoUrl: url
      }));
    });
    socket.on('update users', (users) => {
      this.setState(Object.assign(this.state, {}, {
        users: users
      }));
    });
    socket.on('chat history', ({users, history}) => {
      this.setState(Object.assign(this.state, {}, {
        users: users,
        messages: history
      }));
    });
    socket.on('disconnect', function(){console.log("BOO!")});
  }

  addMessage(message) {
    this.setState(Object.assign(this.state, {}, {
      messages: this.state.messages.concat([message])
    }));
  }

  onAddMessage(message) {
    socket.emit('chat message', message);
  }

  onAddUser(username) {
    this.setState(Object.assign(this.state, {}, {
      username: username
    }));
    socket.emit('add user', username);
  }

  onAddVideo(e) {
    e.preventDefault();
    const node = this.refs.add_video;
    const video = node.value.trim();
    const parts = video.split('=');
    if (parts.length < 2) return this.addMessage({message: 'Invalid Video Url'});
    const url = parts[1].trim();
    if (!url) return this.addMessage({message: 'Invalid Video Url'});
    socket.emit('add video', url);
    node.value = '';
  }

  render() {
    return (
      <div>
        <Navbar onAddUser={this.onAddUser} onAddError={this.addMessage}></Navbar>
        <div className="container-fluid">
          <div className="col-md-7">
            <Player video={this.state.videoUrl} onEnd={this.onEnd}></Player>
            <form onSubmit={this.onAddVideo}>
              <input type="text" placeholder="Add Video" ref="add_video" className="form-control" />
            </form>
          </div>
          <div className="col-md-1">
            <UserList users={this.state.users}></UserList>
          </div>
          <div className="col-md-4">
            <MessageList messages={this.state.messages}></MessageList>
            <MessageInput
              onAddMessage={this.onAddMessage}
              onAddError={this.addMessage}
              username={this.state.username}
            >
            </MessageInput>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
