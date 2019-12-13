import React from 'react';
import './Profil.css';
import Navbar from './Navbar';

class Profil extends React.Component {
    constructor(props) {
        super();
    }

    render() {
        return(
            <div className="Profil">
                <img id="bg" className="background" src={require('./images/backgroundBig.jpg')} />

                <div className="logo">
                    <div className="title1" style={{color: "#232323", backgroundColor:"#fff1c1"}}>Junior</div>
                    <div className="title2">Workers</div>
                </div>

                <Navbar selectedLink="profil" />

                <div className="profil-container">
                    <img className="profil-image" src={require('./images/profil-pic.png')} />
                    <div className="profil-header">
                        <button className="profil-edit-btn">
                            <i className="fa fa-edit" />
                        </button>
                        <div className="profil-fullname">John Deligiannis</div>
                        <div className="profil-headline">Software Developer</div>
                        <div className="profil-availability">Available to hire</div>
                    </div>
                    <div className="profil-content">
                        
                    </div>
                </div>

            </div>
        );
    }
}

export default Profil;