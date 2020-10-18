import React from 'react';
import './Search.css';
import Navbar from './Navbar.js';
import  { Redirect } from 'react-router-dom';

class Search extends React.Component{
    constructor(props) {
        super();
        this.state = {
            redirect: "",
            jwt: localStorage.getItem("jwt"),
            email: localStorage.getItem("email"),
            dropListData: {
                "profession": [],
                "skill": [],
                "education": [],
                "education_level": [],
                "language": [],
                "language_level": []
            },
            navbar: "",
            searchType: "candidate",
            searchInput: "",
            results: [],
        };

        this.changeSearchType = this.changeSearchType.bind(this);
        this.changeSearchInput = this.changeSearchInput.bind(this);
        this.getUserData = this.getUserData.bind(this);
        this.searchUsers = this.searchUsers.bind(this);
        this.getDropListData = this.getDropListData.bind(this);
        this.viewProfil = this.viewProfil.bind(this);
        this.goToMain = this.goToMain.bind(this);
    }


    // Check if the jwt of user is valid in order to display the navbar
    componentDidMount() {
        if(this.state.jwt !== "" && this.state.jwt !== null) {
            this.getUserData();
        }
        this.getDropListData();
        if(localStorage.getItem("searchInput") !== "") {
            this.setState({
                searchInput: localStorage.getItem("searchInput")
            });
        }
        this.searchUsers();
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
                var json = await response.json().then((res)=>{
                    this.setState({
                        data : res,
                        navbar: <Navbar selectedLink="search" role={res.user.role} />
                    });
                });
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }

    // Get all users from search
    async searchUsers() {
        var url = 'http://localhost:8080/api/search/all?role='+this.state.searchType+'&key='+this.state.searchInput;
        try {
            var response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                }
            });
            if(response.status !== 200) {
                console.error("Unable to search");
            }
            else if (response.status === 200) {
                await response.json().then((res)=>{
                    this.setState({
                        results: res.results
                    });
                });
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }

    changeSearchInput(e) {
        e.preventDefault();
        var input = document.getElementById("search-input");
        this.setState({
            searchInput: input.value
        });
    }

    changeSearchType(e) {
        e.preventDefault();
        var candidate = document.getElementById("candidate-search");
        var postJob = document.getElementById("job-post-search");
        
        if(e.target.id === "candidate-search") {
            candidate.classList.add("search-button-active");
            postJob.classList.remove("search-button-active");
            this.setState({
                searchType: "candidate"
            }, ()=>{
                this.searchUsers();
            });
        } else if (e.target.id === "job-post-search") {
            candidate.classList.remove("search-button-active");
            postJob.classList.add("search-button-active");
            this.setState({
                searchType: "hirer"
            }, ()=>{
                this.searchUsers();
            });
        }
    }

    viewProfil(e) {
        e.preventDefault();
        var email = e.target.id.split("_")[1];
        var role = e.target.id.split("_")[2];
        localStorage.setItem("emailViewOnly", email);
        var tmp;
        if(role === "candidate") {
            tmp = <Redirect to="/candidate-profil" />;
        }else if (role === "hirer") {
            tmp = <Redirect to="/hirer-profil" />;
        }
        this.setState({
            redirect: tmp
        });
    }

    goToMain() {
        var tmp = <Redirect to="/" />;
        this.setState({
            redirect: tmp
        });
    }


    render() {
        var resultsMap = <div className="msg">No results found</div>;
        if(this.state.results.length > 0) {
            if(this.state.results[0].role === "candidate") {
                resultsMap = [];
                this.state.results.forEach((item, index) => {

                    let viewProfilButtonUnable = false;
                    if(this.state.jwt === null || this.state.jwt === "") viewProfilButtonUnable = true;

                    resultsMap.push(
                        <div className="result" key={"result"+index}>
                            <img src={"http://localhost/junior-workers/api/uploads/"+item.image_path} />
                            <div className="labels">
                                <div className="name">{item.firstname}</div>
                                <div className="lastname">{item.lastname}</div>
                                <div className="title">{item.title}</div>
                                <button id={"view-profil"+index+"_"+item.email+"_"+item.role}
                                        title="Login and view this person's profil!"
                                        disabled={viewProfilButtonUnable} onClick={this.viewProfil}>
                                    <i className="fa fa-eye" />
                                    <div>View profil</div>
                                </button>
                            </div>
                        </div>
                    );
                });  
            }
            else if(this.state.results[0].role === "hirer") {
                resultsMap = [];
                this.state.results.forEach((item, index) => {
                    // map all professions into option - select
                    var professionMap = [];
                    this.state.dropListData["profession"].forEach((pro_item, pro_index) => {
                        professionMap.push(
                            <option value={pro_item.id_profession} key={"profession_option__"+index+"__"+pro_index}>{pro_item.title}</option>
                        );
                    });
                    resultsMap.push(
                        <div className="result" key={"result"+index}>
                            <img src={"http://localhost/junior-workers/api/uploads/"+item.image_path} />
                            <div className="labels">
                                <div className="name">{item.firstname}</div>
                                <div className="lastname">{item.lastname}</div>
                                <div className="title">{item.title}</div>
                                <button id={"view-profil"+index+"_"+item.email+"_"+item.role} onClick={this.viewProfil}>
                                    <i className="fa fa-eye" />
                                    <div>View profil</div>
                                </button>
                            </div>
                            <div className="job">
                                <div className="title">
                                    {item.job_title}
                                </div>
                                <div className="description">
                                    {item.description}
                                </div>
                                <div className="looking">
                                    <div className="label">Looking for a</div>
                                    <select 
                                        disabled={true} 
                                        value={item.id_profession} >
                                        {professionMap}
                                    </select>
                                </div>
                            </div>
                        </div>
                    );
                });
            }
        }

        var returnButton = "";
        if(this.state.jwt === "" || this.state.jwt === null) {
            returnButton = <button className="return-button" onClick={this.goToMain}>
                                <i className="fa fa-arrow-left" />
                            </button>;
        }

        return(
            <div className="Search">
                {this.state.redirect}

                {this.state.navbar}

                <img id="bg" className="background" src={require('./images/backgroundBig.jpg')} />

                <div className="logo">
                    <div className="title1" style={{color: "#232323", backgroundColor:"#F25F5C"}}>Junior</div>
                    <div className="title2">Workers</div>
                </div>

                {returnButton}

                <div className="search-container">
                    <div className="control">
                        <div className="search-field">
                            <i className="fa fa-search" />
                            <input type="text" placeholder="Type..." id="search-input" onChange={this.changeSearchInput} />
                            <hr />
                            <button onClick={this.searchUsers}>
                                Search
                            </button>
                        </div>
                        <div className="target-field">
                            <button id="candidate-search" onClick={this.changeSearchType} className="search-button-active" >
                                Candidate
                            </button>
                            <button id="job-post-search" onClick={this.changeSearchType} >
                                Job post
                            </button>
                        </div>
                    </div>
                    <div className="results">
                        {resultsMap}
                    </div>
                </div>
            </div>
        );
    }
}

export default Search;
