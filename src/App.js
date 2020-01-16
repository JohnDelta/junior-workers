import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";
import './App.css';
import Home from './Home.js';
import MyCandidateProfil from './MyCandidateProfil.js';
import MyHirerProfil from './MyHirerProfil.js';
import CandidateProfil from './CandidateProfil.js';
import HirerProfil from './HirerProfil.js';
import Search from './Search.js';

class App extends React.Component{
  render() {
    return(
      <Router>
        <div className="App">
          <Switch>
            <Route exact path="/my-candidate-profil">
              <MyCandidateProfil />
            </Route>
            <Route exact path="/my-hirer-profil">
              <MyHirerProfil />
            </Route>
            <Route exact path="/search">
              <Search />
            </Route>
            <Route exact path="/candidate-profil">
              <CandidateProfil />
            </Route>
            <Route exact path="/hirer-profil">
              <HirerProfil />
            </Route>
            <Route path="/">
              <Home />
            </Route>
          </Switch>
        </div>
      </Router>
    );
  }
}

export default App;
