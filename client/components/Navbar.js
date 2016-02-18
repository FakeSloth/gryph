import React, {Component} from 'react';
import {Link} from 'react-router';
import Name from '../containers/Name';
import hashColor from '../hashColor';
import toId from '../../common/toId';

const Navbar = () => {
  return (
    <nav className="navbar navbar-default">
      <div className="container-fluid">
        <div className="navbar-header">
          <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1" aria-expanded="false">
            <span className="sr-only">Toggle navigation</span>
            <span className="icon-bar"></span>
            <span className="icon-bar"></span>
            <span className="icon-bar"></span>
          </button>
          <Link className="navbar-brand" to="/">gryph</Link>
        </div>

        <div className="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
          <ul className="nav navbar-nav">
            <li><Link to="/about">About</Link></li>
            <li><Link to="/playlists">Playlists</Link></li>
          </ul>
          <Name />
        </div>
      </div>
    </nav>
  );
};

/*class Navbar extends Component {
  constructor(props) {
    super(props);

    this.handleAddUser = this.handleAddUser.bind(this);
    this.handleRegister = this.handleRegister.bind(this);
    this.handleLogin = this.handleLogin.bind(this);
  }

  handleAddUser(e) {
    e.preventDefault();
    const node = this.refs.input;
    const username = node.value.trim();
    const error = (msg) => ({message: msg, context: 'text-danger'});
    if (!username) return this.props.onAddError(error('Username cannot be empty.'));
    const userid = toId(username);
    if (!userid) return this.props.onAddError(error('Only letters and numbers are allowed in username.'));
    if (userid.length > 19) return this.props.onAddError(error('Username cannot be longer than 19 characters.'));
    this.props.onAddUser(username);
  }

  handleRegister(e) {
    e.preventDefault();
    const username = this.refs.username_input.value.trim();
    const password = this.refs.password_input.value;
    const error = (msg) => ({message: msg, context: 'text-danger'});
    if (!username) return this.props.onAddError(error('Username cannot be empty.'));
    if (!password) return this.props.onAddError(error('Password cannot be empty.'));
    const userid = toId(username);
    if (!userid) return this.props.onAddError(error('Only letters and numbers are allowed in username.'));
    if (userid.length > 19) return this.props.onAddError(error('Username cannot be longer than 15 characters.'));
    this.props.onRegister({username, password});
    this.refs.username_input.value = '';
    this.refs.password_input.value = '';
  }

  handleLogin(e) {
    e.preventDefault();
    const username = this.refs.username_input.value.trim();
    const password = this.refs.password_input.value;
    const error = (msg) => ({message: msg, context: 'text-danger'});
    if (!username) return this.props.onAddError(error('Username cannot be empty.'));
    if (!password) return this.props.onAddError(error('Password cannot be empty.'));
    const userid = toId(username);
    if (!userid) return this.props.onAddError(error('Only letters and numbers are allowed in username.'));
    if (userid.length > 19) return this.props.onAddError(error('Username cannot be longer than 15 characters.'));
    this.props.onLogin({username, password});
    this.refs.username_input.value = '';
    this.refs.password_input.value = '';
  }

  render() {
    const onLoadForm = (<form className="navbar-form navbar-right">
                          <button onClick={this.props.onChooseName} className="btn btn-primary">Choose Name</button>
                        </form>);

    const chooseNameForm = (<form className="navbar-form navbar-right" onSubmit={this.handleAddUser}>
                              <div className="form-group">
                                <input type="text" className="form-control" placeholder="Username" ref="input" />
                              </div>
                            </form>);

    const authForm = (<form className="navbar-form navbar-right">
                        <div className="form-group">
                          <input type="text" className="form-control" placeholder="Username" ref="username_input" />{' '}
                          <input type="text" className="form-control" placeholder="Password" ref="password_input" />{' '}
                          <button className="btn btn-primary" onClick={this.handleLogin}>Login</button>
                          <button className="btn btn-default" onClick={this.handleRegister}>Register</button>
                        </div>
                      </form>);

    const afterChooseName =
      (<ul className="nav navbar-nav navbar-right">
        <li className="dropdown">
          <a href="#" className="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">
            <strong style={{color: hashColor(this.props.username)}}>{this.props.username}</strong>{' '}
            <span className="caret"></span>
          </a>
          <ul className="dropdown-menu">
            <li><a href="#" onClick={this.props.onChooseName}>Choose Name</a></li>
            <li><a href="#" onClick={this.props.onIsAuthing}>Login/Register</a></li>
          </ul>
        </li>
      </ul>);

    let display;

    if (this.props.nameChosen) {
      display = afterChooseName;
    } else if (this.props.chooseName) {
      display = chooseNameForm;
    } else if (this.props.isAuthing) {
      display = authForm;
    } else {
      display = onLoadForm;
    }

    return (
      <nav className="navbar navbar-default">
        <div className="container-fluid">
          <div className="navbar-header">
            <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1" aria-expanded="false">
              <span className="sr-only">Toggle navigation</span>
              <span className="icon-bar"></span>
              <span className="icon-bar"></span>
              <span className="icon-bar"></span>
            </button>
            <Link className="navbar-brand" to="/">gryph</Link>
          </div>

          <div className="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
            <ul className="nav navbar-nav">
              <li><Link to="/about">About</Link></li>
              <li><Link to="/playlists">Playlists</Link></li>
            </ul>
            {display}
          </div>
        </div>
      </nav>
    );
  }
}*/

export default Navbar;
