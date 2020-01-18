import React from 'react';
import './Profil.css';
import Navbar from './Navbar';
import  { Redirect } from 'react-router-dom';
import DisplayMessage from './DisplayMessage';

class HirerProfil extends React.Component {
    constructor(props) {
        super();
        this.state = {
            redirect: "",
            email: localStorage.getItem("email"),
            role: localStorage.getItem("role"),
            jwt: localStorage.getItem("jwt"),
            editFlag: false,
            disabled: true,
            readonly: true,
            dropListData: {
                "profession": [],
                "skill": [],
                "education": [],
                "education_level": [],
                "language": [],
                "language_level": []
            },
            data : {
                "user": [],
                "experience": [],
                "skill": [],
                "education": [],
                "language": [],
                "job_post": []
            },
            displayMessage: "",
            displayMessageFlag: false,
            navbar: ""
        };
        this.getUserData = this.getUserData.bind(this);

        this.getDropListData = this.getDropListData.bind(this);
        
        this.redirectBack = this.redirectBack.bind(this);
    }

    componentDidMount() {
        if(this.state.email === "" || this.state.email === null) {
            var temp = <Redirect to="/" />;
            this.setState({
                redirect: temp
            });
        } else {
            this.getDropListData();
            this.getUserData();
        }
    }

    // Get all user's data using their email
    async getUserData() {
        var url = 'http://localhost:80//junior-workers/api/get-view-user-data.php';
        var data = {
            "email": this.state.email
        };
        try {
            var response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });
            if(response.status !== 200) {
                console.error("Unable to get user's data");
                var temp = <Redirect to="/search" />;
                this.setState({redirect: temp});
            }
            else if (response.status === 200) {
                var json = await response.json();
                this.setState({data : json});

                // if the user is logged in show the navbar too.
                if(this.state.jwt !== null && this.state.jwt !== "") {
                    var tmp = <Navbar selectedLink="nothing" role={this.state.role} />
                    this.setState({
                        navbar: tmp
                    });
                }
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }

    async getDropListData() {
        var url = 'http://localhost:80//junior-workers/api/get-droplist-data.php';
        try {
            var response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                }
            });
            if(response.status !== 200) {
                console.error("Unable to get drop list data")
            }
            else if (response.status === 200) {
                var json = await response.json();
                this.setState({
                    dropListData: json
                });
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }

    redirectBack() {
        var temp = <Redirect to="/search" />;
        this.setState({redirect: temp});
    }

    render() {

        // display availability according to state
        var availabilityText = <p>Not Hiring</p>;
        if(this.state.data["user"]["availability"] === "1") availabilityText = <p>Hiring</p>; 

        // Map jobPost from json to div
        var jobPostMap = [];
        this.state.data["job_post"].forEach((item, index) => {
            if(item !== ""){
                // map all professions into option - select
                var professionMap = [];
                this.state.dropListData["profession"].forEach((pro_item, pro_index) => {
                    professionMap.push(
                        <option value={pro_item.id_profession} key={"profession_option__"+index+"__"+pro_index}>{pro_item.title}</option>
                    );
                });
                // push job_post div
                jobPostMap.push(
                    <div className="post" key={"job_post"+index}>
                        <p className="post-label">Job title</p>
                        <textarea
                            type="text" 
                            readOnly={this.state.readonly} 
                            id={"job_post__"+index+"__title"} 
                            defaultValue={item.title}
                            placeholder="Job title"
                            required={true} />
                        <p className="post-label">Looking for</p>
                        <select 
                            id={"job_post__"+index+"__id_profession"}
                            disabled={this.state.disabled} 
                            value={item.id_profession} >
                            {professionMap}
                        </select>
                        <p className="post-label">Job Description</p>
                        <textarea 
                            readOnly={this.state.readonly} 
                            id={"job_post__"+index+"__description"} 
                            defaultValue={item.description}
                            placeholder="Describe the position for the job here"
                            required={true} />
                    </div>
                );
            }
        });
        if(this.state.data["job_post"] === [] || this.state.data["job_post"].length === 0) jobPostMap = "No Job posts yet";
        
        return(
            <div className="Profil">
                {this.state.redirect}

                <DisplayMessage displayMessage={this.state.displayMessage} displayMessageFlag={this.state.displayMessageFlag} />

                <img id="bg" className="background" src={require('./images/backgroundBig.jpg')} />

                <div className="logo">
                    <div className="title1" style={{color: "#232323", backgroundColor:"#F25F5C"}}>Junior</div>
                    <div className="title2">Workers</div>
                </div>

                {this.state.navbar}

                <div className="profil-container">
                    <img className="profil-image" src={"http://localhost/junior-workers/api/uploads/"+this.state.data["user"]["image_path"]} />
                    <div className="profil-header">
                        <button className="profil-edit-btn" onClick={this.redirectBack}>
                            <i className="fa fa-arrow-left" id="edit-button"/>
                        </button>
                        <input 
                            type="text" 
                            className="profil-name firstname"
                            value={this.state.data["user"]["firstname"]}
                            readOnly={this.state.readonly}
                            placeholder="Firstname"
                            id="firstname"
                        />
                        <input 
                            type="text" 
                            className="profil-name lastname"
                            value={this.state.data["user"]["lastname"]}
                            readOnly={this.state.readonly}
                            placeholder="Lastname"
                            id="lastname"
                        />
                        <input
                            type="text" 
                            className="profil-headline"
                            value={this.state.data["user"]["title"]}
                            readOnly={this.state.readonly}
                            placeholder="Company name"
                            id="title"
                        />
                    </div>
                    <div className="profil-header2">
                        <div className="profil-availability">
                            {availabilityText}
                        </div>
                    </div>
                    <form className="profil-content" id="profil-form" onSubmit={this.saveChanges}>
                        <div className="title title-first">
                            <p>About</p>
                        </div>
                        <div className="title-hr" />
                        <div className="section">
                            <div className="about">
                                <textarea
                                    readOnly={this.state.readonly}
                                    className="text"
                                    id="bio"
                                    placeholder="Write something about your company..."
                                    value={this.state.data["user"]["bio"]}>
                                </textarea>
                            </div>
                        </div>
                        <div className="title"><p>Job Posts</p></div>
                        <div className="title-hr" />
                        <div className="section">
                            {jobPostMap}
                        </div>
                        <div className="title"><p>Contact Info</p></div>
                        <div className="title-hr" />
                        <div className="section">
                            Email : {this.state.data["user"]["email"]}
                        </div>
                    </form>
                </div>

            </div>
        );
    }
}

export default HirerProfil;