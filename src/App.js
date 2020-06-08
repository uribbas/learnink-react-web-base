import React from 'react';
import logo from './logo.svg';
import './App.css';

import CreateQuestion from './components/CreateQuestion2/CreateQuestion';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Learnink Create Question
        </p>
      </header>
      <div className="container body">
        <div className="main_container">
          <CreateQuestion/>
        </div>
      </div>
    </div>
  );
}

export default App;
