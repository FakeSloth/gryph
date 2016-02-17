import {ADD_MESSAGE} from '../constants/ActionTypes';

function messages(state = [], action) {
  switch (action.type) {
    case ADD_MESSAGE:
      return [
        ...state,
        {
          text: action.text
        }
      ];
    default:
      return state;
  }
}

export default messages;
