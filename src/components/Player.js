import React, {Component} from 'react';
import YouTube from 'react-youtube';

class Player extends Component {
  constructor(props) {
    super(props);

    this.onPlay = this.onPlay.bind(this);
  }

  onPlay(e) {
    const player = e.target;
    console.log(this.props.allowSeek);
    if (this.props.allowSeek) {
      player.seekTo((Date.now()-this.props.start)/1000, true);
      this.props.setAllowSeekToFalse();
    }
  }

  render() {
    const opts = {
      playerVars: { // https://developers.google.com/youtube/player_parameters
        autoplay: 1,
        fs: 0,
        rel: 0,
        modestbranding: 1
      }
    };

    return (
      <div className="embed-responsive embed-responsive-16by9">
        <YouTube
          className="embed-responsive-item"
          videoId={this.props.video}
          onPlay={this.onPlay}
          onPause={this.props.onPause}
          opts={opts}
        />
      </div>
    );
  }
}

export default Player;
