import {combineReducers} from 'redux';
import messages from './messages';
import name from './name';
import player from './player';
import playlists from './playlists';

const rootReducer = combineReducers({
  messages,
  name,
  player,
  playlists
});

export default rootReducer;
