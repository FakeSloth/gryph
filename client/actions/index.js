import * as types from '../constants/ActionTypes';

function createAction(type, paramName) {
  return function(param) {
    return {
      type,
      [paramName]: param,
    };
  };
}

export const addMessage = createAction(types.ADD_MESSAGE, 'message');
export const updateMessages = createAction(types.UPDATE_MESSAGES, 'messages');
export const setUsername = createAction(types.SET_USERNAME, 'name');
export const setChooseName = createAction(types.SET_CHOOSE_NAME, 'chooseName');
export const updateUserList = createAction(types.UPDATE_USER_LIST, 'users');
export const setAllowSeek = createAction(types.SET_ALLOW_SEEK, 'allowSeek');
export const setSearchVideos = createAction(types.SET_SEARCH_VIDEOS, 'videos');
export const setPlaylists = createAction(types.SET_PLAYLISTS, 'playlists');
export const createPlaylist = createAction(types.CREATE_PLAYLIST, 'name');
export const deletePlaylist = createAction(types.DELETE_PLAYLIST, 'name');
export const setWaitList = createAction(types.SET_WAIT_LIST, 'waitList');

export function startNextVideo(videoId, host, start) {
  return {
    type: types.START_NEXT_VIDEO,
    videoId,
    host,
    start
  };
}

export function addToPlaylist(name, video) {
  return {
    type: types.ADD_TO_PLAYLIST,
    name,
    video
  };
}

export function removeFromPlaylist(name, url) {
  return {
    type: types.REMOVE_FROM_PLAYLIST,
    name,
    url
  };
}
