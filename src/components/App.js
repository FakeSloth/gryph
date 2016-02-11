import React, {Component} from 'react';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import Navbar from './Navbar';

var socket = require('socket.io-client')();

class App extends Component {
  constructor() {
    super();

    this.state = {
      messages: [],
      users: []
    };

    this.onAddMessage = this.onAddMessage.bind(this);
  }

  componentDidMount() {
    socket.on('connect', function(){console.log("YEAH")});
    socket.on('chat message', (message) => {
      this.setState(Object.assign(this.state, {}, {
        messages: this.state.messages.concat([message])
      }));
    });
    socket.on('disconnect', function(){console.log("BOO!")});
  }

  onAddMessage(message) {
    socket.emit('chat message', message);
  }

  render() {
    return (
      <div>
        <Navbar></Navbar>
        <div className="container-fluid">
          <div className="col-md-7"></div>
          <div className="col-md-1"></div>
          <div className="col-md-4">
            <MessageList messages={this.state.messages}></MessageList>
            <MessageInput onAddMessage={this.onAddMessage}></MessageInput>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
