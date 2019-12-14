import React from 'react';
import './Profil.css';
import Navbar from './Navbar';

class Profil extends React.Component {
    constructor(props) {
        super();
        this.state = {
            editFlag : false,
            experience : [
                {
                    "title":"programmer",
                    "company":"goggle",
                    "date":"34/23 - 34/34"
                },
                {
                    "title":"not programmer",
                    "company":"not goggle",
                    "date":"not 34/23 - 34/34"
                },
            ]
        };

        this.toggleEdit = this.toggleEdit.bind(this);
        this.removeWork = this.removeWork.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
    }

    // open edit mode - be able to edit all values (remove and add new)
    toggleEdit() {
        this.setState({
            editFlag : !this.state.editFlag
        });
    }

    // remove work item from user's work experience 
    removeWork(e) {
        var workIndexToRemove = e.target.name;
        var newExperience = this.state.experience;
        newExperience[workIndexToRemove] = "";
        this.setState({
            experience: newExperience
        });
    }

    // handle the input type="text" changes
    handleInputChange(e) {
        // the name of the calling component should be sectionName_indexOfLine_indexOfAttr
        var params = e.target.name.split("_");
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

    render() {

        // Map experience from json to div
        var experienceMap = [];
        this.state.experience.forEach((item, index) => {
            if(item !== ""){
                // add remove job if you are on edit mode
                var removeButton = "";
                var readonly = true;
                if(this.state.editFlag) {
                    removeButton = <button className="work-remove" name={index} onClick={this.removeWork}>x</button>;
                    readonly = false;
                } 
                experienceMap.push(
                    <div className="work" key={"experience"+index}>
                        <input 
                            type="text" 
                            readOnly={readonly} 
                            name={"experience_"+index+"_title"} 
                            onChange={this.handleInputChange} 
                            defaultValue={item.title} />
                        <input 
                            type="text" 
                            readOnly={readonly} 
                            name={"experience_"+index+"_company"} 
                            onChange={this.handleInputChange} 
                            defaultValue={item.company} />
                        <input 
                            type="text" 
                            readOnly={readonly} 
                            name={"experience_"+index+"_date"} 
                            onChange={this.handleInputChange} 
                            defaultValue={item.date} />
                        {removeButton}
                    </div>
                );
            }
        });
        // add job option if you are on edit mode
        if(this.state.experience.length === 0) experienceMap = "No experience so far";
        var addExperienceButton = "";
        if(this.state.editFlag) addExperienceButton = 
            <button className="add-btn">
                <i className="fa fa-plus" />Add Experience
            </button>;

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
                    </div>
                </div>

            </div>
        );
    }
}

export default Profil;