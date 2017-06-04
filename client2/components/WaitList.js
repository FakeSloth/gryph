import React, {PropTypes} from 'react';
import {Button} from 'react-bootstrap';
import {JOIN_WAIT_LIST, CHOOSE_PLAYLIST, LEAVE_WAIT_LIST} from '../constants/waitList';

function WaitList({emitPlaylist, onChange, playlist, playlistNames, playlists, setWaitList, username, waitList}) {
  let uiState;

  if (!username || !playlistNames.length) {
    return <div></div>;
  }

  if (waitList === JOIN_WAIT_LIST) {
    uiState = (
      <Button bsStyle="info" bsSize="large" onClick={() => setWaitList(CHOOSE_PLAYLIST)}>
        <span className="glyphicon glyphicon-user" style={{marginRight: '10px'}}></span>
        Join Wait list
      </Button>
    );
  } else if (waitList === CHOOSE_PLAYLIST) {
    uiState = (
      <div>
        <div className="form-inline">
          <h3 style={{
            display: 'inline',
            marginRight: '5px',
            verticalAlign: 'middle'
          }}>
            Choose a playlist:
          </h3>
          <select
            className="form-control"
            value={playlist}
            onChange={(e) => onChange(e.target.value)}
          >
            {playlistNames.map((name, index) => (
              <option value={name} key={index}>{name}</option>
            ))}
          </select>
        </div>
        <Button
          bsStyle="primary"
          onClick={() => {
            emitPlaylist(playlists[playlist]);
            setWaitList(LEAVE_WAIT_LIST);
          }}
        >
          <span className="glyphicon glyphicon-headphones" style={{marginRight: '5px'}}></span>
          {' '}
          Select playlist
        </Button>
      </div>
    );
  } else if (waitList === LEAVE_WAIT_LIST) {
    uiState = (
      <Button
        bsStyle="warning"
        bsSize="large"
        onClick={() => {
          emitPlaylist();
          setWaitList(JOIN_WAIT_LIST);
        }}
      >
        <span className="glyphicon glyphicon-remove" style={{marginRight: '5px'}}></span>
        {' '}
        Leave Wait list
      </Button>
    );
  }

  return (
    <div className="container">
      <br />
      {uiState}
    </div>
  );
}

WaitList.propTypes = {
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

export default WaitList;
