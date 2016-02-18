import {SET_USERNAME,
        REMOVE_USERNAME,
        BEFORE_CHOOSE_NAME,
        DURING_CHOOSE_NAME,
        AFTER_CHOOSE_NAME} from '../constants/ActionTypes';

// Note: MOVE chooseName to its own reducer and have action SET_CHOOSE_NAME!
function name(state = {name: '', chooseName: BEFORE_CHOOSE_NAME}, action) {
  switch (action.type) {
    case SET_USERNAME:
      return Object.assign({}, state, {name: action.name});
    case REMOVE_USERNAME:
      return Object.assign({}, state, {name: ''});
    case BEFORE_CHOOSE_NAME:
      return Object.assign({}, state, {chooseName: action.type});
    case DURING_CHOOSE_NAME:
      return Object.assign({}, state, {chooseName: action.type});
    case AFTER_CHOOSE_NAME:
      return Object.assign({}, state, {chooseName: action.type});
    default:
      return state;
  }
}

export default name;
