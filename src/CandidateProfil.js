import React from 'react';
import './Profil.css';
import Navbar from './Navbar';
import  { Redirect } from 'react-router-dom';

class CandidateProfil extends React.Component {
    constructor(props) {
        super();
        this.state = {
            redirect: "",
            email: localStorage.getItem("email"), // email to get data from
            role: localStorage.getItem("role"), // role of user to setup navbar
            jwt: localStorage.getItem("jwt"),
            disabled: true,
            readonly: true,
            data : {
                "user": [],
                "experience": [],
                "skill": [],
                "education": [],
                "language": [],
                "job_post": []
            },
            dropListData: {
                "profession": [],
                "skill": [],
                "education": [],
                "education_level": [],
                "language": [],
                "language_level": []
            },
            navbar: ""
        };
        this.getUserData = this.getUserData.bind(this);
        this.getDropListData = this.getDropListData.bind(this);
        this.redirectBack = this.redirectBack.bind(this);
        this.downloadResume = this.downloadResume.bind(this);
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

    async downloadResume() {
        /*
        NOTE : codes returned from the get-user-resume.php
        $SUCCESS_CODE = "0";
        $ERROR_CODE = "1";
        $FILE_CANNOT_FOUND_CODE = "2";
        */

        // procced to upload resume
        const url = 'http://localhost:80//junior-workers/api/get-user-resume.php';
        // const data = {
        //     "jwt": this.state.jwt,
        //     "email": this.state["data"]["user"]["email"]
        // };
        var formData = new FormData();
        formData.append("email", this.state.email);

        fetch(url, {
                method: 'POST',
                body: formData,
            })
			.then(response => {
                if(response.status === 200) {
                    response.blob().then(blob => {
                        let url = window.URL.createObjectURL(blob);
                        let a = document.createElement('a');
                        a.href = url;
                        a.download = 'resume.pdf';
                        a.click();
                    });
                    //window.location.href = response.url;
                } else {
                    this.setState({
                        displayMessage: "Unable to download resume",
                        displayMessageFlag: !this.state.displayMessageFlag
                    });
                }
		});
    }

    redirectBack() {
        var temp = <Redirect to="/search" />;
        this.setState({redirect: temp});
    }

    render() {

        // display video if the user has any
        var videoMap = "";
        if(this.state.data["user"]["video_path"] !== "" && this.state.data["user"]["video_path"] !== null) {
            videoMap = <video 
                            className="video"
                            type="video/mp4"
                            src={"http://localhost/junior-workers/api/uploads/"+this.state.data["user"]["video_path"]}
                            controls={true}>
                            Unable to play video. Please consider updating your browser.
                        </video>;
        }

        // display resume if the user has
        var resumeMap = "";
        if(this.state.data["user"]["resume_path"] !== "" && this.state.data["user"]["resume_path"] !== null) {
            resumeMap = <button className="profil-resume-button" onClick={this.downloadResume} >
                            <i className="fa fa-arrow-down" />
                            Resume
                        </button>;
        } 

        // display availability according to state
        var availabilityText = <p>Not available</p>;
        if(this.state.data["user"]["availability"] === "1") availabilityText = <p>Available</p>; 

        // Map experience from json to div
        var experienceMap = [];
        this.state.data["experience"].forEach((item, index) => {
            if(item !== ""){
                // display remove job if you are on edit mode
                var removeButton = "";
                if(this.state.editFlag) {
                    removeButton = <button className="work-remove" id={"experience__"+index+"__remove"} onClick={this.removeUserData}>
                        <i className="fa fa-times" />
                    </button>;
                }
                // map all professions into option - select
                var professionMap = [];
                this.state.dropListData["profession"].forEach((pro_item, pro_index) => {
                    professionMap.push(
                        <option value={pro_item.id_profession} key={"profession_option__"+index+"__"+pro_index}>{pro_item.title}</option>
                    );
                });
                // push experience div
                experienceMap.push(
                    <div className="work" key={"experience"+index}>
                        <p className="work-label">Worked as</p>
                        <select 
                            id={"experience__"+index+"__id_profession"}
                            disabled={this.state.disabled} 
                            value={item.id_profession} >
                            {professionMap}
                        </select>
                        <p className="work-label">At</p>
                        <input 
                            type="text" 
                            readOnly={this.state.readonly} 
                            id={"experience__"+index+"__company"} 
                            defaultValue={item.company}
                            placeholder="company"
                            required={true} />
                        <p className="work-label">Between</p>
                        <input 
                            type="text" 
                            readOnly={this.state.readonly} 
                            id={"experience__"+index+"__date"} 
                            defaultValue={item.date}
                            placeholder="date"
                            required={true} />
                        {removeButton}
                    </div>
                );
            }
        });
        if(this.state.data["experience"] === [] || this.state.data["experience"].length === 0) experienceMap = "No experience added so far";
        
        // Map skill from json to div
        var skillMap = [];
        this.state.data["skill"].forEach((item, index) => {
            if(item !== ""){
                // map all skills into option - select
                var skillsMap = [];
                this.state.dropListData["skill"].forEach((pro_item, pro_index) => {
                    skillsMap.push(
                        <option value={pro_item.id_skill} key={"skill_option__"+index+"__"+pro_index}>{pro_item.title}</option>
                    );
                });
                // push skill div
                skillMap.push(
                    <div className="skill" key={"skill"+index}>
                        <div className="skill-dot"></div>
                        <select 
                            id={"skill__"+index+"__id_skill"}
                            disabled={this.state.disabled} 
                            value={item.id_skill} >
                            {skillsMap}
                        </select>
                    </div>
                );
            }
        });
        if(this.state.data["skill"] === [] || this.state.data["skill"].length === 0) skillMap = "No skills so far";

        // Map education from json to div
        var educationMap = [];
        this.state.data["education"].forEach((item, index) => {
            if(item !== ""){
                // display remove education if you are on edit mode
                var removeButton = "";
                if(this.state.editFlag) {
                    removeButton = <button className="education-remove" id={"education__"+index+"__remove"} onClick={this.removeUserData}>
                        <i className="fa fa-times" />
                    </button>;
                }
                // map all education into option - select
                var allEducationMap = [];
                this.state.dropListData["education"].forEach((pro_item, pro_index) => {
                    allEducationMap.push(
                        <option value={pro_item.id_education} key={"education_option__"+index+"__"+pro_index}>{pro_item.title}</option>
                    );
                });
                // map all education levels into option - select
                var allEducationLevelsMap = [];
                this.state.dropListData["education_level"].forEach((pro_item, pro_index) => {
                    allEducationLevelsMap.push(
                        <option value={pro_item.id_education_level} key={"education_level_option__"+index+"__"+pro_index}>{pro_item.title}</option>
                    );
                });
                // push education div
                educationMap.push(
                    <div className="education" key={"education"+index}>
                        <div className="education-dot"></div>
                        <select 
                            id={"education__"+index+"__id_education_level"}
                            disabled={this.state.disabled} 
                            value={item.id_education_level} >
                            {allEducationLevelsMap}
                        </select>
                        <select 
                            id={"education__"+index+"__id_education"}
                            disabled={this.state.disabled}
                            value={item.id_education} >
                            {allEducationMap}
                        </select>
                        {removeButton}
                    </div>
                );
            }
        });
        if(this.state.data["education"] === [] || this.state.data["education"].length === 0) educationMap = "No education added so far";

        // Map language from json to div
        var languageMap = [];
        this.state.data["language"].forEach((item, index) => {
            if(item !== ""){
                // display remove language if you are on edit mode
                var removeButton = "";
                if(this.state.editFlag) {
                    removeButton = <button className="language-remove" id={"language__"+index+"__remove"} onClick={this.removeUserData}>
                        <i className="fa fa-times" />
                    </button>;
                }
                // map all language into option - select
                var allLanguageMap = [];
                this.state.dropListData["language"].forEach((pro_item, pro_index) => {
                    allLanguageMap.push(
                        <option value={pro_item.id_language} key={"language_option__"+index+"__"+pro_index}>{pro_item.title}</option>
                    );
                });
                // map all language levels into option - select
                var allLanguageLevelsMap = [];
                this.state.dropListData["language_level"].forEach((pro_item, pro_index) => {
                    allLanguageLevelsMap.push(
                        <option value={pro_item.id_language_level} key={"language_level_option__"+index+"__"+pro_index}>{pro_item.title}</option>
                    );
                });
                // push language div
                languageMap.push(
                    <div className="language" key={"language"+index}>
                        <div className="language-dot"></div>
                        <select 
                            id={"language__"+index+"__id_language_level"}
                            disabled={this.state.disabled}
                            value={item.id_language_level} >
                            {allLanguageLevelsMap}
                        </select>
                        <select 
                            id={"language__"+index+"__id_language"} 
                            value={item.id_language}
                            disabled={this.state.disabled} >
                            {allLanguageMap}
                        </select>
                        {removeButton}
                    </div>
                );
            }
        });
        if(this.state.data["language"] === [] || this.state.data["language"].length === 0) languageMap = "No languages added so far";

        return(
            <div className="Profil">
                {this.state.redirect}

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
                            placeholder="Profession title"
                            id="title"
                        />
                    </div>
                    <div className="profil-header2">
                        <div className="profil-availability">
                            {availabilityText}
                        </div>
                        <div className="profil-resume">
                            {resumeMap}
                        </div>
                    </div>
                    <form className="profil-content" id="profil-form">
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
                                    placeholder="Write something about yourself..."
                                    value={this.state.data["user"]["bio"]}>
                                </textarea>
                                {videoMap}
                            </div>
                        </div>
                        <div className="title"><p>Work Experience</p></div>
                        <div className="title-hr" />
                        <div className="section">
                            {experienceMap}
                        </div>
                        <div className="title"><p>Skills</p></div>
                        <div className="title-hr" />
                        <div className="section">
                            {skillMap}
                        </div>
                        <div className="title"><p>Education</p></div>
                        <div className="title-hr" />
                        <div className="section">
                            {educationMap}
                        </div>
                        <div className="title"><p>Language</p></div>
                        <div className="title-hr" />
                        <div className="section">
                            {languageMap}
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

export default CandidateProfil;