import React, {Component} from 'react';
import {hashColor} from '../utils';

class VideoHistoryList extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const length = this.props.videos.length;
    const list = this.props.videos.map((video, index) => (
      <div className="media">
        <div className="media-left">
          <a href={video.url}>
            <img className="media-object" src={video.img} alt={video.title} />
          </a>
        </div>
        <div className="media-body">
          <h4 className="media-heading">
            {length - index}. <a href={video.url}>
              {video.title}
            </a>
          </h4>
          <p><strong>Published {video.publishedAt}</strong></p>
          <p>
            Channel: <a href={video.channel}>{video.author}</a>{' | '}
            Duration: <em>{video.duration}</em>{' | '}
            Host: <strong style={{color: hashColor(video.host)}}>{video.host}</strong>
          </p>
        </div>
      </div>
    ));
    let style = {'overflow-y': 'auto', 'height': '40vh'};
    if (this.props.isPlaying) {
      style = {'overflow-y': 'auto', 'height': '10vh'};
    }
    return (
      <div ref="list">
        {this.props.videos.length ? (
          <div>
            <h5><b>Video History</b></h5>
            <div className="panel panel-default" style={style}>
              <div className="panel-body">
                <div>
                  {list}
                </div>
              </div>
            </div>
          </div>
        ) : ''}
      </div>
    );
  }
}

export default VideoHistoryList;
