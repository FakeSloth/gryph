import React, {Component, PropTypes} from 'react';

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
      <li key={index}>{message}</li>
    ));
    return <ul className="chatbox list-unstyled" ref="list">{list}</ul>;
  }
}

MessageList.propTypes = {
  messages: PropTypes.array.isRequired
};

export default MessageList;
