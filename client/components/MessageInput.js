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
  addMessage: PropTypes.func.isRequired
};

export default MessageInput;

/*class MessageInput extends Component {
  constructor(props) {
    super(props);

    this.handleAddMessage = this.handleAddMessage.bind(this);
  }

  handleAddMessage(e) {
    e.preventDefault();
    const node = this.refs.input;
    const error = (msg) => ({message: msg, context: 'text-danger'});
    if (!this.props.username) {
      this.props.onAddError(error('Please enter a username.'));
      node.value = '';
      return;
    }
    const message = node.value.trim();
    if (message.length > 300) return this.props.onAddError(error('Message too long.'));
    if (!message) return;
    this.props.onAddMessage({username: this.props.username, message: message});
    node.value = '';
  }

  render() {
    return (
      <form onSubmit={this.handleAddMessage}>
        <input type="text" ref="input" className="form-control" />
      </form>
    );
  }
}*/
