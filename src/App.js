import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";
import './App.css';
import Home from './Home.js';
import MyProfil from './MyProfil.js';
import Search from './Search.js';

class App extends React.Component{
  render() {
    return(
      <Router>
        <div className="App">
          <Switch>
            <Route exact path="/my-profil">
              <MyProfil />
            </Route>
            <Route exact path="/search">
              <Search />
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
