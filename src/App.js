import React from 'react';
import SearchBox from './Components/SearchBox';
import './css/style.css';

function App() {
  return (
    <div className="App">
      <header className="header">
        <h1 className="header__text-box">Github API</h1>
        <img src="/github.png" alt="github" className="header__logo"/>
      </header>

      <SearchBox></SearchBox>

    </div>
  );
}

export default App;
