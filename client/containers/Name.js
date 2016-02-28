/*eslint no-console: 0*/
import React, {Component, PropTypes} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import fetch from 'isomorphic-fetch';
import hashColor from '../hashColor';
import toId from 'toid';
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
        <form
          className="navbar-form navbar-right"
          onSubmit={e => e.preventDefault()}
        >
          <button
            onClick={() => actions.setChooseName(DURING_CHOOSE_NAME)}
            className="btn btn-primary"
          >
            Choose Name
          </button>
          {' '}
          <button
            onClick={() => actions.setChooseName(DURING_CHOOSE_AUTH_NAME)}
            className="btn btn-default"
          >
            Login/Register
          </button>
        </form>
      );
    } else if (chooseName === DURING_CHOOSE_NAME) {
      formBody = (
        <form
          className="navbar-form navbar-right"
          onSubmit={(e) => this.handleSubmitDuringChooseName(e, usernames)}
        >
          <button
            type="button"
            className="btn btn-default"
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
          </button>
          {' '}
          <div className="form-group">
            <input
              type="text"
              className="form-control"
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
          className="navbar-form navbar-right"
          onSubmit={(e) => e.preventDefault()}
        >
          <div className="form-group">
            <button
              type="button"
              className="btn btn-default"
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
            </button>
            {' '}
            <input type="text" className="form-control" placeholder="Username" ref="username_input" />{' '}
            <input type="password" className="form-control" placeholder="Password" ref="password_input" />{' '}
            <button className="btn btn-primary" onClick={() => this.auth('login', usernames)}>Login</button>
            <button className="btn btn-default" onClick={() => this.auth('register', usernames)}>Register</button>
          </div>
        </form>
      );
    } else if (chooseName === AFTER_CHOOSE_AUTH_NAME) {
      formBody = (
        <ul className="nav navbar-nav navbar-right">
          <li className="dropdown">
            <a href="#" className="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">
              <strong style={{color: hashColor(username)}}>{username}</strong>{' '}
              <span className="caret"></span>
            </a>
            <ul className="dropdown-menu">
              <li><a href="#" onClick={() => this.logout()}>Logout</a></li>
            </ul>
          </li>
        </ul>
      );
    } else if (chooseName === AFTER_CHOOSE_NAME) {
      formBody = (
        <ul className="nav navbar-nav navbar-right">
          <li className="dropdown">
            <a href="#" className="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">
              <strong style={{color: hashColor(username)}}>{username}</strong>{' '}
              <span className="caret"></span>
            </a>
            <ul className="dropdown-menu">
              <li><a href="#" onClick={() => actions.setChooseName(DURING_CHOOSE_NAME)}>Change Name</a></li>
              <li><a href="#" onClick={() => actions.setChooseName(DURING_CHOOSE_AUTH_NAME)}>Login/Register</a></li>
            </ul>
          </li>
        </ul>
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
