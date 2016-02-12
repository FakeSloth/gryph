import React, {Component} from 'react';
import YouTube from 'react-youtube';

class Player extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const opts = {
      playerVars: { // https://developers.google.com/youtube/player_parameters
        autoplay: 1,
        fs: 0,
        rel: 0,
        modestbranding: 1,
      }
    };

    return (
      <div className="embed-responsive embed-responsive-16by9">
        <YouTube
          className="embed-responsive-item"
          videoId={this.props.video}
          onEnd={this.props.onEnd}
          opts={opts}
        />
      </div>
    );
  }
}

export default Player;
