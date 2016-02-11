import React, {PropTypes} from 'react';

function Message({message}) {
  return <li>{message}</li>;
}

Message.propTypes = {
  message: PropTypes.string.isRequired
};

export default Message;
