import {START_NEXT_VIDEO, SET_ALLOW_SEEK} from '../constants/ActionTypes';

const initialState = {
  allowSeek: true,
  host: '',
  start: 0,
  videoId: ''
};

function player(state = initialState, action) {
  switch (action.type) {
    case START_NEXT_VIDEO:
      return Object.assign({}, state, {
        videoId: action.videoId,
        host: action.host,
        start: action.start
      });
    case SET_ALLOW_SEEK:
      return Object.assign({}, state, {
        allowSeek: action.allowSeek
      });
    default:
      return state;
  }
}

export default player;
