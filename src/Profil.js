import React from 'react';
import './Profil.css';
import Navbar from './Navbar';

class Profil extends React.Component {
    constructor(props) {
        super();
        this.state = {
            jwt: localStorage.getItem("jwt"),
            editFlag : false,
            dropListData: {
                "profession": [],
                "skill": [],
                "education": []
            },
            data : {
                "user": [],
                "experience": [],
                "skill": [],
                "education": []
            }
        };

        this.toggleEdit = this.toggleEdit.bind(this);
        this.getUserData = this.getUserData.bind(this);
        this.availabilityChange = this.availabilityChange.bind(this);
        this.userDataChange = this.userDataChange.bind(this);
        this.discardChanges = this.discardChanges.bind(this);
        this.saveChanges = this.saveChanges.bind(this);
        this.userExperienceChange = this.userExperienceChange.bind(this);
        this.addUserExperience = this.addUserExperience.bind(this);
        this.removeUserExperience = this.removeUserExperience.bind(this);
        this.getDropListData = this.getDropListData.bind(this);
    }

    componentDidMount() {
        this.getUserData();
        this.getDropListData();
    }

    // open edit mode - be able to edit all values (remove and add new)
    toggleEdit() {
        this.setState({
            editFlag : !this.state.editFlag
        });
        // if you close edit without saving first, reset changes
        if(this.state.editFlag) {
            this.getUserData();
        }
    }

    // handle user data input change 
    userDataChange(e) {
        var id = e.target.id;
        var value = e.target.value;
        var temp = this.state.data;

        if(id === "firstname") {
            temp["user"]["firstname"] = value;
        } else if(id === "lastname") {
            temp["user"]["lastname"] = value;
        } else if(id === "title") {
            temp["user"]["title"] = value;
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

    // handle user's experience input change
    // each work component is distinguished by an id with the form : experience__indexInJson__nameOfItem
    // ex. experience__0__company means the item with index 0 and name company called the function 
    userExperienceChange(e) {
        var value = e.target.value;
        var attr = e.target.id.split("__");
        var index = attr[1];
        var name = attr[2];
        var temp = this.state.data;
        temp["experience"][index][name] = value;
        this.setState({
            data: temp
        });
    }

    // add user's experience item
    addUserExperience() {
        var temp = this.state.data;
        temp["experience"].push({
            "id_profession": this.state.dropListData.profession[0].id_profession, "company": "", "date": ""
        });
        this.setState({
            data: temp
        });
    }

    // remove user's experience
    // each work component remove button is distinguished by an id with the form : experience__indexInJson__remove
    // ex. experience__0__company means the item with index 0 will be removed from json 
    removeUserExperience(e) {
        var attr = e.target.id.split("__");
        var index = attr[1];
        var temp = this.state.data;
        temp["experience"][index] = "";
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
                "education": []
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
        var readonly = true;
        var changeButtons = "";
        var availabilityButton = "";
        var addExperienceButton = "";

        if(this.state.editFlag) {
            // make all input editable
            readonly = false;
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
            addExperienceButton = <button className="add-btn" onClick={this.addUserExperience} name="experience">
                                    <i className="fa fa-plus" />Add Experience
                                </button>;
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
                    removeButton = <button className="work-remove" id={"experience__"+index+"__remove"} onClick={this.removeUserExperience}>
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
                            readOnly={readonly} 
                            value={item.id_profession}
                            onChange={this.userExperienceChange} >
                            {professionMap}
                        </select>
                        <p className="work-label">At</p>
                        <input 
                            type="text" 
                            readOnly={readonly} 
                            id={"experience__"+index+"__company"} 
                            onChange={this.userExperienceChange} 
                            defaultValue={item.company}
                            placeholder="company"
                            required={true} />
                        <p className="work-label">Between</p>
                        <input 
                            type="text" 
                            readOnly={readonly} 
                            id={"experience__"+index+"__date"} 
                            onChange={this.userExperienceChange} 
                            defaultValue={item.date}
                            placeholder="date"
                            required={true} />
                        {removeButton}
                    </div>
                );
            }
        });
        if(this.state.data["experience"] === []) experienceMap = "No experience so far";
        


        return(
            <div className="Profil">
                <img id="bg" className="background" src={require('./images/backgroundBig.jpg')} />

                <div className="logo">
                    <div className="title1" style={{color: "#232323", backgroundColor:"#F25F5C"}}>Junior</div>
                    <div className="title2">Workers</div>
                </div>

                <Navbar selectedLink="profil" />

                <div className="profil-container">
                    <img className="profil-image" src={require('./images/profil-pic.png')} />
                    <div className="profil-header">
                        <button className="profil-edit-btn" onClick={this.toggleEdit}>
                            <i className="fa fa-edit" />
                        </button>
                        <input 
                            type="text" 
                            className="profil-name firstname"
                            value={this.state.data["user"]["firstname"]}
                            readOnly={readonly}
                            placeholder="Firstname"
                            id="firstname"
                            onChange={this.userDataChange}
                        />
                        <input 
                            type="text" 
                            className="profil-name lastname"
                            value={this.state.data["user"]["lastname"]}
                            readOnly={readonly}
                            placeholder="Lastname"
                            id="lastname"
                            onChange={this.userDataChange}
                        />
                        <input
                            type="text" 
                            className="profil-headline"
                            value={this.state.data["user"]["title"]}
                            readOnly={readonly}
                            placeholder="Profession title"
                            id="title"
                            onChange={this.userDataChange}
                        />
                        <div className="profil-availability">
                            {availabilityText}{availabilityButton}
                        </div>
                        <button className="profil-resume">
                            <i className="fa fa-arrow-down" />
                            Resume
                        </button>
                    </div>
                    <form className="profil-content" id="profil-form" onSubmit={this.saveChanges}>
                        <div className="title">Work Experience</div>
                        <div className="title-hr" />
                        <div className="section">
                            {experienceMap}
                            {addExperienceButton}
                        </div>
                        {changeButtons}
                    </form>
                </div>

            </div>
        );
    }
}

export default Profil;