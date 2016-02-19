import {ADD_MESSAGE} from '../constants/ActionTypes';

function messages(state = [], action) {
  switch (action.type) {
    case ADD_MESSAGE:
      return [
        ...state,
        action.message
      ];
    default:
      return state;
  }
}

export default messages;
