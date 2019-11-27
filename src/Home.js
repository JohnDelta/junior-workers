import React from 'react';
import './Home.css';

class Home extends React.Component{
  render() {
    return(
      <div className="Home">
        
        <div className="header">
          <div className="title">
            <span>Junior</span>
            <span style={{"marginLeft":"15px"}}>Workers</span>
          </div>
          <button className="login-button">Login</button>
          <div className="header-circle" />
        </div>
        
        <div className="main">
          <h1 className="title">
            <span>Your professional</span>
            <span>career starts</span>
            <span>here</span>
          </h1>
          <img className="image" src="" />
          <button className="join-button">Join our community</button>
          <div className="main-circle" />
        </div>

        <div className="info"></div>
      </div>
    );
  }
}

export default Home;
