import React from 'react';
import {
  Link
} from "react-router-dom";
import './Navbar.css';

class Navbar extends React.Component{
  constructor(props){
    super();
    this.toggleNavbar = this.toggleNavbar.bind(this);
    this.handleLogout = this.handleLogout.bind(this);
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

  handleLogout() {
    localStorage.clear();
  }

  render() {
    var profilStyle = {};
    var searchStyle = {};
    var exitStyle = {};
    if(this.props.selectedLink === "profil")
      profilStyle = {color: "#F25F5C"};
    if(this.props.selectedLink === "search")
      searchStyle = {color: "#F25F5C"};

    return(
      <div className="Navbar">
        <div className="nav-toggle" onClick={this.toggleNavbar}>
          <div/>
          <div/>
          <div/>
        </div>
        <ul className="nav-links">
          <li className="nav-link">
            <Link className="text" to="/search" style={searchStyle}>
              <i className="fa fa-search" style={searchStyle} />
              <p>Home</p>
            </Link>
          </li>
          <li className="nav-link">
            <Link className="text" to={"/my-"+this.props.role+"-profil"} style={profilStyle}>
              <i className="fa fa-user" style={profilStyle}/>
              <p>Profil</p>
            </Link>
          </li>
          <li className="nav-link nav-down">
            <Link onClick={this.handleLogout} className="text" to="/" style={exitStyle} >
              <i className="fa fa-sign-out" style={exitStyle} />
              <p>Exit</p>
            </Link>
          </li>
        </ul>
      </div>
    );
  }
}

export default Navbar;
