import * as types from '../constants/ActionTypes';

export function addMessage(message) {
  return {
    type: types.ADD_MESSAGE,
    message
  };
}

export function updateMessages(messages) {
  return {
    type: types.UPDATE_MESSAGES,
    messages
  };
}

export function setUsername(name) {
  return {
    type: types.SET_USERNAME,
    name
  };
}

export function setChooseName(chooseName) {
  return {
    type: types.SET_CHOOSE_NAME,
    chooseName
  };
}

export function updateUserList(users) {
  return {
    type: types.UPDATE_USER_LIST,
    users
  };
}
