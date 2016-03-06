import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {Tabs, Tab} from 'react-bootstrap';
import fetch from 'isomorphic-fetch';
import * as Actions from '../actions';
import PlaylistInput from '../components/PlaylistInput';
import Videos from '../components/Videos';

class Playlists extends Component  {
  constructor(props) {
    super(props);

    this.state = {active: 0};
  }

  searchVideos(term) {
    const {actions} = this.props;

    fetch('/search', {
      method: 'post',
      credentials: 'include',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        term,
        token: localStorage.getItem('token')
      })
    })
    .then((response) => response.json())
    .then((res) => {
      actions.setSearchVideos(res.videos);
      this.setState({active: 1});
    })
    .catch(error => console.error(error));
  }

  render() {
    const {username, videos} = this.props;

    return (
      <div>
        <PlaylistInput
          username={username}
          searchVideos={(term) => this.searchVideos(term)}
        />
        <br />
        <Tabs
          defaultActiveKey={1}
          position="left"
          tabWidth={3}
          activeKey={this.state.active}
          onSelect={(key) => {
            this.setState({active: key});
          }}
        >
          <Tab eventKey={1} title="Search Results">
            {videos.length ?
              <Videos videos={videos} /> :
              <h1>No Search Results</h1>}
          </Tab>
          <Tab eventKey={2} title="Tab 2">Tab 2 content</Tab>
          <Tab eventKey={3} title="Tab 3" disabled>Tab 3 content</Tab>
        </Tabs>
        <br />
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    username: state.name.username,
    videos: state.playlists.videos
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(Actions, dispatch)
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Playlists);
