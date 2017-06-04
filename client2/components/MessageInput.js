import React, {PropTypes} from 'react';

const MessageInput = ({addMessage, emitMessage, username}) => {
  let input;

  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      const text = input.value.trim();
      if (!text) return;
      if (!username) {
        return addMessage({
          text: 'Choose a username to chat.'
        });
      }
      if (text.length > 300) {
        return addMessage({
          text: 'Your message is too long.',
          className: 'text-danger'
        });
      }
      emitMessage({text, username});
      input.value = '';
    }}>
      <input type="text"
             className="form-control"
             ref={(node) => {
               input = node;
             }} />
    </form>
  );
};

MessageInput.propTypes = {
  addMessage: PropTypes.func.isRequired,
  emitMessage: PropTypes.func.isRequired,
  username: PropTypes.string.isRequired
};

export default MessageInput;
