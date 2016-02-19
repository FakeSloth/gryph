import React from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import hashColor from '../hashColor';
import * as Actions from '../actions';
import {BEFORE_CHOOSE_NAME, DURING_CHOOSE_NAME, AFTER_CHOOSE_NAME} from '../constants/chooseName';

const Name = ({chooseName, username, actions}) => {
  let formBody;
  let input;

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
          const name = input.value.trim();
          if (!name) return;
          if (name.length > 19) return;
          actions.setChooseName(AFTER_CHOOSE_NAME);
          actions.setUsername(name);
        }}
      >
        <div className="form-group">
          <input
            type="text"
            className="form-control"
            placeholder="Username"
            ref={(node) => {
              input = node;
            }}
          />
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
          <li><a href="#" onClick={() => actions.setChooseName(DURING_CHOOSE_NAME)}>Choose Name</a></li>
          <li><a href="#" onClick={null}>Login/Register</a></li>
        </ul>
      </li>
    </ul>);
  }

  return formBody;
};

function mapStateToProps(state) {
  return {
    chooseName: state.name.chooseName,
    username: state.name.username
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
