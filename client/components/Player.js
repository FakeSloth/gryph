import React, {PropTypes} from 'react';
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
};

Player.propTypes = {
  addMessage: PropTypes.func.isRequired,
  addVideo: PropTypes.func.isRequired,
  setAllowSeek: PropTypes.func.isRequired,
  username: PropTypes.string.isRequired,
  video: PropTypes.shape({
    allowSeek: PropTypes.bool.isRequired,
    host: PropTypes.string.isRequired,
    start: PropTypes.number.isRequired,
    videoId: PropTypes.string.isRequired
  }).isRequired
};

export default Player;
