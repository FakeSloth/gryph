import React from 'react';

function PlaylistAdd({playlistNames, video, onChange, playlist, add}) {
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
      <button
        className="btn btn-default"
        onClick={() => {
          console.log(playlist, video)
          add(playlist, video);
        }}
      >
        Add
      </button>
    </div>
  );
}

export default PlaylistAdd;
