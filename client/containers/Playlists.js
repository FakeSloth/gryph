import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {Tabs, Tab, Modal, Button} from 'react-bootstrap';
import fetch from 'isomorphic-fetch';
import * as Actions from '../actions';
import PlaylistInput from '../components/PlaylistInput';
import PlaylistVideos from '../components/PlaylistVideos';

class Playlists extends Component  {
  constructor(props) {
    super(props);

    this.state = {activeKey: 1, showModal: false, playlist: ''};
  }

  handleChange(name) {
    this.setState({playlist: name});
  }

  close() {
    this.setState({showModal: false});
  }

  open() {
    this.setState({showModal: true});
  }

  searchVideos(term) {
    const {actions, playlistNames} = this.props;

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
      this.setState({activeKey: 1});
    })
    .catch(error => console.error(error));
  }

  render() {
    const {username, videos, actions, playlists, playlistNames} = this.props;

    return (
      <div>
        <div className="row">
          <div className="col-md-2 text-center">
            <Button
              bsStyle="primary"
              onClick={() => this.open()}
            >
              Create Playlist
            </Button>
          </div>
          <div className="col-md-10">
            <PlaylistInput
              username={username}
              onSubmit={(term) => this.searchVideos(term)}
              placeholder="Search YouTube Videos"
            />
          </div>
        </div>
        <Modal show={this.state.showModal} onHide={() => this.close()}>
          <Modal.Header closeButton>
            <Modal.Title>Create Playlist</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <PlaylistInput
              username={username}
              onSubmit={(name) => {
                actions.createPlaylist(name);
                this.close();
              }}
              placeholder="Playlist name"
            />
          </Modal.Body>
        </Modal>
        <br />
        <Tabs
          position="left"
          activeKey={this.state.activeKey}
          onSelect={(key) => {
            this.setState({activeKey: key});
          }}
        >
          <Tab eventKey={1} title="Search Results">
            {videos.length ?
              (<PlaylistVideos
                videos={videos}
                playlists={playlists}
                playlistNames={playlistNames}
                playlist={this.state.playlist || (playlistNames.length ? playlistNames[0] : '')}
                onChange={(name) => this.handleChange(name)}
                add={actions.addToPlaylist}
                remove={actions.removeFromPlaylist} />) :
              <h1>No Search Results</h1>}
          </Tab>
          {Object.keys(playlists).map((name, index) => (
            <Tab eventKey={index+2} title={name} key={index}>
              <div className="row">
                <div className="col-md-10">
                  <h1 style={{lineHeight: 0}}>{name}</h1>
                </div>
                <div className="col-md-2">
                  <button
                    className="btn btn-danger"
                    onClick={() => actions.deletePlaylist(name)}
                  >
                    Delete
                  </button>
                </div>
              </div>
              <PlaylistVideos
                videos={playlists[name]}
                playlists={playlists}
                playlistNames={playlistNames}
                playlist={this.state.playlist || (playlistNames.length ? playlistNames[0] : '')}
                onChange={(name) => this.handleChange}
                add={actions.addToPlaylist}
                remove={actions.removeFromPlaylist} />
            </Tab>
          ))}
        </Tabs>
        <br />
      </div>
    );
  }
}

function mapStateToProps(state) {
  console.log(state.playlists.playlists);
  return {
    username: state.name.username,
    playlists: state.playlists.playlists,
    videos: state.playlists.videos,
    playlistNames: Object.keys(state.playlists.playlists)
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
