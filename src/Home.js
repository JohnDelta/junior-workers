import React from 'react';
import './Home.css';
import Login from './Login.js';
import Join from './Join.js';

class Home extends React.Component{
  constructor() {
    super();
    this.state = {
      toggleLoginFlag: false,
      loginButtonText: "Login",
      toggleJoinFlag: false,
      joinButtonText: "Join our community",
      joinError : ""
    };
    this.onClickLoginHandle = this.onClickLoginHandle.bind(this);
    this.onClickJoinHandle = this.onClickJoinHandle.bind(this);
  }

  onClickLoginHandle() {
    // if the join panel is open, close it
    if(this.state.joinButtonText === "X") {
      this.onClickJoinHandle();
    }
    // toggle login form
    this.setState({
      toggleLoginFlag: !this.state.toggleLoginFlag
    });
    // change text of login button
    let loginButton = document.querySelector(".login-button");
    if(this.state.loginButtonText === "Login") {
    this.setState({
        loginButtonText: "X"
    });
    loginButton.classList.add("login-button-active");
    } else {
    this.setState({
        loginButtonText: "Login"
    });
    loginButton.classList.remove("login-button-active");
    }
  }

  onClickJoinHandle() {
    //if the login panel is open, close it
    if(this.state.loginButtonText === "X") {
      this.onClickLoginHandle();
    }
    // toggle join form
    this.setState({
      toggleJoinFlag: !this.state.toggleJoinFlag
    });
    // change text of join button
    let joinButton = document.querySelector(".join-button");
    let joinCircle = document.querySelector(".join-circle");
    if(this.state.joinButtonText === "Join our community") {
      this.setState({
        joinButtonText: "X"
      });
      joinButton.classList.add("join-button-active");
      joinCircle.classList.add("join-circle-active");
    } else {
      this.setState({
        joinButtonText: "Join our community"
      });
      joinButton.classList.remove("join-button-active");
      joinCircle.classList.remove("join-circle-active");
    }
  }

  render() {
    return(
      <div className="Home">

        <img id="bg" className="background" src={require('./images/backgroundBig.jpg')} />
        
        <div className="logo">
          <div className="title1">Junior</div>
          <div className="title2">Workers</div>
          <div className="logo-circle" />
        </div>

        <button className="join-button" onClick={this.onClickJoinHandle} value="join">
          {this.state.joinButtonText}
        </button>
        <div className="join-circle" />
        <Join toggleJoinFlag={this.state.toggleJoinFlag} />
        

        <button className="login-button" onClick={this.onClickLoginHandle} value="login">
          {this.state.loginButtonText}
        </button>
        <Login toggleLoginFlag={this.state.toggleLoginFlag} />
        
        <div className="main">
          <h1 className="title">
            <span>Your professional</span>
            <span>career starts</span>
            <span>here</span>
            <input className="search-bar" type="text" placeholder="type something..." />
          </h1>
          <img className="image" src={require(`./images/main_image.png`)} />
        </div>

        <div className="infos" id="infos">
          <h2 className="infos-title">Use Junior Workers and find your place in job industry</h2>
          <div className="info">
            <div className="info-title">Recruiters<br/>can</div>
            <div className="info-uses">
              <div className="info-use">Search workers</div>
              <div className="info-use">Create a job post</div>
            </div>
          </div>
          <div className="info">
            <div className="info-title">Workers<br/>can</div>
            <div className="info-uses">
              <div className="info-use">Search job posts</div>
              <div className="info-use">Create a professional profil</div>
            </div>
          </div>
        </div>

        <div className="footer">
          Designed and Coded by
          <a 
						href="https://github.com/JohnDelta"
						target="_blank" 
						title="Visit my github profile!"
						rel="noopener noreferrer" >
              John Deligiannis 
          </a>
        </div>
      </div>
    );
  }
}

export default Home;
