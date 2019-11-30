import React from 'react';
import './Home.css';

class Home extends React.Component{
  constructor() {
    super();
    this.state = {
      loginButtonText : "Login",
      loginError : "",
      joinButtonText: "Join our community",
      joinError : ""
    };
    this.onClickLoginHandle = this.onClickLoginHandle.bind(this);
    this.onClickJoinHangle = this.onClickJoinHangle.bind(this);
  }

  onClickLoginHandle(e) {
    let loginForm = document.querySelector(".login");
    if(loginForm.style.display === "flex") {
      loginForm.style.display = "none";
    } else {
      loginForm.style.display = "flex";
    }

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

  onClickJoinHangle(e) {
    let joinForm = document.querySelector(".join");
    if(joinForm.style.display === "flex") {
      joinForm.style.display = "none";
    } else {
      joinForm.style.display = "flex";
    }

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
        
        <div className="logo">
          <div className="title1">Junior</div>
          <div className="title2">Workers</div>
          <div className="logo-circle" />
        </div>

        <button className="join-button" onClick={this.onClickJoinHangle} value="join">
          {this.state.joinButtonText}
        </button>
        <div className="join-circle" />
        <div className="join">
          <form className="join-form">
            <div className="join-error">{this.state.joinError}</div>
            <div className="join-label">Username</div>
            <input className="join-input-text" type="text" minLength="6" maxLength="30" placeholder="type something" />
            <div className="join-label">Password</div>
            <input className="join-input-text" type="text" minLength="6" maxLength="30" placeholder="type something" />
            <button className="join-submit">Create account</button>
          </form>
        </div>

        <button className="login-button" onClick={this.onClickLoginHandle} value="login">
          {this.state.loginButtonText}
        </button>
        <div className="login">
          <form className="login-form">
            <div className="login-error">{this.state.loginError}</div>
            <div className="login-label">Username</div>
            <div className="login-input-before fa fa-user" />
            <input className="login-input-text" type="text" minLength="6" maxLength="30" placeholder="type something" />
            <div className="login-label">Password</div>
            <div className="login-input-before fa fa-lock" />
            <input className="login-input-text" type="text" minLength="6" maxLength="30" placeholder="type something" />
            <button className="login-submit">Sign in</button>
          </form>
        </div>
        
        <div className="main">
          <h1 className="title">
            <span>Your professional</span>
            <span>career starts</span>
            <span>here</span>
            <input className="search-bar" type="text" placeholder="type something..." />
          </h1>
          <img className="image" src={require(`./images/background_image.png`)} />
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
