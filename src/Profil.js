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
                    <div className="title1">Junior</div>
                    <div className="title2">Workers</div>
                    <div className="logo-circle" />
                </div>

                <Navbar />

            </div>
        );
    }
}

export default Profil;