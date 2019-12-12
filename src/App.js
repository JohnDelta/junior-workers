import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";
import './App.css';
import Navbar from './Navbar.js';
import Home from './Home.js';
import Profil from './Profil.js';

class App extends React.Component{
  render() {
    return(
      <Router>
        <div className="App">
          <Switch>
            <Route exact path="/about">
              <About />
            </Route>

            <Route exact path="/users">
              <Users />
            </Route>

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

function About() {
  return <h2>About</h2>;
}

function Users() {
  return <h2>Users</h2>;
}

export default App;
