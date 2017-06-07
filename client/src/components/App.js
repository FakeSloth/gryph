import React, {PropTypes} from 'react';
import Navigation from '../containers/Navigation';

const App = ({children}) => {
  return (
    <div>
      <Navigation />
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
