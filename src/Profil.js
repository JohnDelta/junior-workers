import React from 'react';
import './Profil.css';
import Navbar from './Navbar';

class Profil extends React.Component {
    constructor(props) {
        super();
        this.state = {
            jwt: localStorage.getItem("jwt"),
            editFlag : false,
            data : {
                "user": [],
                "experience": [],
                "skill": [],
                "education": []
            }
        };

        this.toggleEdit = this.toggleEdit.bind(this);
        this.removeItem = this.removeItem.bind(this);
        this.addItem = this.addItem.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        

        // keep these
        this.getUserData = this.getUserData.bind(this);
        this.availabilityChange = this.availabilityChange.bind(this);
        this.userDataChange = this.userDataChange.bind(this);
        this.discardChanges = this.discardChanges.bind(this);
        this.saveChanges = this.saveChanges.bind(this);

        /**
         * next: display properly new added work experience.
         * then modify experience.php to work with that on read and then on post.
         */
    }

    componentDidMount() {
        this.getUserData();
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

    // remove item from user's input type = "text" info
    // the name of the calling component should have
    //  this format sectionName_indexOfLine
    removeItem(e) {
        var params = e.target.id.split("_");
        var section = params[0];
        var line = params[1];
        var newExperience = this.state.experience;
        newExperience[line] = "";
        this.setState({
            experience: newExperience
        });
    }

    // add item as user's input type = "text" info
    // the name of the calling component should have
    //  this name sectionName (which is in)
    addItem(e) {
        var section = e.target.id;
        var newExperience = this.state.experience;
        newExperience.push({
            "title": "", "company": "", "date": ""
        });
        this.setState({
            experience: newExperience
        });
    }

    // handle the input type="text" changes
    // the name of the calling component should have
    //  this format sectionName_indexOfLine_indexOfAttr
    handleInputChange(e) {
        var params = e.target.id.split("_");
        var section = params[0];
        var line = params[1];
        var attr = params[2];
        var value = e.target.value;
        var newExperience = this.state.experience;
        newExperience[line][attr] = value;
        this.setState({
            experience: newExperience
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
    async saveChanges() {
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
                console.log("Data posted");
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

    render() {

        // On edit mode change
        var readonly = true;
        var changeButtons = "";
        var availabilityButton = "";
        if(this.state.editFlag) {
            // make all input editable
            readonly = false;
            // display save and exit changes button
            changeButtons = <div className="change-buttons">
                                <button onClick={this.saveChanges}><i className="fa fa-check" /></button>
                                <button onClick={this.discardChanges}><i className="fa fa-times" /></button>
                            </div>;
            // add availability change button
            availabilityButton = <button className="profil-availability-button" onClick={this.availabilityChange}>
                                    <i className="fa fa-refresh" />
                                </button>;
        }

        // availability state change
        var availabilityText = <p>Not available to hire</p>;
        if(this.state.data["user"]["availability"] === "1") availabilityText = <p>Available to hire</p>;

        // display add job option if you are on edit mode
        var addExperienceButton = "";
        if(this.state.editFlag) addExperienceButton = 
            <button className="add-btn" onClick={this.addItem} name="experience">
                <i className="fa fa-plus" />Add Experience
            </button>;

        // Map experience from json to div
        var experienceMap = [];
        this.state.data["experience"].forEach((item, index) => {
            if(item !== ""){
                // display remove job if you are on edit mode
                var removeButton = "";
                if(this.state.editFlag) {
                    removeButton = <button className="work-remove" id={"experience_"+index+"_remove"} onClick={this.removeItem}>
                        <i className="fa fa-times" />
                    </button>;
                } 
                experienceMap.push(
                    <div className="work" key={"experience"+index}>
                        <input 
                            type="text" 
                            readOnly={readonly} 
                            id={"experience_"+index+"_title"} 
                            onChange={this.handleInputChange} 
                            defaultValue={item.title} />
                        <input 
                            type="text" 
                            readOnly={readonly} 
                            id={"experience_"+index+"_company"} 
                            onChange={this.handleInputChange} 
                            defaultValue={item.company} />
                        <input 
                            type="text" 
                            readOnly={readonly} 
                            id={"experience_"+index+"_date"} 
                            onChange={this.handleInputChange} 
                            defaultValue={item.date} />
                        {removeButton}
                    </div>
                );
            }
        });
        if(this.state.data["experience"].length === 0) experienceMap = "No experience so far";
        


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
                    <div className="profil-content">
                        <div className="title">Work Experience</div>
                        <div className="title-hr" />
                        <div className="section">
                            {experienceMap}
                            {addExperienceButton}
                        </div>
                        {changeButtons}
                    </div>
                </div>

            </div>
        );
    }
}

export default Profil;