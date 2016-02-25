import {START_NEXT_VIDEO, DISABLE_ALLOW_SEEK} from '../constants/ActionTypes';

const initialState = {
  allowSeek: false,
  host: '',
  start: 0,
  videoId: ''
};

function player(state = initialState, actions) {
  switch (actions.type) {
    case START_NEXT_VIDEO:
      return Object.assign({}, state, actions.video);
    case DISABLE_ALLOW_SEEK:
      return Object.assign({}, state, {
        allowSeek: actions.allowSeek
      });
    default:
      return state;
  }
}

export default player;
