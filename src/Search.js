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
            navbar: "",
            searchType: "candidate",
            searchInput: "",
            results: []
        };

        this.changeSearchType = this.changeSearchType.bind(this);
        this.changeSearchInput = this.changeSearchInput.bind(this);
        this.getUserData = this.getUserData.bind(this);
        this.searchUsers = this.searchUsers.bind(this);
        this.getDropListData = this.getDropListData.bind(this);
        this.viewProfil = this.viewProfil.bind(this);
    }


    // Check if the jwt of user is valid in order to display the navbar
    componentDidMount() {
        localStorage.removeItem("email");
        if(this.state.jwt !== "" || this.state.jwt !== null) {
            this.getUserData();
            if(this.state.data["user"] !== "" || this.state.data["user"] !== null) {
                var tmp = <Navbar selectedLink="search" />
                this.setState({
                    navbar: tmp
                });
            }
        }
        this.getDropListData();
        this.searchUsers();
    }


    // Get all user's data using their jwt auth
    async getUserData() {
        var url = 'http://localhost:80//junior-workers/api/get-user-data.php';
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
                console.error("Unable to get user's data")
            }
            else if (response.status == 200) {
                var json = await response.json();
                this.setState({data : json});
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
            else if (response.status == 200) {
                var json = await response.json();
                this.setState({
                    dropListData: json
                });
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }

    // Get all users from search
    async searchUsers() {
        var url = 'http://localhost:80//junior-workers/api/search.php';
        var data = {
            "searchType": this.state.searchType,
            "searchInput": this.state.searchInput
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
                console.error("Unable to search")
            }
            else if (response.status == 200) {
                var json = await response.json();
                this.setState({"results" : json.results});
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
        } else if (e.target.id === "job-post-search") {
            candidate.classList.remove("search-button-active");
            postJob.classList.add("search-button-active");
        }
    }

    viewProfil(e) {
        e.preventDefault();
        var email = e.target.id.split("_")[1];
        localStorage.setItem("email", email);
        var tmp = <Redirect to="/candidate-profil" />;
        this.setState({
            redirect: tmp
        });
    }


    render() {
        var resultsMap = <div className="msg">No results found</div>;
        if(this.state.results !== []) {
            resultsMap = [];
            this.state.results.forEach((item, index) => {
                resultsMap.push(
                    <div className="result" key={"result"+index}>
                        <img src={"http://localhost/junior-workers/api/uploads/"+item.image_path} />
                        <div className="labels">
                            <div className="name">{item.firstname}</div>
                            <div className="lastname">{item.lastname}</div>
                            <div className="title">{item.title}</div>
                            <button id={"view-profil"+index+"_"+item.email} onClick={this.viewProfil}>
                                <i className="fa fa-eye" />
                                <div>View Profil</div>
                            </button>
                        </div>
                    </div>
                );
            });    
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
