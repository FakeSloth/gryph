import React, {PropTypes} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import * as Actions from '../actions';
import Chat from '../components/Chat';

const Index = ({messages, actions}) => {
  return (
    <div className="row">
      <div className="col-md-7">
      </div>
      <div className="col-md-1">
      </div>
      <Chat messages={messages} addMessage={actions.addMessage} />
    </div>
  );
};

Index.propTypes = {
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
)(Index);
