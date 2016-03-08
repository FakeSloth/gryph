import React, {PropTypes} from 'react';

const PlaylistInput = ({username, placeholder, onSubmit, clear}) => {
  let input;

  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      const text = input.value.trim();
      if (!text) return;
      if (!username) return;
      if (text.length > 300) return;
      onSubmit(text);
      if (clear) input.text = '';
    }}>
      <input type="text"
             className="form-control"
             placeholder={placeholder}
             ref={(node) => {
               input = node;
             }} />
    </form>
  );
};

export default PlaylistInput;
