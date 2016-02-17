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
    const messages = this.props.messages.map((message, index) => (
      <Message message={message} key={index} />
    ));
    return (
      <ul className="chatbox list-unstyled" ref="list">
        {messages}
      </ul>
    );
  }
}

MessageList.propTypes = {
  messages: PropTypes.array.isRequired
};

export default MessageList;
