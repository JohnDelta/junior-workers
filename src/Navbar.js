import React from 'react';
import {
  BrowserRouter as Router,
  Link
} from "react-router-dom";
import './Navbar.css';

class Navbar extends React.Component{
  constructor(props){
    super(props);
    this.toggleNavbar = this.toggleNavbar.bind(this);
  }

  toggleNavbar() {
    // show nav links
    var navLinks = document.querySelector(".nav-links");
    navLinks.classList.toggle("nav-links-active");
    // animate navbar toggle button
    var navLines = document.querySelectorAll(".nav-toggle div");
    navLines.forEach((line, index) => {
      line.classList.toggle("div"+(index+1)+"-active");
    });
    // change color of navbar
    var navbar = document.querySelector(".Navbar");
    navbar.classList.toggle("navbar-active");
  }

  render() {
    var profilStyle, homeStyle = {};
    if(this.props.selectedLink === "profil")
      profilStyle = {color: "#fff1c1"};
    if(this.props.selectedLink === "home")
      homeStyle = {color: "#fff1c1"}; 

    return(
      <div className="Navbar">
        <div className="nav-toggle" onClick={this.toggleNavbar}>
          <div/>
          <div/>
          <div/>
        </div>
        <ul className="nav-links">
          <li className="nav-link">
            <i className="fa fa-home" style={homeStyle} />
            <Link className="text link-active" to="/" style={homeStyle}>
              Home
            </Link>
          </li>
          <li className="nav-link">
            <i className="fa fa-user" style={profilStyle}/>
            <Link className="text" to="/" style={profilStyle}>
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
