import {combineReducers} from 'redux';
import messages from './messages';
import name from './name';
import player from './player';

const rootReducer = combineReducers({
  messages,
  name,
  player
});

export default rootReducer;
