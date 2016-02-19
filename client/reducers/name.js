import {SET_USERNAME, SET_CHOOSE_NAME, UPDATE_USER_LIST} from '../constants/ActionTypes';
import {BEFORE_CHOOSE_NAME} from '../constants/chooseName';

const initialState = {
  username: '',
  chooseName: BEFORE_CHOOSE_NAME,
  userList: []
};

function name(state = initialState, action) {
  switch (action.type) {
    case SET_USERNAME:
      return Object.assign({}, state, {username: action.name});
    case SET_CHOOSE_NAME:
      return Object.assign({}, state, {chooseName: action.chooseName});
    case UPDATE_USER_LIST:
      return Object.assign({}, state, {userList: action.users});
    default:
      return state;
  }
}

export default name;
