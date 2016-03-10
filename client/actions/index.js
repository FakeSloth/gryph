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

export function startNextVideo(videoId, host, start) {
  return {
    type: types.START_NEXT_VIDEO,
    videoId,
    host,
    start
  };
}

export function setAllowSeek(allowSeek) {
  return {
    type: types.SET_ALLOW_SEEK,
    allowSeek
  };
}

export function setSearchVideos(videos) {
  return {
    type: types.SET_SEARCH_VIDEOS,
    videos
  };
}

export function setPlaylists(playlists) {
  return {
    type: types.SET_PLAYLISTS,
    playlists
  };
}

export function createPlaylist(name) {
  return {
    type: types.CREATE_PLAYLIST,
    name
  };
}

export function deletePlaylist(name) {
  return {
    type: types.DELETE_PLAYLIST,
    name
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

export function setWaitList(waitList) {
  return {
    type: types.SET_WAIT_LIST,
    waitList
  };
}
