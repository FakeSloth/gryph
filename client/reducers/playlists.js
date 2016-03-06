import {SET_SEARCH_VIDEOS} from '../constants/ActionTypes';

const initialState = {
  videos: []
};

function player(state = initialState, action) {
  switch (action.type) {
    case SET_SEARCH_VIDEOS:
      return Object.assign({}, state, {
        videos: action.videos
      });
    default:
      return state;
  }
}

export default player;
