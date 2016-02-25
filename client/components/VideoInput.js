import React from 'react';

const VideoInput = ({addMessage, addVideo, username}) => {
  let input;

  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      if (!username) {
        return addMessage({
          text: 'Choose a username to add a video.'
        });
      }
      const url = input.value.trim();
      const parts = url.split('=');
      const error = {text: 'Invalid video url.', className: 'text-danger'};
      if (parts.length < 2) return addMessage(error);
      const videoId = parts[1].trim();
      if (!videoId || videoId.length > 300) return addMessage(error);
      addVideo(videoId);
      input.value = '';
    }}>
      <div className="row">
        <div className="col-md-10">
          <input type="text"
                 className="form-control"
                 placeholder="YouTube Video Url"
                 ref={(node) => {
                   input = node;
                 }} />
        </div>
        <div className="col-md-2">
          <button type="submit" className="btn btn-primary">Add Video</button>
        </div>
      </div>
    </form>
  );
};

export default VideoInput;
