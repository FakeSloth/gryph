import React from 'react';
import Video from './Video';
import VideoInput from './VideoInput';

const Player = (props) => {
  return (
    <div className="col-md-7">
      {props.video.videoId ? (
        <Video video={props.video} setAllowSeek={props.setAllowSeek} />
      ) : (
        <div className="jumbotron"><h1>No video is playing.</h1></div>
      )}
      <br />
      <VideoInput {...props} />
    </div>
  );
}

export default Player;
