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
            repassword: "",
            role: "candidate"
          };
        this.toggleJoin = this.toggleJoin.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.resetAllInput = this.resetAllInput.bind(this);
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
        e.preventDefault();
        var id = e.target.id;
        if(id === "join_firstname") {
            this.setState({
                firstname: e.target.value
            });
        } else if (id === "join_lastname") {
            this.setState({
                lastname: e.target.value
            });
        } else if (id === "join_email") {
            this.setState({
                email: e.target.value
            });
        } else if (id === "join_password") {
            this.setState({
                password: e.target.value
            });
        } else if (id === "join_repassword") {
            this.setState({
                repassword: e.target.value
            });
        } else if (id === "join_role") {
            this.setState({
                role: e.target.value
            });
        }
    }

    async handleSubmit(e) {
        e.preventDefault();
        var data = {
            "email": this.state.email,
            "password": this.state.password,
            "firstname": this.state.firstname,
            "lastname": this.state.lastname,
            "role": this.state.role
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
                    joinMessage : "User created",
                });
                this.resetAllInput();
            }
        } catch (error) {
            console.error('Error:', error);
            this.setState({
                joinMessage : "Unable to create user"
            });
        }
    }

    resetAllInput() {
        document.getElementById("join_firstname").value = "";
        document.getElementById("join_lastname").value = "";
        document.getElementById("join_email").value = "";
        document.getElementById("join_password").value = "";
        document.getElementById("join_repassword").value = "";
    }

    render() {
        return(
            <div className="join">
                <form className="join-form" onSubmit={this.handleSubmit}>
                    <div className="join-message">Account Creation</div>
                    <div className="join-message" style={{"color":"#D0321E", "fontSize":"26px"}}>{this.state.joinMessage}</div>
                    <div className="join-section">
                        <div className="join-title-label">Account ID</div>
                        <div className="join-label">Email</div>
                        <input className="join-input-text" type="email" minLength="6" maxLength="30" placeholder="johnDelta" required name="email" id="join_email" onChange={this.handleChange} />
                        <div className="join-label">Password</div>
                        <input className="join-input-text" type="password" minLength="6" maxLength="30" placeholder="John123DEL" required name="password" id="join_password" onChange={this.handleChange} />
                        <div className="join-label">Verify password</div>
                        <input className="join-input-text" type="password" minLength="6" maxLength="30" placeholder="John123DEL" required name="repassword" id="join_repassword" onChange={this.handleChange} />
                        <div className="join-label">Role</div>
                        <select className="join-role" defaultValue="candidate" name="role" id="join_role" onChange={this.handleChange}>
                            <option value="candidate" >Candidate</option>
                            <option value="hirer" >Hirer</option>
                        </select>
                    </div>
                    <div className="join-section">
                        <div className="join-title-label">Personal info</div>
                        <div className="join-label">Name</div>
                        <input className="join-input-text" type="text" minLength="2" maxLength="40" placeholder="John" required name="firstname" id="join_firstname" onChange={this.handleChange} />
                        <div className="join-label">Lastname</div>
                        <input className="join-input-text" type="text" minLength="2" maxLength="40" placeholder="Deligiannis" required name="lastname" id="join_lastname" onChange={this.handleChange} />
                    </div>
                    <button className="join-submit" type="submit" >Create account</button>
                </form>
            </div>
        );
    }
}

export default Join;