import React from 'react';
import './Profil.css';
import Navbar from './Navbar';

class Profil extends React.Component {
    constructor(props) {
        super();
        this.state = {
            jwt: "",
            editFlag : false,
            experience : []
        };

        this.toggleEdit = this.toggleEdit.bind(this);
        this.removeItem = this.removeItem.bind(this);
        this.addItem = this.addItem.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.discardChanges = this.discardChanges.bind(this);

        this.getUserData = this.getUserData.bind(this);
    }

    componentDidMount() {
        this.setState({jwt: localStorage.getItem("jwt")});
        this.getUserData();
    }

    // open edit mode - be able to edit all values (remove and add new)
    toggleEdit() {
        this.setState({
            editFlag : !this.state.editFlag
        });
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

    discardChanges() {
        this.setState({
            experience : []
        });
        this.getUserData();
    }

    // Handle Submit of login form
    async getUserData() {
        /*const url = 'http://localhost:80//junior-workers/api/get-experience.php';
        const data = {"jwt": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOlwvXC9leGFtcGxlLm9yZyIsImF1ZCI6Imh0dHA6XC9cL2V4YW1wbGUuY29tIiwiaWF0IjoxMzU2OTk5NTI0LCJuYmYiOjEzNTcwMDAwMDAsImRhdGEiOnsiaWRfdXNlciI6IjMifX0.xHRgutqlwwoi6PLWz9x0xaTelSZmFDXls8tD9Cjh8tU"};

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
                console.error("WRONG!")
            }
            else if (response.status == 200) {
                const json = await response.json();
                this.setState({experience : json["experience"]});
            }
        } catch (error) {
            console.error('Error:', error);
        }*/
    }

    render() {

        // On edit mode, display exit and save changes button
        var changeButtons = "";
        if(this.state.editFlag) {
            changeButtons = <div className="change-buttons">
                                <button><i className="fa fa-check" /></button>
                                <button onClick={this.discardChanges}><i className="fa fa-times" /></button>
                            </div>;
        }

        // display add job option if you are on edit mode
        var addExperienceButton = "";
        if(this.state.editFlag) addExperienceButton = 
            <button className="add-btn" onClick={this.addItem} name="experience">
                <i className="fa fa-plus" />Add Experience
            </button>;

        // Map experience from json to div
        var experienceMap = [];
        this.state.experience.forEach((item, index) => {
            if(item !== ""){
                // display remove job if you are on edit mode
                var removeButton = "";
                var readonly = true;
                if(this.state.editFlag) {
                    removeButton = <button className="work-remove" id={"experience_"+index+"_remove"} onClick={this.removeItem}>
                        <i className="fa fa-times" />
                    </button>;
                    readonly = false;
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
        if(this.state.experience.length === 0) experienceMap = "No experience so far";
        

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
                        <div className="profil-fullname">John Deligiannis</div>
                        <div className="profil-headline">Software Developer</div>
                        <div className="profil-availability">Available to hire</div>
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