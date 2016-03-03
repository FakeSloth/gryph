import React from 'react';
import {render} from 'react-dom';
import io from 'socket.io-client';
import Root from './containers/Root';
import configureStore from './store/configureStore';

const socket = io();
global.socket = socket;

const store = configureStore();

render(
  <Root store={store} />,
  document.getElementById('root')
);
