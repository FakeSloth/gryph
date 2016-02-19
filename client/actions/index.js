import * as types from '../constants/ActionTypes';

export function addMessage(text) {
  return {
    type: types.ADD_MESSAGE,
    text
  };
};

export function emitMessage(text, socket) {
  return (dispatch, getState) => {
    socket.emit('chat message', {text});
  };
};

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
