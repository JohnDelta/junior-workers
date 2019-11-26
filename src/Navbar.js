import React from 'react';
import {
  BrowserRouter as Router,
  Link
} from "react-router-dom";
import './App.css';

class Navbar extends React.Component{
  render() {
    return(
      <div className="Navbar">
        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/about">About</Link>
            </li>
            <li>
              <Link to="/users">Users</Link>
            </li>
          </ul>
        </nav>
      </div>
    );
  }
}

export default Navbar;
