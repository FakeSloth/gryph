import React, {PropTypes} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import * as Actions from '../actions';
import Chat from '../components/Chat';
import Player from '../components/Player';
import UserList from '../components/UserList';

const Home = ({messages, actions, userList, username, video}) => {
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
};

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
