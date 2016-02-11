import React, {Component, PropTypes} from 'react';
import Message from './Message';

class MessageList extends Component {
  constructor(props) {
    super(props);
  }

  componentDidUpdate() {
    const listNode = this.refs.list;
    listNode.scrollTop = listNode.scrollHeight;
  }

  render() {
    const list = this.props.messages.map((message, index) => (
      <Message message={message} key={index}></Message>
    ));
    return <ul className="chatbox list-unstyled" ref="list">{list}</ul>;
  }
}

MessageList.propTypes = {
  messages: PropTypes.arrayOf(PropTypes.string).isRequired
};

export default MessageList;
