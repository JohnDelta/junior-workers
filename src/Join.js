import React from 'react';
import './Join.css';

class Join extends React.Component {
    constructor(props) {
        super();
        this.state = {
            joinMessage: "",
            toggleJoinFlag: false,
            firstname: "",
            lastname: "",
            email: "",
            password: "",
            repassword: ""
          };
        this.toggleJoin = this.toggleJoin.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
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

    handleChange(e) {
        if(e.target.name === "firstname") {
            this.setState({
                firstname: e.target.value
            });
        } else if (e.target.name === "lastname") {
            this.setState({
                lastname: e.target.value
            });
        } else if (e.target.name === "email") {
            this.setState({
                email: e.target.value
            });
        } else if (e.target.name === "password") {
            this.setState({
                password: e.target.value
            });
        } else if (e.target.name === "repassword") {
            this.setState({
                repassword: e.target.value
            });
        }
    }

    async handleSubmit() {
        var data = {
            "email": this.state.email,
            "password": this.state.password,
            "firstname": this.state.firstname,
            "lastname": this.state.lastname
        };
        var url = "http://localhost/junior-workers/api/create-user.php";
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
                    joinMessage : "Email exists"
                });
            }
            else if (response.status === 200) {
                const json = await response.json();
                this.setState({
                    joinMessage : "User created"
                });
            }
        } catch (error) {
            console.error('Error:', error);
            this.setState({
                joinMessage : "Unable to create user"
            });
        }
    }

    render() {
        return(
            <div className="join">
                <div className="join-form">
                    <div className="join-message">Account Creation</div>
                    <div className="join-message" style={{"color":"#D0321E", "fontSize":"26px"}}>{this.state.joinMessage}</div>
                    <div className="join-section">
                    <div className="join-title-label">Account ID</div>
                    <div className="join-label">Email</div>
                    <input className="join-input-text" type="email" minLength="6" maxLength="30" placeholder="johnDelta" required name="email" onChange={this.handleChange} />
                    <div className="join-label">Password</div>
                    <input className="join-input-text" type="password" minLength="6" maxLength="30" placeholder="John123DEL" required name="password" onChange={this.handleChange} />
                    <div className="join-label">Verify password</div>
                    <input className="join-input-text" type="password" minLength="6" maxLength="30" placeholder="John123DEL" required name="repassword" onChange={this.handleChange} />
                    </div>
                    <div className="join-section">
                    <div className="join-title-label">Personal info</div>
                    <div className="join-label">Name</div>
                    <input className="join-input-text" type="text" minLength="6" maxLength="40" placeholder="John" required name="firstname" onChange={this.handleChange} />
                    <div className="join-label">Lastname</div>
                    <input className="join-input-text" type="text" minLength="6" maxLength="40" placeholder="Deligiannis" required name="lastname" onChange={this.handleChange} />
                    </div>
                    <button className="join-submit" onClick={this.handleSubmit} >Create account</button>
                </div>
            </div>
        );
    }
}

export default Join;