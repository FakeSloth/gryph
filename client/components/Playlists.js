import React, {Component} from 'react';
import {Tabs, Tab} from 'react-bootstrap';
import PlaylistInput from './PlaylististInput';

class Playlists extends Componet  {
  render() {
    return (
      <div>

        <Tabs defaultActiveKey={2} position="left" tabWidth={3}>
          <Tab eventKey={1} title="Tab 1">Tab 1 content</Tab>
          <Tab eventKey={2} title="Tab 2">Tab 2 content</Tab>
          <Tab eventKey={3} title="Tab 3" disabled>Tab 3 content</Tab>
        </Tabs>
      </div>
    );
  }
};

export default Playlists;
