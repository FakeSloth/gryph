import React, {Component, PropTypes} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import io from 'socket.io-client';
import * as Actions from '../actions';
import Chat from '../components/Chat';

const socket = io();

class Home extends Component {
  componentDidMount() {
    const {dispatch} = this.context;

    socket.on('chat message', (msg) => dispatch(Actions.addMessage(msg.text)));
  }

  render() {
    const {messages, actions} = this.props;

    return (
      <div className="row">
        <div className="col-md-7">
        </div>
        <div className="col-md-1">
        </div>
        <Chat messages={messages} addMessage={actions.emitMessage} socket={socket} />
      </div>
    );
  }
};

Home.contextTypes = {
  dispatch: PropTypes.func.isRequired
};

Home.propTypes = {
  messages: PropTypes.array.isRequired,
  actions: PropTypes.object.isRequired
};

function mapStateToProps(state) {
  return {
    messages: state.messages
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(Actions, dispatch)
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Home);
