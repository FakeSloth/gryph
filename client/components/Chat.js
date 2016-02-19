import React, {PropTypes} from 'react';
import MessageList from './MessageList';
import MessageInput from './MessageInput';

const Chat = ({messages, addMessage, emitMessage, username}) => {
  return (
    <div className="col-md-4">
      <MessageList messages={messages} />
      <MessageInput
        addMessage={addMessage}
        emitMessage={emitMessage}
        username={username}
      />
    </div>
  );
}

Chat.propTypes = {
  messages: PropTypes.array.isRequired,
  addMessage: PropTypes.func.isRequired
};

export default Chat;
