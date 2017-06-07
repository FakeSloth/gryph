/*eslint no-console: 0*/
/*eslint no-undef: "warn"*/
import React, {Component, PropTypes} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import fetch from 'isomorphic-fetch';
import {Navbar, NavDropdown, MenuItem, Button, Input} from 'react-bootstrap';
import toId from 'toid';
import hashColor from '../hashColor';
import * as Actions from '../actions';
import {
  BEFORE_CHOOSE_NAME,
  DURING_CHOOSE_NAME,
  DURING_CHOOSE_AUTH_NAME,
  AFTER_CHOOSE_AUTH_NAME,
  AFTER_CHOOSE_NAME
} from '../constants/chooseName';

class Name extends Component {
  constructor(props) {
    super(props);

    this.state = {name: ''};
  }

  handleChange(e) {
    this.setState({name: e.target.value});
  }

  auth(type, usernames) {
    const username = this.refs.username_input.value.trim();
    const password = this.refs.password_input.value;
    const {actions} = this.props;
    if (!username || !password) {
      return actions.addMessage({
        text: 'Username and password cannot be empty.',
        className: 'text-danger'
      });
    }
    if (username.length > 19) {
      return actions.addMessage({
        text: 'Username cannot be longer than 19 characters.',
        className: 'text-danger'
      });
    }
    if (usernames.includes(toId(username))) {
      return actions.addMessage({
        text: 'Someone is already on this username.',
        className: 'text-danger'
      });
    }
    if (password.length > 300) return;
    fetch('/' + type, {
      method: 'post',
      credentials: 'include',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({username, password})
    })
    .then((response) => response.json())
    .then((res) => {
      if (res.msg) {
        return actions.addMessage({
          text: res.msg,
          className: 'text-danger'
        });
      }
      if (!res.token) return;
      this.refs.username_input.value = '';
      this.refs.password_input.value = '';
      localStorage.setItem('token', res.token);
      actions.setChooseName(AFTER_CHOOSE_AUTH_NAME);
      actions.setUsername(username);
      socket.emit('add user', {name: username, token: res.token});
    })
    .catch(error => console.error(error));
  }

  handleSubmitDuringChooseName(e, usernames) {
    e.preventDefault();
    const {actions} = this.props;
    const name = this.state.name.trim();
    if (!name) return;
    if (name.length > 19) {
      return actions.addMessage({
        text: 'Name cannot be more than 19 characters.',
        className: 'text-danger'
      });
    }
    if (usernames.includes(toId(name))) {
      return actions.addMessage({
        text: 'Someone is already on this username.',
        className: 'text-danger'
      });
    }
    fetch('/auth', {
      method: 'post',
      credentials: 'include',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({name})
    })
    .then((response) => response.json())
    .then((res) => {
      if (res.msg) {
        return this.props.actions.addMessage({
          text: res.msg,
          className: 'text-danger'
        });
      }
      if (!res.success) return;
      actions.setChooseName(AFTER_CHOOSE_NAME);
      actions.setUsername(name);
      socket.emit('add user', {name});
    })
    .catch(error => console.error(error));
  }

  logout() {
    const {actions} = this.props;
    localStorage.removeItem('token');
    actions.setChooseName(BEFORE_CHOOSE_NAME);
    actions.setUsername('');
    socket.emit('logout');
  }

  render() {
    const {chooseName, username, actions, users} = this.props;
    const usernames = users
      .map(name => toId(name))
      .filter(userId => toId(username) !== userId);
    let formBody;

    if (chooseName === BEFORE_CHOOSE_NAME) {
      formBody = (
        <Navbar.Form pullRight onSubmit={e => e.preventDefault()}>
          <Button
            onClick={() => actions.setChooseName(DURING_CHOOSE_NAME)}
            bsStyle="primary"
          >
            Choose Name
          </Button>
          {' '}
          <Button
            onClick={() => actions.setChooseName(DURING_CHOOSE_AUTH_NAME)}
          >
            Login/Register
          </Button>
        </Navbar.Form>
      );
    } else if (chooseName === DURING_CHOOSE_NAME) {
      formBody = (
        <form
          className="navbar-form"
          onSubmit={(e) => this.handleSubmitDuringChooseName(e, usernames)}
        >
          <Button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              if (!username) {
                actions.setChooseName(BEFORE_CHOOSE_NAME);
              } else {
                actions.setChooseName(AFTER_CHOOSE_NAME);
              }
            }}
          >
            <span className="glyphicon glyphicon-chevron-left"></span>
          </Button>
          {' '}
          <div className="form-group">
            <Input
              type="text"
              placeholder="Username"
              value={this.state.name}
              onChange={(e) => this.handleChange(e)}
            />
          </div>
        </form>
      );
    } else if (chooseName === DURING_CHOOSE_AUTH_NAME) {
      formBody = (
        <form
          className="navbar-form"
          onSubmit={(e) => e.preventDefault()}
        >
          <div className="form-group">
            <Button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                if (!username) {
                  actions.setChooseName(BEFORE_CHOOSE_NAME);
                } else {
                  actions.setChooseName(AFTER_CHOOSE_NAME);
                }
              }}
            >
              <span className="glyphicon glyphicon-chevron-left"></span>
            </Button>
            {' '}
            <input type="text" className="form-control" placeholder="Username" ref="username_input" />{' '}
            <input type="password" className="form-control" placeholder="Password" ref="password_input" />{' '}
            <Button bsStyle="primary" onClick={() => this.auth('login', usernames)}>Login</Button>
            <Button onClick={() => this.auth('register', usernames)}>Register</Button>
          </div>
        </form>
      );
    } else if (chooseName === AFTER_CHOOSE_AUTH_NAME) {
      formBody = (
        <NavDropdown
          id="dropdown-custom-1"
          title={<strong style={{color: hashColor(toId(username))}}>{username}</strong>}
        >
          <MenuItem onClick={() => this.logout()}>Logout</MenuItem>
        </NavDropdown>
      );
    } else if (chooseName === AFTER_CHOOSE_NAME) {
      formBody = (
        <NavDropdown
          id="dropdown-custom-2"
          title={<strong style={{color: hashColor(toId(username))}}>{username}</strong>}
        >
          <MenuItem onClick={() => actions.setChooseName(DURING_CHOOSE_NAME)}>Change Name</MenuItem>
          <MenuItem onClick={() => actions.setChooseName(DURING_CHOOSE_AUTH_NAME)}>Login/Register</MenuItem>
        </NavDropdown>
      );
    }

    return formBody;
  }
}

Name.propTypes = {
  actions: PropTypes.object.isRequired,
  chooseName: PropTypes.string.isRequired,
  username: PropTypes.string.isRequired,
  users: PropTypes.array.isRequired
};

function mapStateToProps(state) {
  return {
    chooseName: state.name.chooseName,
    username: state.name.username,
    users: state.name.userList
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(Actions, dispatch)
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Name);
