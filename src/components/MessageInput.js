import React, {Component, PropTypes} from 'react';

class MessageInput extends Component {
  constructor(props) {
    super(props);

    this.handleAddMessage = this.handleAddMessage.bind(this);
  }

  handleAddMessage(e) {
    e.preventDefault();
    const node = this.refs.input;
    if (!this.props.username) {
      this.props.onAddError({message: 'Please enter a username.'});
      node.value = '';
      return;
    }
    const message = node.value.trim();
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
}

MessageInput.propTypes = {
  onAddMessage: PropTypes.func.isRequired
};

export default MessageInput;
