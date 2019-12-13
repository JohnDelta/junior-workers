import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";
import './App.css';
import Home from './Home.js';
import Profil from './Profil.js';

class App extends React.Component{
  render() {
    return(
      <Router>
        <div className="App">
          <Switch>
            <Route exact path="/profil">
              <Profil />
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
