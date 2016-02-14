import React, {Component} from 'react';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import Navbar from './Navbar';
import Player from './Player';
import UserList from './UserList';
import VideoHistoryList from './VideoHistoryList';
import {hashColor} from '../utils';
import localforage from 'localforage';
import jwt from 'jsonwebtoken';

let socket = require('socket.io-client')();

class App extends Component {
  constructor() {
    super();

    this.state = {
      allowSeek: false,
      chooseName: false,
      isAuthing: false,
      messages: [],
      nameChosen: false,
      username: '',
      users: [],
      video: {id: '', start: 0, username: ''},
      videoHistory: []
    };

    this.addMessage = this.addMessage.bind(this);
    this.onAddMessage = this.onAddMessage.bind(this);
    this.onAddUser = this.onAddUser.bind(this);
    this.onAddVideo = this.onAddVideo.bind(this);
    this.onPause = this.onPause.bind(this);
    this.setAllowSeekToFalse = this.setAllowSeekToFalse.bind(this);
    this.onChooseName = this.onChooseName.bind(this);
    this.onIsAuthing = this.onIsAuthing.bind(this);
  }

  componentDidMount() {
          var token = localStorage.getItem('token');
          var decoded = jwt.decode(token, {complete: true});
          var username = decoded.payload.username;
          console.log(decoded)
          this.setState(Object.assign(this.state, {}, {
            username: username,
            nameChosen: true,
            users: this.state.users.concat([username])
          }));
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
        video: video
      }));
    });

    // @param video :: Object {id: String, start: Date}
    socket.on('start video', (video) => {
      this.setState(Object.assign(this.state, {}, {
        video: video,
        allowSeek: true
      }));
    });

    // @param users :: Array (String)
    socket.on('update users', (users) => {
      this.setState(Object.assign(this.state, {}, {
        users: users
      }));
    });

    // @param videos :: Array ({url: String, title: String, img: String})
    socket.on('video history', (videos) => {
      this.setState(Object.assign(this.state, {}, {
        videoHistory: videos
      }));
    });

    socket.on('get token', (token) => {
      console.log('got token')
      localStorage.setItem('token', token, function(err, res) {
        if (err) console.log(err);
        console.log(res);
      });
    });
  }

  addMessage(message) {
    this.setState(Object.assign(this.state, {}, {
      messages: this.state.messages.concat([message])
    }));
    socket.emit('token secret', localStorage.getItem('token'))
  }

  onAddMessage(message) {
    socket.emit('chat message', message);
  }

  onAddUser(username) {
    this.setState(Object.assign(this.state, {}, {
      username: username,
      nameChosen: true
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
    this.addMessage({message: video + ' added to video queue.', context: 'text-success'});
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
      chooseName: true,
      nameChosen: false
    }));
  }

  onIsAuthing() {
    this.setState(Object.assign(this.state, {}, {
      isAuthing: true,
      nameChosen: false,
      chooseName: false
    }));
  }

  onRegister(data) {
    socket.emit('register user', data);
  }

  onLogin(data) {
    socket.emit('login user', data);
  }

  render() {
    const videoId = this.state.video.id;
    const hasVideoId = videoId === '' || typeof videoId !== 'string';
    const host = this.state.video.username;

    return (
      <div>
        <Navbar onAddUser={this.onAddUser}
                onAddError={this.addMessage}
                onChooseName={this.onChooseName}
                onIsAuthing={this.onIsAuthing}
                onRegister={this.onRegister}
                onLogin={this.onLogin}
                nameChosen={this.state.nameChosen}
                username={this.state.username}
                isAuthing={this.state.isAuthing}
                chooseName={this.state.chooseName}></Navbar>
        <div className="container-fluid">
          <div className="col-md-7">
            {hasVideoId ?
              (<div className="jumbotron"><h1>No video is playing.</h1></div>) :
              (<div>
                <Player videoId={this.state.video.id}
                        onPause={this.onPause}
                        allowSeek={this.state.allowSeek}
                        setAllowSeekToFalse={this.setAllowSeekToFalse}
                        start={this.state.video.start}
                ></Player>
                <p><b>Host: <span style={{color: hashColor(host)}}>{host}</span></b></p>
              </div>)}
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
            <VideoHistoryList videos={this.state.videoHistory} isPlaying={this.state.video.id}></VideoHistoryList>
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
