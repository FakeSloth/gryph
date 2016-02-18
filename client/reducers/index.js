import {combineReducers} from 'redux';
import messages from './messages';
import name from './name';

const rootReducer = combineReducers({
  messages,
  name
});

export default rootReducer;
