import React from 'react';
import YouTube from 'react-youtube';

const Video = ({video, setAllowSeek}) => {
  const opts = {
    playerVars: {
      autoplay: 1,
      fs: 0,
      rel: 0,
      modestbranding: 1
    }
  };
  console.log(video)

  return (
    <div className="embed-responsive embed-responsive-16by9">
      <YouTube
        className="embed-responsive-item"
        videoId={video.videoId}
        opts={opts}
        onPlay={(e) => {
          const player = e.target;
          if (video.allowSeek) {
            const diff = Date.now() - video.start;
            const seconds = diff / 1000;
            player.seekTo(seconds, true);
            setAllowSeek(false);
          }
        }}
        onPause={() => setAllowSeek(true)}
      />
    </div>
  );
};

export default Video;
