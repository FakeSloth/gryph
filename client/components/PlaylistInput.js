import React, {PropTypes} from 'react';

const PlaylistInput = ({username, searchVideos}) => {
  let input;

  return (
    <div className="row">
      <div className="col-md-2"></div>
      <div className="col-md-10">
        <form onSubmit={(e) => {
          e.preventDefault();
          const text = input.value.trim();
          if (!text) return;
          if (!username) return;
          if (text.length > 300) return;
          searchVideos(text);
        }}>
          <input type="text"
                 className="form-control"
                 placeholder="Search YouTube Videos"
                 ref={(node) => {
                   input = node;
                 }} />
        </form>
      </div>
    </div>
  );
};

export default PlaylistInput;
