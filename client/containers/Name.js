import React from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import hashColor from '../hashColor';
import * as Actions from '../actions';
import * as types from '../constants/ActionTypes';

const Name = ({chooseName, name, actions}) => {
  let formBody;
  let input;

  if (chooseName === types.BEFORE_CHOOSE_NAME) {
    formBody = (
      <form
        className="navbar-form navbar-right"
        onSubmit={e => e.preventDefault()}
      >
        <button
          onClick={() => actions.setChooseName(types.DURING_CHOOSE_NAME)}
          className="btn btn-primary"
        >
          Choose Name
        </button>
      </form>
    );
  } else if (chooseName === types.DURING_CHOOSE_NAME) {
    formBody = (
      <form
        className="navbar-form navbar-right"
        onSubmit={(e) => {
          e.preventDefault();
          const username = input.value.trim();
          if (!username) return;
          if (username.length > 19) return;
          actions.setChooseName(types.AFTER_CHOOSE_NAME);
          actions.setUsername(username);
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
  } else if (chooseName === types.AFTER_CHOOSE_NAME) {
    formBody = (<ul className="nav navbar-nav navbar-right">
      <li className="dropdown">
        <a href="#" className="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">
          <strong style={{color: hashColor(name)}}>{name}</strong>{' '}
          <span className="caret"></span>
        </a>
        <ul className="dropdown-menu">
          <li><a href="#" onClick={null}>Choose Name</a></li>
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
    name: state.name.name
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
