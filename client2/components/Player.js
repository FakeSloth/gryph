import React, {PropTypes} from 'react';
import Video from './Video';
import VideoInput from './VideoInput';
import WaitList from './WaitList';
import hashColor from '../../hashColor';

const Player = (props) => {
  const {videoId, host} = props.video;

  return (
    <div className="col-md-7">
      {videoId ? (
        <div>
          <Video video={props.video} setAllowSeek={props.setAllowSeek} />
          <p>
            <strong>
              Host: <span style={{color: hashColor(host)}}>{host}</span>
            </strong>
          </p>
        </div>
      ) : (
        <div className="jumbotron">
          <h1>No video is playing.</h1>
        </div>
      )}
      <VideoInput {...props} />
      <WaitList {...props} />
    </div>
  );
};

Player.propTypes = {
  addMessage: PropTypes.func.isRequired,
  addVideo: PropTypes.func.isRequired,
  emitPlaylist: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  playlist: PropTypes.string.isRequired,
  playlistNames: PropTypes.array.isRequired,
  playlists: PropTypes.object.isRequired,
  setAllowSeek: PropTypes.func.isRequired,
  setWaitList: PropTypes.func.isRequired,
  username: PropTypes.string.isRequired,
  video: PropTypes.shape({
    allowSeek: PropTypes.bool.isRequired,
    host: PropTypes.string.isRequired,
    start: PropTypes.number.isRequired,
    videoId: PropTypes.string.isRequired
  }).isRequired,
  waitList: PropTypes.string.isRequired
};

export default Player;
