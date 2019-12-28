import React from 'react';
import './Profil.css';
import Navbar from './Navbar';
import  { Redirect } from 'react-router-dom';

class CandidateProfil extends React.Component {
    constructor(props) {
        super();
        this.state = {
            redirect: "",
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
                "language": []
            },
            imageFile: null
        };

        this.toggleEdit = this.toggleEdit.bind(this);
        this.getUserData = this.getUserData.bind(this);

        this.userHeaderChange = this.userHeaderChange.bind(this);
        this.availabilityChange = this.availabilityChange.bind(this);

        this.discardChanges = this.discardChanges.bind(this);
        this.saveChanges = this.saveChanges.bind(this);
        
        this.userDataChange = this.userDataChange.bind(this);
        this.removeUserData = this.removeUserData.bind(this);
        this.addUserData = this.addUserData.bind(this);

        this.getDropListData = this.getDropListData.bind(this);

        this.imageChange = this.imageChange.bind(this);
    }

    componentDidMount() {
        if(this.state.jwt === null) {
            var temp = <Redirect to="/" />;
            this.setState({
                redirect: temp
            });
        }
        this.getUserData();
        this.getDropListData();
    }

    // open edit mode - be able to edit all values (remove and add new)
    toggleEdit() {
        this.setState({
            editFlag : !this.state.editFlag
        });
        var button = document.getElementById("edit-button");
        // if you close edit without saving first, reset changes
        if(this.state.editFlag) {
            this.getUserData();
            // change edit button icon
            button.classList.remove("fa-times");
            button.classList.add("fa-edit");
        } else {
            button.classList.remove("fa-edit");
            button.classList.add("fa-times");
        }
        // change lock of input fields
        this.setState({
            disabled: !this.state.disabled,
            readonly: !this.state.readonly
        });
    }

    async imageChange(e) {
        e.preventDefault();
        
        this.setState({
            imageFile: URL.createObjectURL(e.target.files[0])
        });

        const url = 'http://localhost:80//junior-workers/api/post-image.php';
        //const data = {"jwt": this.state.jwt, "data": this.state.imageFile};
        var formData = new FormData();
        formData.append("image", this.state.imageFile);
        //formData.append("jwt", this.state.jwt);
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: formData,
            });
            if(response.status !== 200) {
                console.error("Unable to post user's data")
            }
            else if (response.status == 200) {
                const json = await response.json();
                console.log("Data posted");
                console.log(json);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }

    // handle user data input change 
    userHeaderChange(e) {
        e.preventDefault();
        var id = e.target.id;
        var value = e.target.value;
        var temp = this.state.data;

        if(id === "firstname") {
            temp["user"]["firstname"] = value;
        } else if(id === "lastname") {
            temp["user"]["lastname"] = value;
        } else if(id === "title") {
            temp["user"]["title"] = value;
        } else if(id === "bio") {
            temp["user"]["bio"] = value;
        }

        this.setState({
            data: temp
        });
    }

    // handle the change state of availability
    availabilityChange() {
        var temp;
        if(this.state.data["user"]["availability"] === "1") {
            temp = this.state.data;
            temp["user"]["availability"] = "0";
            this.setState({
                data: temp
            });
        } else {
            temp = this.state.data;
            temp["user"]["availability"] = "1";
            this.setState({
                data: temp
            });
        }
    }

    // handle user's data input change
    // each Data component is distinguished by an id with the form : nameOfData__indexInJson__nameOfItem
    // ex. skill__0__title means the data item skill with index 0 and name title called the function 
    userDataChange(e) {
        e.preventDefault();
        var value = e.target.value;
        var attr = e.target.id.split("__");
        var dataName = attr[0];
        var index = attr[1];
        var name = attr[2];
        var temp = this.state.data;
        temp[dataName][index][name] = value;
        this.setState({
            data: temp
        });
    }

    // add user's skill item
    addUserData(e) {
        e.preventDefault();
        var temp = this.state.data;
        var dataName = e.target.name;
        if(dataName === "experience") {
            temp["experience"].push({
                "id_profession": this.state.dropListData.profession[0].id_profession, "company": "", "date": ""
            });
        } else if (dataName === "skill") {
            temp["skill"].push({
                "id_skill": this.state.dropListData.skill[0].id_skill});
        } else if (dataName === "education") {
            temp["education"].push({
                "id_education": this.state.dropListData.education[0].id_education, 
                "id_education_level": this.state.dropListData.education_level[0].id_education_level 
            });
        } else if (dataName === "language") {
            temp["language"].push({
                "id_language": this.state.dropListData.language[0].id_language, 
                "id_language_level": this.state.dropListData.language_level[0].id_language_level 
            });
        }
        this.setState({
            data: temp
        });
    }

    // remove user's data
    // each data component remove button is distinguished by an id with the form : dataName__indexInJson__remove
    // ex. skill__0__title means the data item experience with index 0 and name title will be removed from json 
    removeUserData(e) {
        e.preventDefault();
        var attr = e.target.id.split("__");
        var dataName = attr[0];
        var index = attr[1];
        var temp = this.state.data;
        temp[dataName][index] = "";
        this.setState({
            data: temp
        });
    }

    // remove all user's data and get them from db again
    discardChanges() {
        this.setState({
            data : {
                "user": [],
                "experience": [],
                "skill": [],
                "education": [],
                "language": []
            }
        });
        this.getUserData();
        this.toggleEdit();
    }

    // post all user's data changes to db
    async saveChanges(e) {
        e.preventDefault();

        const url = 'http://localhost:80//junior-workers/api/post-user-data.php';
        const data = {"jwt": this.state.jwt, "data": this.state.data};
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
                console.error("Unable to post user's data")
            }
            else if (response.status == 200) {
                const json = await response.json();
                //console.log("Data posted");
                this.getUserData();
                this.toggleEdit();
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }

    // Get all user's data using their jwt auth
    async getUserData() {
        const url = 'http://localhost:80//junior-workers/api/get-user-data.php';
        const data = {"jwt": this.state.jwt};
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
                console.error("Unable to get user's data")
            }
            else if (response.status == 200) {
                const json = await response.json();
                this.setState({data : json});

                // if the returned data are for a hirer and not a candidate, open the hirer's profil
                var temp = "";
                if(this.state.data["user"]["role"] === "hirer") {
                    temp = <Redirect to="/hirer-profil" />;
                }
                this.setState({redirect: temp});
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }

    async getDropListData() {
        const url = 'http://localhost:80//junior-workers/api/get-droplist-data.php';
        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                }
            });
            if(response.status !== 200) {
                console.error("Unable to get drop list data")
            }
            else if (response.status == 200) {
                const json = await response.json();
                this.setState({
                    dropListData: json
                });
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }

    render() {

        // On edit mode change
        var changeButtons = "";
        var availabilityButton = "";
        var addExperienceButton = "";
        var addSkillButton = "";
        var addEducationButton = "";
        var addLanguageButton = "";
        var editImageButtons = "";

        if(this.state.editFlag) {
            // display save and exit changes button
            changeButtons = <div className="change-buttons">
                                <button type="submit"><i className="fa fa-check" /></button>
                                <button onClick={this.discardChanges}><i className="fa fa-times" /></button>
                            </div>;
            // add availability change button
            availabilityButton = <button className="profil-availability-button" onClick={this.availabilityChange}>
                                    <i className="fa fa-refresh" />
                                </button>;
            // display add experience option
            addExperienceButton = <button className="add-btn" onClick={this.addUserData} name="experience">
                                    <i className="fa fa-plus" />Add Experience
                                </button>;
            // display add Skill option
            addSkillButton = <button className="add-btn" onClick={this.addUserData} name="skill">
                                    <i className="fa fa-plus" />Add Skill
                                </button>;
            // display add Education option
            addEducationButton = <button className="add-btn" onClick={this.addUserData} name="education">
                                    <i className="fa fa-plus" />Add Education
                                </button>;
            // display add Language option
            addLanguageButton = <button className="add-btn" onClick={this.addUserData} name="language">
                                    <i className="fa fa-plus" />Add Language
                                </button>;
            // display buttons to edit profil image
            editImageButtons = <div className="profil-image-buttons">
                                    <label htmlFor="image-file" title="upload new profil picture">
                                        <i className="fa fa-upload" />
                                    </label>
                                    <input id="image-file" type="file" onChange={this.imageChange} />
                                    <button title="remove saved profil picture">
                                        <i className="fa fa-trash" />
                                    </button>
                                </div>;
        }

        // display availability according to state
        var availabilityText = <p>Not available to hire</p>;
        if(this.state.data["user"]["availability"] === "1") availabilityText = <p>Available to hire</p>; 

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
                            value={item.id_profession}
                            onChange={this.userDataChange} >
                            {professionMap}
                        </select>
                        <p className="work-label">At</p>
                        <input 
                            type="text" 
                            readOnly={this.state.readonly} 
                            id={"experience__"+index+"__company"} 
                            onChange={this.userDataChange} 
                            defaultValue={item.company}
                            placeholder="company"
                            required={true} />
                        <p className="work-label">Between</p>
                        <input 
                            type="text" 
                            readOnly={this.state.readonly} 
                            id={"experience__"+index+"__date"} 
                            onChange={this.userDataChange} 
                            defaultValue={item.date}
                            placeholder="date"
                            required={true} />
                        {removeButton}
                    </div>
                );
            }
        });
        if(this.state.data["experience"] === [] || this.state.data["experience"].length === 0) experienceMap = "No experience so far";
        
        // Map skill from json to div
        var skillMap = [];
        this.state.data["skill"].forEach((item, index) => {
            if(item !== ""){
                // display remove skill if you are on edit mode
                var removeButton = "";
                if(this.state.editFlag) {
                    removeButton = <button className="skill-remove" id={"skill__"+index+"__remove"} onClick={this.removeUserData}>
                        <i className="fa fa-times" />
                    </button>;
                }
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
                            value={item.id_skill}
                            onChange={this.userDataChange} >
                            {skillsMap}
                        </select>
                        {removeButton}
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
                            value={item.id_education_level}
                            onChange={this.userDataChange} >
                            {allEducationLevelsMap}
                        </select>
                        <select 
                            id={"education__"+index+"__id_education"}
                            disabled={this.state.disabled}
                            value={item.id_education}
                            onChange={this.userDataChange} >
                            {allEducationMap}
                        </select>
                        {removeButton}
                    </div>
                );
            }
        });
        if(this.state.data["education"] === [] || this.state.data["education"].length === 0) educationMap = "No education so far";

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
                            value={item.id_language_level}
                            onChange={this.userDataChange} >
                            {allLanguageLevelsMap}
                        </select>
                        <select 
                            id={"language__"+index+"__id_language"} 
                            value={item.id_language}
                            disabled={this.state.disabled}
                            onChange={this.userDataChange} >
                            {allLanguageMap}
                        </select>
                        {removeButton}
                    </div>
                );
            }
        });
        if(this.state.data["language"] === [] || this.state.data["language"].length === 0) languageMap = "No language so far";

        return(
            <div className="Profil">
                {this.state.redirect}

                <img id="bg" className="background" src={require('./images/backgroundBig.jpg')} />

                <div className="logo">
                    <div className="title1" style={{color: "#232323", backgroundColor:"#F25F5C"}}>Junior</div>
                    <div className="title2">Workers</div>
                </div>

                <Navbar selectedLink="profil" />

                <div className="profil-container">
                    <img className="profil-image" src={this.state.imageFile} />
                    <div className="profil-header">
                        <button className="profil-edit-btn" onClick={this.toggleEdit}>
                            <i className="fa fa-edit" id="edit-button"/>
                        </button>
                        <input 
                            type="text" 
                            className="profil-name firstname"
                            value={this.state.data["user"]["firstname"]}
                            readOnly={this.state.readonly}
                            placeholder="Firstname"
                            id="firstname"
                            onChange={this.userHeaderChange}
                        />
                        <input 
                            type="text" 
                            className="profil-name lastname"
                            value={this.state.data["user"]["lastname"]}
                            readOnly={this.state.readonly}
                            placeholder="Lastname"
                            id="lastname"
                            onChange={this.userHeaderChange}
                        />
                        <input
                            type="text" 
                            className="profil-headline"
                            value={this.state.data["user"]["title"]}
                            readOnly={this.state.readonly}
                            placeholder="Profession title"
                            id="title"
                            onChange={this.userHeaderChange}
                        />
                    </div>
                    <div className="profil-header2">
                        {editImageButtons}
                        <div className="profil-availability">
                            {availabilityText}{availabilityButton}
                        </div>
                        <button className="profil-resume">
                            <i className="fa fa-arrow-down" />
                            Resume
                        </button>
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
                                    onChange={this.userHeaderChange}
                                    placeholder="Write something about yourself..."
                                    value={this.state.data["user"]["bio"]}>
                                </textarea>
                                <video 
                                    className="video"
                                    controls={true}>
                                    Unable to play video. Please consider updating your browser.
                                </video>
                            </div>
                        </div>
                        <div className="title"><p>Work Experience</p></div>
                        <div className="title-hr" />
                        <div className="section">
                            {experienceMap}
                            {addExperienceButton}
                        </div>
                        <div className="title"><p>Skills</p></div>
                        <div className="title-hr" />
                        <div className="section">
                            {skillMap}
                            {addSkillButton}
                        </div>
                        <div className="title"><p>Education</p></div>
                        <div className="title-hr" />
                        <div className="section">
                            {educationMap}
                            {addEducationButton}
                        </div>
                        <div className="title"><p>Language</p></div>
                        <div className="title-hr" />
                        <div className="section">
                            {languageMap}
                            {addLanguageButton}
                        </div>
                        <div className="title"><p>Contact Info</p></div>
                        <div className="title-hr" />
                        <div className="section">
                            Email : {this.state.data["user"]["email"]}
                        </div>
                        {changeButtons}
                    </form>
                </div>

            </div>
        );
    }
}

export default CandidateProfil;