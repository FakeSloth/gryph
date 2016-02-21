import React from 'react';
import Navbar from './Navbar';

const App = ({children}) => {
  return (
    <div>
      <Navbar />
      <div className="container-fluid">
        {children}
      </div>
    </div>
  );
};

export default App;
