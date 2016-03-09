import React from 'react';
import {some} from 'lodash';

function PlaylistSelect({playlistNames, video, onChange, playlist, add, remove, playlists, save}) {
  return (
    <div className="form-group form-inline">
      <select
        className="form-control"
        value={playlist}
        onChange={(e) => onChange(e.target.value)}
      >
        {playlistNames.map((name, index) => (
          <option value={name} key={index}>{name}</option>
        ))}
      </select>
      {' '}
      {some(playlists[playlist], {url: video.url}) ?
      (<button
          className="btn btn-danger"
          onClick={() => {
            console.log(video, video.url);
            remove(playlist, video.url);
            setTimeout(() => save(), 5000);
          }}
        >
          Remove
        </button>) : (
        <button
          className="btn btn-default"
          onClick={() => {
            add(playlist, video);
            setTimeout(() => save(), 5000);
          }}
        >
            Add
        </button>)}
    </div>
  );
}

export default PlaylistSelect;
