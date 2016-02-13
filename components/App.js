import React, {Component} from 'react';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import Navbar from './Navbar';
import Player from './Player';
import UserList from './UserList';

let socket = require('socket.io-client')();

class App extends Component {
  constructor() {
    super();

    this.state = {
      allowSeek: false,
      chooseName: false,
      messages: [],
      username: '',
      users: [],
      videoId: '',
      videoStart: 0
    };

    this.addMessage = this.addMessage.bind(this);
    this.onAddMessage = this.onAddMessage.bind(this);
    this.onAddUser = this.onAddUser.bind(this);
    this.onAddVideo = this.onAddVideo.bind(this);
    this.onPause = this.onPause.bind(this);
    this.setAllowSeekToFalse = this.setAllowSeekToFalse.bind(this);
    this.onChooseName = this.onChooseName.bind(this);
  }

  componentDidMount() {
    // @params users :: Array
    // @params history :: Array
    socket.on('chat history', ({users, history}) => {
      this.setState(Object.assign(this.state, {}, {
        users: users,
        messages: history
      }));
    });

    // @param data :: Object {message: String, username(Optional): String}
    socket.on('chat message', (data) => {
      this.addMessage(data);
    });

    // @param video :: Object {id: String, start: Date}
    socket.on('next video', (video) => {
      this.setState(Object.assign(this.state, {}, {
        videoId: video.id,
        videoStart: video.start
      }));
    });

    // @param video :: Object {id: String, start: Date}
    socket.on('start video', (video) => {
      this.setState(Object.assign(this.state, {}, {
        videoId: video.id,
        videoStart: video.start,
        allowSeek: true
      }));
    });

    // @param users :: Array (String)
    socket.on('update users', (users) => {
      this.setState(Object.assign(this.state, {}, {
        users: users
      }));
    });
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
    const error = {message: 'Invalid video url.', context: 'text-danger'};
    if (parts.length < 2) {
      return this.addMessage(error);
    }
    const url = parts[1].trim();
    if (!url) return this.addMessage(error);
    socket.emit('add video', url);
    this.addMessage({message: video + ' added.', context: 'text-success'});
    node.value = '';
  }

  onPause() {
    this.setState(Object.assign(this.state, {}, {
      allowSeek: true
    }));
  }

  setAllowSeekToFalse() {
    this.setState(Object.assign(this.state, {}, {
      allowSeek: false
    }));
  }

  onChooseName() {
    this.setState(Object.assign(this.state, {}, {
      chooseName: true
    }));
  }

  render() {
    const videoId = this.state.videoId;
    const hasVideoId = videoId === '' || typeof videoId !== 'string';

    return (
      <div>
        <Navbar onAddUser={this.onAddUser}
                onAddError={this.addMessage}
                onChooseName={this.onChooseName}
                chooseName={this.state.chooseName}></Navbar>
        <div className="container-fluid">
          <div className="col-md-7">
            {hasVideoId ?
              (<div className="jumbotron"><h1>No video is playing.</h1></div>) :
              (<Player videoId={this.state.videoId}
                       onPause={this.onPause}
                       allowSeek={this.state.allowSeek}
                       setAllowSeekToFalse={this.setAllowSeekToFalse}
                       start={this.state.videoStart}
              ></Player>)}
            <br />
            <form onSubmit={this.onAddVideo}>
              <div className="row">
                <div className="col-md-10">
                  <input type="text" placeholder="YouTube Video Url" ref="add_video" className="form-control" />
                </div>
                <div className="col-md-2">
                  <button type="submit" className="btn btn-default">Add Video</button>
                </div>
              </div>
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
