import React from 'react';

function Videos({videos}) {
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
      </div>
    </div>
  ));

  return (<div>{videolist}</div>);
}

export default Videos;
