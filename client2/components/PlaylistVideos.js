import React, {PropTypes} from 'react';
import PlaylistSelect from './PlaylistSelect';

function PlaylistVideos(props) {
  const {playlistNames, videos} = props;

  const videolist = videos.map((video, index) => (
    <div className="media" key={index}>
      <div className="media-left">
        <a href={video.url}>
          <img
            className="media-object"
            src={video.image}
            alt={video.title}
            width={170}
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
          <PlaylistSelect {...props} video={video} />
          : <p className="text-info">Create a playlist to add a video.</p>}
      </div>
    </div>
  ));

  return <div>{videolist}</div>;
}

PlaylistVideos.propTypes = {
  add: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  playlist: PropTypes.string.isRequired,
  playlists: PropTypes.object.isRequired,
  playlistNames: PropTypes.array.isRequired,
  remove: PropTypes.func.isRequired,
  save: PropTypes.func.isRequired,
  videos: PropTypes.array.isRequired
};

export default PlaylistVideos;
