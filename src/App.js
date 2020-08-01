import React from 'react';
import logo from './logo.svg';
import './App.css';

import RouteComponent from './components/RouteComponent/RouteComponent';

function App() {
  return (
    <div className="App">
      {/* <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Learnink Create Question
        </p>
      </header> */}
      <div className="container body">
        <div className="main_container">
          <RouteComponent/>
        </div>
      </div>
    </div>
  );
}

export default App;
