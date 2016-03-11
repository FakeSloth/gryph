import React, {Component, PropTypes} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import * as Actions from '../actions';
import Chat from '../components/Chat';
import Player from '../components/Player';
import UserList from '../components/UserList';

class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {playlist: ''};
  }

  handleChange(name) {
    this.setState({playlist: name});
  }

  render () {
    const {messages, actions, userList, username, video, playlists, playlistNames} = this.props;

    return (
      <div className="row">
        <Player
          addMessage={actions.addMessage}
          addVideo={(videoId) => socket.emit('add video', videoId)}
          emitPlaylist={(playlist) => socket.emit('select playlist', playlist)}
          onChange={(name) => this.handleChange(name)}
          playlist={this.state.playlist || (playlistNames.length ? playlistNames[0] : '')}
          playlistNames={playlistNames}
          playlists={playlists}
          setAllowSeek={actions.setAllowSeek}
          setWaitList={actions.setWaitList}
          username={username}
          video={video}
          waitList={video.waitList}
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
  playlistNames: PropTypes.array.isRequired,
  playlists: PropTypes.object.isRequired,
  userList: PropTypes.array.isRequired,
  username: PropTypes.string.isRequired,
  video: PropTypes.shape({
    allowSeek: PropTypes.bool.isRequired,
    host: PropTypes.string.isRequired,
    start: PropTypes.number.isRequired,
    videoId: PropTypes.string.isRequired,
    waitList: PropTypes.string.isRequired
  }).isRequired
};

function mapStateToProps(state) {
  return {
    messages: state.messages,
    playlists: state.playlists.playlists,
    playlistNames: Object.keys(state.playlists.playlists),
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
