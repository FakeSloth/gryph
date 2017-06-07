import React, {PropTypes} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {Link} from 'react-router';
import {Navbar, Nav} from 'react-bootstrap';
import Name from './Name';
import {setAllowSeek} from '../actions';

const Navigation = ({setAllowSeek}) => {
  const seekToTrue = () => setAllowSeek(true);

  return (
    <Navbar fluid={true}>
      <Navbar.Header>
        <Navbar.Brand>
          <Link className="navbar-brand" to="/">gryph</Link>
        </Navbar.Brand>
        <Navbar.Toggle />
      </Navbar.Header>
      <Navbar.Collapse>
        <Nav>
          <li onClick={seekToTrue}><Link to="/about">About</Link></li>
          <li onClick={seekToTrue}><Link to="/playlists">Playlists</Link></li>
        </Nav>
        <Nav pullRight>
          <Name />
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};

Navigation.propTypes = {
  setAllowSeek: PropTypes.func.isRequired
};

function mapDispatchToProps(dispatch) {
  return bindActionCreators({setAllowSeek}, dispatch);
}

export default connect(
  (state) => state,
  mapDispatchToProps
)(Navigation);
