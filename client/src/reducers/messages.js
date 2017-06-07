import {ADD_MESSAGE, UPDATE_MESSAGES} from '../constants/ActionTypes';

function messages(state = [], action) {
  switch (action.type) {
    case ADD_MESSAGE:
      return [
        ...state,
        action.message
      ];
    case UPDATE_MESSAGES:
      return [
        ...action.messages,
        {
          text: `
            <div class="text-center welcome">
              <h4>Welcome to gryph!</h3>
              <p>A video sharing chat application. (Plug.dj clone)</p>
              <p><strong>Update: </strong>Playlists are added! - CreaturePhil</p>
            </div>
          `,
          html: true
        }
      ];
    default:
      return state;
  }
}

export default messages;
