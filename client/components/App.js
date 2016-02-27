import React, {PropTypes} from 'react';
import Navbar from '../containers/Navbar';

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

App.propTypes = {
  children: PropTypes.element.isRequired
};

export default App;
