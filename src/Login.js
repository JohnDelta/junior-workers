import React from 'react';
import './Login.css';

class Login extends React.Component {
    constructor(props) {
        super();
        this.state = {
            loginError: "",
            toggleLoginFlag: false
          };
        this.toggleLogin = this.toggleLogin.bind(this);
    }

    componentDidUpdate() {
        if(this.props.toggleLoginFlag !== this.state.toggleLoginFlag) {
            this.setState({
                toggleLoginFlag: this.props.toggleLoginFlag
            });
            this.toggleLogin();
        }
    }

    toggleLogin() {
        let loginForm = document.querySelector(".login");
        if(loginForm.style.display === "flex") {
        loginForm.style.display = "none";
        } else {
        loginForm.style.display = "flex";
        }
    }

    render() {
        return(
            <div className="login">
                <form className="login-form">
                    <div className="login-message" style={{"color":"#D0321E"}}>{this.state.loginError}</div>

                    <div className="login-label">Username</div>
                    <div className="login-input-before fa fa-user" />
                    <input className="login-input-text" type="text" minLength="6" maxLength="30" placeholder="type something" />
                    <div className="login-label">Password</div>
                    <div className="login-input-before fa fa-lock" />
                    <input className="login-input-text" type="text" minLength="6" maxLength="30" placeholder="type something" />
                    <button className="login-submit">Sign in</button>
                </form>
            </div>
        );
    }
}

export default Login;