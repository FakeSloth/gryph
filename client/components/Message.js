import React, {PropTypes} from 'react';
import hashColor from '../hashColor';

const Message = ({message}) => {
  let msg;

  const {username, className, text, html} = message;

  if (username) {
    msg = (
      <li>
        <strong style={{color: hashColor(username)}}>{username}:</strong>
        {' '}
        <span dangerouslySetInnerHTML={{__html: text}}></span>
      </li>
    );
  } else if (className) {
    msg = (
      <li>
        <span className={className}>{text}</span>
      </li>
    );
  } else if (html) {
    msg = (
      <li>
        <span dangerouslySetInnerHTML={{__html: text}}></span>
      </li>
    );
  } else {
    msg = (
      <li>
        {text}
      </li>
    );
  }

  return msg;
};

Message.propTypes = {
  message: PropTypes.object.isRequired
};

export default Message;
