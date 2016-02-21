import {ADD_MESSAGE, UPDATE_MESSAGES} from '../constants/ActionTypes';

function messages(state = [], action) {
  switch (action.type) {
    case ADD_MESSAGE:
      return [
        ...state,
        action.message
      ];
    case UPDATE_MESSAGES:
      return action.messages;
    default:
      return state;
  }
}

export default messages;
