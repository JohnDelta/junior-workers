import React from 'react';
import './Home.css';

class Home extends React.Component{
  constructor() {
    super();
    this.state = {
      loginButtonText : "Login",
      loginError : ""
    };
    this.onClickLoginHandle = this.onClickLoginHandle.bind(this);
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
      loginButton.style.fontSize = "32px";
    } else {
      this.setState({
        loginButtonText: "Login"
      });
      loginButton.style.fontSize = "22px";
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

        <div className="join">
          <button className="join-button">Join our community</button>
          <div className="join-circle" />
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
