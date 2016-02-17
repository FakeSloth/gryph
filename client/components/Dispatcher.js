import React, {Component, PropTypes} from 'react';

class Dispatcher extends Component {
  getChildContext() {
    return {
      dispatch: this.props.dispatch
    };
  }

  render() {
    return this.props.children;
  }
}

Dispatcher.childContextTypes = {
  dispatch: PropTypes.func.isRequired
};

export default Dispatcher;
