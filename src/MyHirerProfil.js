import React from 'react';
import './Profil.css';
import Navbar from './Navbar';
import  { Redirect } from 'react-router-dom';
import DisplayMessage from './DisplayMessage';

class MyHirerProfil extends React.Component {
    constructor(props) {
        super();
        this.state = {
            redirect: "",
            jwt: localStorage.getItem("jwt"),
            email: localStorage.getItem("email"),
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
                "job_post": []
            },
            displayMessage: "",
            displayMessageFlag: false
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
        this.removeImage = this.removeImage.bind(this);
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
        if(button.classList.contains("fa-times")) {
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
        if(Number(this.state.data["user"]["availability"]) === 1) {
            temp = this.state.data;
            temp["user"]["availability"] = 0;
            this.setState({
                data: temp
            });
        } else {
            temp = this.state.data;
            temp["user"]["availability"] = 1;
            this.setState({
                data: temp
            });
        }
    }

    // handle user's data input change
    // each Data component is distinguished by an id with the form : nameOfData__indexInJson__nameOfItem
    // ex. skill__0__title means the data item skill with index 0 and name title called the function 

    // for components with other object inside we have id with 4 keys. nameOfData_objectKey_IndexInJson_nameOfItem
    userDataChange(e) {
        e.preventDefault();
        var value = e.target.value;
        var attr = e.target.id.split("__");

        if(attr.length > 3) {
            var dataName = attr[0];
            var keyName = attr[1];
            var index = attr[2];
            var name = attr[3];
            var temp = this.state.data;
            temp[dataName][index][keyName][name] = Number(value);
        } else {
            var dataName = attr[0];
            var index = attr[1];
            var name = attr[2];
            var temp = this.state.data;
            temp[dataName][index][name] = Number(value);
        }
        
        this.setState({
            data: temp
        });
    }

    // add user's skill item
    addUserData(e) {
        e.preventDefault();
        var temp = this.state.data;
        var dataName = e.target.name;
        if(dataName === "job_post") {
            temp["job_post"].push({
                "profession": {
                    "id_profession": Number(this.state.dropListData.profession[0].id_profession)
                },
                "title": "",
                "description": ""
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
        temp[dataName] = temp[dataName].filter((item)=>{return item !== ""});

        this.setState({
            data: temp
        });
    }

    // remove all user's data and get them from db again
    discardChanges() {
        this.setState({
            data : {
                "user": [],
                "job_post": []
            }
        });
        this.getUserData();
        this.toggleEdit();
    }

    async imageChange(e) {
        e.preventDefault();

        var file = document.getElementById("image-file").files[0];
        var fileName = file.name;
        var extensions = ["png", "jpg", "jpeg"];
        var fileExtention = fileName.split(".").pop().toLowerCase();
        //var fileSize = file.size;

        if(extensions.includes(fileExtention)) {
           /*
            NOTE : codes returned from the post-image.php
            $SUCCESS_CODE = "0";
            $ERROR_CODE = "1";
            $ERROR_FORMAT_CODE = "2";
            $ERROR_SIZE_CODE = "3";
            */

            // procced to upload image
            const url = 'http://localhost:80//junior-workers/api/post-image.php';
            //const data = {"jwt": this.state.jwt, "data": this.state.imageFile};
            var formData = new FormData();
            formData.append("image_file", file);
            formData.append("jwt", this.state.jwt);

            try {
                const response = await fetch(url, {
                    method: 'POST',
                    body: formData,
                });
                const json = await response.json();
                if(response.status !== 200) {
                    if(json["code"] === "1") {
                        this.setState({
                            displayMessage: "Unable to upload image",
                        });
                    } else if (json["code"] === "2") {
                        this.setState({
                            displayMessage: "Image not in proper format",
                        });
                    } else if (json["code"] === "3") {
                        this.setState({
                            displayMessage: "Image's size cannot be larger than 10mb",
                        });
                    }
                }
                else if (response.status === 200 && json["code"] === "0") {
                    this.setState({
                        displayMessage: "Profil image has been updated"
                    });
                    this.getUserData();
                }
            } catch (error) {
                console.error('Error:', error);
                this.setState({
                    displayMessage: "Unable to upload image",
                });
            }
        } else {
            this.setState({
                displayMessage: "File doesn't have valid image extension.",
            });
        }

        this.setState({
            displayMessageFlag: !this.state.displayMessageFlag
        });
        
    }

    // remove user's image
    async removeImage() {

        var url = 'http://localhost:80//junior-workers/api/remove-user-image.php';
        var data = {"jwt": this.state.jwt};

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
                console.error("Unable to post user's data");
                this.setState({
                    displayMessage: "Unable to remove image",
                    displayMessageFlag: !this.state.displayMessageFlag
                });
            }
            else if (response.status === 200) {
                //var json = await response.json();
                //console.log("Data posted");
                this.setState({
                    displayMessage: "Profil image has been removed",
                    displayMessageFlag: !this.state.displayMessageFlag
                });
                this.getUserData();
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }

    // post all user's data changes to db
    async saveChanges(e) {
        e.preventDefault();
        var url = 'http://localhost:8080/api/user/update';
        var data = {
            "jwt": this.state.jwt,
            "user": this.state.data.user,
            "job_post": this.state.data.job_post
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
                console.error("Unable to post user's data")
            }
            else if (response.status === 200) {
                this.getUserData();
                this.toggleEdit();
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }

    // Get all user's data using their jwt auth
    async getUserData() {
        var url = 'http://localhost:8080/api/user/get';
        var data = {
            "jwt": this.state.jwt,
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
                localStorage.removeItem("jwt");
                localStorage.removeItem("email");
                this.setState({
                    jwt: "",
                    email: ""
                });
            }
            else if (response.status === 200) {
                var json = await response.json().then((res)=> {
                    this.setState({data : json});
                });
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }

    async getDropListData() {
        var url = 'http://localhost:8080/api/model/get/all';
        try {
            var response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                }
            });
            if(response.status !== 200) {
                console.error("Unable to get drop list data");
            }
            else if (response.status === 200) {
                var json = await response.json().then((res)=>{
                    this.setState({
                        dropListData: res
                    });
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
        var addJobPostButton = "";
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
            addJobPostButton = <button className="add-btn" onClick={this.addUserData} name="job_post">
                                    <i className="fa fa-plus" />Add Job Post
                                </button>;
            // display buttons to edit profil image
            editImageButtons = <div className="profil-image-buttons">
                                    <label htmlFor="image-file" title="upload new profil picture">
                                        <i className="fa fa-upload" />
                                    </label>
                                    <input id="image-file" type="file" onChange={this.imageChange} name="image" />
                                    <button title="remove saved profil picture" onClick={this.removeImage}>
                                        <i className="fa fa-trash" />
                                    </button>
                                </div>;
        }

        // display availability according to state
        var availabilityText = <p>Not Hiring</p>;
        if(this.state.data["user"]["availability"] === "1") availabilityText = <p>Hiring</p>; 

        // Map jobPost from json to div
        var jobPostMap = [];
        this.state.data["job_post"].forEach((item, index) => {
            if(item !== ""){
                // display remove job if you are on edit mode
                var removeButton = "";
                if(this.state.editFlag) {
                    removeButton = <button className="work-remove" id={"job_post__"+index+"__remove"} onClick={this.removeUserData}>
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
                // push job_post div
                jobPostMap.push(
                    <div className="post" key={"job_post"+index}>
                        <p className="post-label">Job title</p>
                        <textarea
                            type="text" 
                            readOnly={this.state.readonly} 
                            id={"job_post__"+index+"__title"} 
                            onChange={this.userDataChange} 
                            defaultValue={item.title}
                            placeholder="Job title"
                            required={true} />
                        <p className="post-label">Looking for</p>
                        <select 
                            id={"job_post__profession__"+index+"__id_profession"}
                            disabled={this.state.disabled} 
                            value={item.profession.id_profession}
                            onChange={this.userDataChange} >
                            {professionMap}
                        </select>
                        <p className="post-label">Job Description</p>
                        <textarea 
                            readOnly={this.state.readonly} 
                            id={"job_post__"+index+"__description"} 
                            onChange={this.userDataChange} 
                            defaultValue={item.description}
                            placeholder="Describe the position for the job here"
                            required={true} />
                        {removeButton}
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

                <Navbar selectedLink="profil" role={this.state.data["user"]["role"]} />

                <div className="profil-container">
                    <img className="profil-image" src={"http://localhost/junior-workers/api/uploads/"+this.state.data["user"]["image_path"]} />
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
                            placeholder="Company name"
                            id="title"
                            onChange={this.userHeaderChange}
                        />
                    </div>
                    <div className="profil-header2">
                        {editImageButtons}
                        <div className="profil-availability">
                            {availabilityText}{availabilityButton}
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
                                    onChange={this.userHeaderChange}
                                    placeholder="Write something about your company..."
                                    value={this.state.data["user"]["bio"]}>
                                </textarea>
                            </div>
                        </div>
                        <div className="title"><p>Job Posts</p></div>
                        <div className="title-hr" />
                        <div className="section">
                            {jobPostMap}
                            {addJobPostButton}
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

export default MyHirerProfil;