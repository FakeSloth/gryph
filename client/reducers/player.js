import {START_NEXT_VIDEO, SET_ALLOW_SEEK} from '../constants/ActionTypes';

const initialState = {
  allowSeek: true,
  host: '',
  start: 0,
  videoId: ''
};

function player(state = initialState, actions) {
  switch (actions.type) {
    case START_NEXT_VIDEO:
      return Object.assign({}, state, {
        videoId: actions.videoId,
        host: actions.host,
        start: actions.start
      });
    case SET_ALLOW_SEEK:
      return Object.assign({}, state, {
        allowSeek: actions.allowSeek
      });
    default:
      return state;
  }
}

export default player;
