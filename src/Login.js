import React from 'react';
import './Login.css';
import  { Redirect } from 'react-router-dom';

class Login extends React.Component {
    constructor(props) {
        super();
        this.state = {
            redirect: "",
            loginError: "",
            toggleLoginFlag: false,
            email: "",
            password: ""
          };
        this.toggleLogin = this.toggleLogin.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidUpdate() {
        // Parent of login changes the flag state to toggle login form
        if(this.props.toggleLoginFlag !== this.state.toggleLoginFlag) {
            this.setState({
                toggleLoginFlag: this.props.toggleLoginFlag
            });
            this.toggleLogin();
        }
    }

    // Toggle show login form
    toggleLogin() {
        let loginForm = document.querySelector(".login");
        if(loginForm.style.display === "flex") {
        loginForm.style.display = "none";
        } else {
        loginForm.style.display = "flex";
        }
    }

    // Handle input change of login form
    handleInputChange(e) {
        if(e.target.name === "email") {
            this.setState({
                email: e.target.value
            });
        } else if (e.target.name === "password") {
            this.setState({
                password: e.target.value
            });
        }
    }

    // Handle Submit of login form
    async handleSubmit(e) {
        const url = 'http://localhost/junior-workers/api/login.php';
        const data = {"email":this.state.email, "password":this.state.password};

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });
            
            if(response.status !== 200) {
                this.setState({
                    loginError : "Unable to login"
                });
            }
            else if (response.status === 200) {
                const json = await response.json();
                localStorage.setItem("jwt", json["jwt"]);
                var temp = "";
                // navigate user to the proper profil according to their role
                if(json["role"] === "candidate") {
                    temp = <Redirect to="/candidate-profil" />;
                } else if(json["role"] === "hirer") {
                    temp = <Redirect to="/hirer-profil" />;
                }
                this.setState({redirect : temp});
            }
        } catch (error) {
            console.error('Error:', error);
            this.setState({
                loginError : "Unable to login"
            });
        }
    }

    render() {
        return(
            <div className="login">
                {this.state.redirect}
                <div className="login-form">
                    <div className="login-message" style={{"color":"#D0321E"}}>{this.state.loginError}</div>

                    <div className="login-label">Email</div>
                    <div className="login-input-before fa fa-user" />
                    <input
                        name="email"
                        className="login-input-text" 
                        type="email" minLength="6" 
                        maxLength="90" 
                        placeholder="John@mail.com"
                        onChange={this.handleInputChange} />
                    <div className="login-label">Password</div>
                    <div className="login-input-before fa fa-lock" />
                    <input 
                        name="password"
                        className="login-input-text" 
                        type="password" 
                        minLength="6" 
                        maxLength="40" 
                        placeholder="abc123" 
                        onChange={this.handleInputChange}/>
                    <button className="login-submit" onClick={this.handleSubmit}>Sign in</button>
                </div>
            </div>
        );
    }
}

export default Login;