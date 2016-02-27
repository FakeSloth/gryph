import React, {PropTypes} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {Link} from 'react-router';
import Name from './Name';
import {setAllowSeek} from '../actions';

const Navbar = ({setAllowSeek}) => {
  const seekToTrue = () => setAllowSeek(true);

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
            <li onClick={seekToTrue}><Link to="/about">About</Link></li>
            <li onClick={seekToTrue}><Link to="/playlists">Playlists</Link></li>
          </ul>
          <Name />
        </div>
      </div>
    </nav>
  );
};

Navbar.propTypes = {
  setAllowSeek: PropTypes.func.isRequired
};

function mapDispatchToProps(dispatch) {
  return bindActionCreators({setAllowSeek}, dispatch);
}

export default connect(
  (state) => state,
  mapDispatchToProps
)(Navbar);
