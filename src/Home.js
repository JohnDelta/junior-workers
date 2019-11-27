import React from 'react';
import './Home.css';

class Home extends React.Component{
  render() {
    return(
      <div className="Home">
        
        <div className="header">
          <h1 className="title">Title</h1>
          <button className="login-button">Login</button>
          <div className="header-circle" />
        </div>
        
        <div className="main">
          <h1 className="title">Main title of page</h1>
          <img className="image" src="" />
          <button className="join-button">Join us</button>
          <div className="main-circle" />
        </div>

      </div>
    );
  }
}

export default Home;
