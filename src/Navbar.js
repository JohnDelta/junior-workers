import React from 'react';
import {
  BrowserRouter as Router,
  Link
} from "react-router-dom";
import './Navbar.css';

class Navbar extends React.Component{
  
  render() {
    var linkActive = {color: "#fff1c1"};

    return(
      <div className="Navbar">
        <ul className="nav-links">
          <li className="nav-link">
            <i className="fa fa-home link-active" />
            <Link className="text link-active" to="/">
              Home
            </Link>
          </li>
          <li className="nav-link">
            <i className="fa fa-user" />
            <Link className="text" to="/" >
              Profil
            </Link>
          </li>
          <li className="nav-link">
            <i className="fa fa-comments" />
            <Link className="text" to="/" >
              Messages
            </Link>
          </li>
          <li className="nav-link nav-down">
            <i className="fa fa-sign-out" />
            <Link className="text" to="/" >
              Exit
            </Link>
          </li>
        </ul>
      </div>
    );
  }
}

export default Navbar;
