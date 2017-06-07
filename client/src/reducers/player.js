import {START_NEXT_VIDEO, SET_ALLOW_SEEK, SET_WAIT_LIST} from '../constants/ActionTypes';
import {JOIN_WAIT_LIST} from '../constants/waitList';

const initialState = {
  allowSeek: true,
  host: '',
  start: 0,
  videoId: '',
  waitList: JOIN_WAIT_LIST
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
    case SET_WAIT_LIST:
      return Object.assign({}, state, {
        waitList: action.waitList
      });
    default:
      return state;
  }
}

export default player;
