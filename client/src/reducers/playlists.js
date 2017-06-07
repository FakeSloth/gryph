import {
  SET_SEARCH_VIDEOS,
  CREATE_PLAYLIST,
  DELETE_PLAYLIST,
  ADD_TO_PLAYLIST,
  REMOVE_FROM_PLAYLIST,
  SET_PLAYLISTS
} from '../constants/ActionTypes';
import {omit, filter} from 'lodash';

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
    case SET_PLAYLISTS:
      return Object.assign({}, state, {
        playlists: action.playlists
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
      if (!state.playlists.hasOwnProperty(action.name)) {
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
    case REMOVE_FROM_PLAYLIST:
      if (!state.playlists.hasOwnProperty(action.name)) {
        return state;
      } else {
        const playlist = state.playlists[action.name];
        return Object.assign({}, state, {
          playlists: Object.assign({}, state.playlists, {
            [action.name]: filter(playlist, video => video.url !== action.url)
          })
        });
      }
    default:
      return state;
  }
}

export default player;
