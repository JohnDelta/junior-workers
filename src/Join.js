import React from 'react';
import './Join.css';

class Join extends React.Component {
    constructor(props) {
        super();
        this.state = {
            joinError: "",
            toggleJoinFlag: false
          };
        this.toggleJoin = this.toggleJoin.bind(this);
    }

    componentDidUpdate() {
        if(this.props.toggleJoinFlag !== this.state.toggleJoinFlag) {
            this.setState({
                toggleJoinFlag: this.props.toggleJoinFlag
            });
            this.toggleJoin();
        }
    }

    toggleJoin() {
        let joinForm = document.querySelector(".join");
        if(joinForm.style.display === "flex") {
        joinForm.style.display = "none";
        } else {
        joinForm.style.display = "flex";
        }
    }

    render() {
        return(
            <div className="join">
                <form className="join-form">
                    <div className="join-message">Account Creation</div>
                    <div className="join-message" style={{"color":"#D0321E", "fontSize":"26px"}}>{this.state.joinError}</div>
                    <div className="join-section">
                    <div className="join-title-label">Account ID</div>
                    <div className="join-label">Username</div>
                    <input className="join-input-text" type="text" minLength="6" maxLength="30" placeholder="johnDelta" required />
                    <div className="join-label">Password</div>
                    <input className="join-input-text" type="password" minLength="6" maxLength="30" placeholder="John123DEL" required />
                    <div className="join-label">Verify password</div>
                    <input className="join-input-text" type="password" minLength="6" maxLength="30" placeholder="John123DEL" required />
                    </div>
                    <div className="join-section">
                    <div className="join-title-label">Personal info</div>
                    <div className="join-label">Name</div>
                    <input className="join-input-text" type="text" minLength="6" maxLength="40" placeholder="John" required />
                    <div className="join-label">Lastname</div>
                    <input className="join-input-text" type="text" minLength="6" maxLength="40" placeholder="Deligiannis" required />
                    </div>
                    <button className="join-submit">Create account</button>
                </form>
            </div>
        );
    }
}

export default Join;