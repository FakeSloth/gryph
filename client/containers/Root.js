import React, {Component, PropTypes} from 'react';
import {bindActionCreators} from 'redux';
import {Provider} from 'react-redux';
import {Router, IndexRoute, Route, browserHistory} from 'react-router';
import App from '../components/App';
import About from '../components/About';
import Playlists from '../components/Playlists';
import Home from './Home';
import jwtDecode from 'jwt-decode';
import {AFTER_CHOOSE_AUTH_NAME, BEFORE_CHOOSE_NAME} from '../constants/chooseName';
import * as Actions from '../actions/index';

class Root extends Component {
  componentDidMount() {
    const actions = bindActionCreators(Actions, this.props.store.dispatch);

    socket.on('chat message', (msg) => actions.addMessage(msg));
    socket.on('update messages', (msgs) => actions.updateMessages(msgs));
    socket.on('update userlist', (users) => actions.updateUserList(users));
    socket.on('next video', (video) => {
      const {videoId, host, start} = video;
      actions.startNextVideo(videoId, host, start);
    });
    socket.on('error token', () => {
      localStorage.removeItem('token');
      actions.setChooseName(BEFORE_CHOOSE_NAME);
      actions.setUsername('');
    });

    const token = localStorage.getItem('token');
    if (token) {
      const decoded = jwtDecode(token);
      actions.setChooseName(AFTER_CHOOSE_AUTH_NAME);
      actions.setUsername(decoded.username);
      socket.emit('add user', {name: decoded.username, token});
    }

    socket.emit('initial load');
  }

  render() {
    return (
      <Provider store={this.props.store}>
        <Router history={browserHistory}>
          <Route path="/" component={App}>
            <IndexRoute component={Home} />
            <Route path="about" component={About} />
            <Route path="playlists" component={Playlists} />
          </Route>
        </Router>
      </Provider>
    );
  }
}

Root.propTypes = {
  store: PropTypes.object.isRequired
};

export default Root;
