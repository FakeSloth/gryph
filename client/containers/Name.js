import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import fetch from 'isomorphic-fetch';
import hashColor from '../hashColor';
import toId from '../../common/toId';
import * as Actions from '../actions';
import {
  BEFORE_CHOOSE_NAME,
  DURING_CHOOSE_NAME,
  DURING_CHOOSE_AUTH_NAME,
  AFTER_CHOOSE_NAME} from '../constants/chooseName';

class Name extends Component {
  constructor(props) {
    super(props);

    this.state = {name: ''};
  }

  handleChange(e) {
    this.setState({name: e.target.value});
  }

  auth(type) {
    const form = new FormData();
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
        return this.props.actions.addMessage({
          text: res.msg,
          className: 'text-danger'
        });
      }
      if (!res.token) return;
      this.refs.username_input.value = '';
      this.refs.password_input.value = '';
      localStorage.setItem('token', res.token);
      actions.setChooseName(AFTER_CHOOSE_NAME);
      actions.setUsername(username);
      socket.emit('add user', username);
    })
    .catch(error => console.error(error));
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
        </form>
      );
    } else if (chooseName === DURING_CHOOSE_NAME) {
      formBody = (
        <form
          className="navbar-form navbar-right"
          onSubmit={(e) => {
            e.preventDefault();
            const name = this.state.name.trim();
            if (!name) return;
            if (name.length > 19) {
              return actions.addMessage({
                text: "Name cannot be more than 19 characters.",
                className: "text-danger"
              });
            }
            if (usernames.includes(toId(name))) {
              return actions.addMessage({
                text: "This name is taken.",
                className: "text-danger"
              });
            }
            // CHECK IF NAME IS AUTH! using /auth route
            actions.setChooseName(AFTER_CHOOSE_NAME);
            actions.setUsername(name);
            socket.emit('add user', name);
          }}
        >
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
            <button className="btn btn-default" onClick={(e) => {
              e.preventDefault();
              actions.setChooseName(AFTER_CHOOSE_NAME);
            }}>
              <span className="glyphicon glyphicon-chevron-left"></span>
            </button>
            {' '}
            <input type="text" className="form-control" placeholder="Username" ref="username_input" />{' '}
            <input type="password" className="form-control" placeholder="Password" ref="password_input" />{' '}
            <button className="btn btn-primary" onClick={() => this.auth('login')}>Login</button>
            <button className="btn btn-default" onClick={() => this.auth('register')}>Register</button>
          </div>
        </form>
      );
    } else if (chooseName === AFTER_CHOOSE_NAME) {
      formBody = (<ul className="nav navbar-nav navbar-right">
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
      </ul>);
    }

    return formBody;
  }
}

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
