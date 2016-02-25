import React from 'react';
import VideoInput from './VideoInput';

const Player = (props) => {
  return (
    <div className="col-md-7">
      <VideoInput {...props} />
    </div>
  );
}

export default Player;
