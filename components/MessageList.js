import React, {Component, PropTypes} from 'react';
import colors from '../colors';

class MessageList extends Component {
  constructor(props) {
    super(props);
  }

  componentDidUpdate() {
    const listNode = this.refs.list;
    listNode.scrollTop = listNode.scrollHeight;
  }

  render() {
    const list = this.props.messages.map((mObj, index) => {
      if (mObj.username) {
        return (
          <li key={index}>
            <b style={{color: colors(mObj.username)}}>{mObj.username}:</b>
            {' '}
            <span dangerouslySetInnerHTML={mObj.message}></span>
          </li>
        );
      }
      return <li key={index}>{mObj.message}</li>;
    });
    return <ul className="chatbox list-unstyled" ref="list">{list}</ul>;
  }
}

MessageList.propTypes = {
  messages: PropTypes.array.isRequired
};

export default MessageList;
