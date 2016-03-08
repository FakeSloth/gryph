import {
  SET_SEARCH_VIDEOS,
  CREATE_PLAYLIST,
  DELETE_PLAYLIST,
  ADD_TO_PLAYLIST,
  SET_PLAYLISTS
} from '../constants/ActionTypes';
import {omit} from 'lodash';

const initialState = {
  videos: [],
  playlists: {}
};

function player(state = initialState, action) {
  switch (action.type) {
    case SET_SEARCH_VIDEOS:
      return Object.assign({}, state, {
        videos: action.videos
      });
    case CREATE_PLAYLIST:
      if (state.playlists.hasOwnProperty(action.name)) {
        return state;
      } else {
        return Object.assign({}, state, {
          playlists: Object.assign({}, state.playlists, {
            [action.name]: []
          })
        });
      }
    case DELETE_PLAYLIST:
      if (!state.playlists.hasOwnProperty(action.name)) {
        return state;
      } else {
        return Object.assign({}, state, {
          playlists: omit(state.playlists, action.name)
        });
      }
    case ADD_TO_PLAYLIST:
      if (!state.playlists[action.name]) {
        return state;
      } else {
        return Object.assign({}, state, {
          playlists: Object.assign({}, state.playlists, {
            [action.name]: [
              ...state.playlists[action.name],
              action.video
            ]
          })
        });
      }
    case SET_PLAYLISTS:
      return Object.assign({}, state, {
        playlists: action.playlists
      });
    default:
      return state;
  }
}

export default player;
