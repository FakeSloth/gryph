import React, {Component} from 'react';
import PlaylistSelect from './PlaylistSelect';

class PlaylistVideos extends Component {
  render() {
    const {videos, playlists, playlistNames, add, playlist, onChange, remove} = this.props;

    const videolist = videos.map((video, index) => (
      <div className="media" key={index}>
        <div className="media-left">
          <a href={video.url}>
            <img
              className="media-object"
              src={video.image}
              alt={video.title}
              width={150}
              height={100}
            />
          </a>
        </div>
        <div className="media-body">
          <h4 className="media-heading">
            <a href={video.url}>
              {video.title}
            </a>
          </h4>
          <p>Duration: <em>{video.duration}</em></p>
          {playlistNames.length ?
            <PlaylistSelect
              playlistNames={playlistNames}
              playlists={playlists}
              video={video}
              onChange={onChange}
              playlist={playlist}
              add={add}
              remove={remove}
            />
            : <p className="text-info">Create a playlist to add a video.</p>}
        </div>
      </div>
    ));

    return (<div>{videolist}</div>);
  }
}

export default PlaylistVideos;
