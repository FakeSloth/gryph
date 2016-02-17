import React from 'react';
import {connect} from 'react-redux';
import Navbar from '../components/Navbar';
import Dispatcher from '../components/Dispatcher';

const App = ({children, dispatch}) => {
  return (
    <div>
      <Navbar />
      <div className="container-fluid">
        <Dispatcher dispatch={dispatch}>
          {children}
        </Dispatcher>
      </div>
    </div>
  );
};

export default connect()(App);
