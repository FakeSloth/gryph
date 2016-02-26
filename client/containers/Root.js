import React, {PropTypes} from 'react';
import {Provider} from 'react-redux';
import {Router, IndexRoute, Route, browserHistory} from 'react-router';
import App from '../components/App';
import About from '../components/About';
import Playlists from '../components/Playlists';
import Home from './Home';

const Root = ({store}) => {
  return (
    <Provider store={store}>
      <Router history={browserHistory}>
        <Route path="/" component={App}>
          <IndexRoute component={Home} />
          <Route path="about" component={About} />
          <Route path="playlists" component={Playlists} />
        </Route>
      </Router>
    </Provider>
  );
};

Root.propTypes = {
  store: PropTypes.object.isRequired
};

export default Root;
