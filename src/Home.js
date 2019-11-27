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
            <span>
              <a href="#infos"><i className="fa fa-arrow-down"></i></a>
            </span>
          </h1>
          <img className="image" src={require(`./images/background_image.png`)} />
          <button className="join-button">Join our community</button>
          <div className="main-circle" />
        </div>

        <div className="infos" id="infos">
          <h2 className="infos-title">Use Junior Workers and find what you're looking for</h2>
          <div className="info">
            <div className="info-title">Recruiters<br/>can</div>
            <div className="info-uses">
              <div className="info-use"><i className="fa fa-circle" />Search workers</div>
              <div className="info-use"><i className="fa fa-circle" />Create a job post</div>
            </div>
          </div>
          
          <div className="info">
            <div className="info-title" style={{"backgroundColor": "#428438"}}>Workers<br/>can</div>
            <div className="info-uses">
              <div className="info-use"><i className="fa fa-circle" />Search workers</div>
              <div className="info-use"><i className="fa fa-circle" />Create a job post</div>
            </div>
          </div>
        </div>

        <div className="footer">
          asdf
        </div>
      </div>
    );
  }
}

export default Home;
