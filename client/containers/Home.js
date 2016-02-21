import React, {Component, PropTypes} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import * as Actions from '../actions';
import Chat from '../components/Chat';
import UserList from '../components/UserList';

class Home extends Component {
  componentDidMount() {
    const {dispatch} = this.props;

    socket.on('chat message', (msg) => dispatch(Actions.addMessage(msg)));
    socket.on('update userlist', (msg) => dispatch(Actions.updateUserList(msg)));
  }

  render() {
    const {messages, actions, userList, username} = this.props;

    return (
      <div className="row">
        <div className="col-md-7">
        </div>
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
  actions: PropTypes.object.isRequired
};

function mapStateToProps(state) {
  return {
    messages: state.messages,
    userList: state.name.userList,
    username: state.name.username
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
