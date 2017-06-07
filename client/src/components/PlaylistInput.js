import React, {PropTypes} from 'react';

const PlaylistInput = ({username, placeholder, onSubmit}) => {
  let input;

  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      const text = input.value.trim();
      if (!text) return;
      if (!username) return;
      if (text.length > 300) return;
      onSubmit(text);
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

PlaylistInput.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  placeholder: PropTypes.string.isRequired,
  username: PropTypes.string.isRequired
};

export default PlaylistInput;
