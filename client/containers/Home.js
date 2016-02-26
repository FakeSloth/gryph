import React, {Component, PropTypes} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import * as Actions from '../actions';
import Chat from '../components/Chat';
import Player from '../components/Player';
import UserList from '../components/UserList';
import jwtDecode from 'jwt-decode';
import {AFTER_CHOOSE_AUTH_NAME} from '../constants/chooseName';

class Home extends Component {
  componentDidMount() {
    const {actions} = this.props;

    socket.on('chat message', (msg) => actions.addMessage(msg));
    socket.on('update messages', (msgs) => actions.updateMessages(msgs));
    socket.on('update userlist', (users) => actions.updateUserList(users));
    socket.on('next video', (video) => {
      const {videoId, host, start} = video;
      actions.startNextVideo(videoId, host, start);
    });

    const token = localStorage.getItem('token');
    if (token) {
      const decoded = jwtDecode(token);
      actions.setChooseName(AFTER_CHOOSE_AUTH_NAME);
      actions.setUsername(decoded.username);
      socket.emit('add user', {name: decoded.username, token});
    }
  }

  componentWillUnmount() {
    socket.off('chat message');
    socket.off('update messages');
    socket.off('update userlist');
    socket.off('next video');
  }

  render() {
    const {messages, actions, userList, username, video} = this.props;

    return (
      <div className="row">
        <Player
          addMessage={actions.addMessage}
          addVideo={(videoId) => socket.emit('add video', videoId)}
          setAllowSeek={actions.setAllowSeek}
          username={username}
          video={video}
        />
        <UserList users={userList} />
        <Chat
          messages={messages}
          addMessage={actions.addMessage}
          emitMessage={(msg) => socket.emit('chat message', msg)}
          username={username}
        />
      </div>
    );
  }
}

Home.propTypes = {
  actions: PropTypes.object.isRequired,
  messages: PropTypes.array.isRequired,
  userList: PropTypes.array.isRequired,
  username: PropTypes.string.isRequired,
  video: PropTypes.shape({
    allowSeek: PropTypes.bool.isRequired,
    host: PropTypes.string.isRequired,
    start: PropTypes.number.isRequired,
    videoId: PropTypes.string.isRequired
  }).isRequired
};

function mapStateToProps(state) {
  return {
    messages: state.messages,
    userList: state.name.userList,
    username: state.name.username,
    video: state.player
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(Actions, dispatch),
    dispatch
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Home);
