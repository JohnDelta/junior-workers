import React from 'react';
import './Home.css';

class Home extends React.Component{
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

        <div className="login">
          <button className="login-button">Login</button>
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
