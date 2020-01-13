import React from 'react';
import './Search.css';
import Navbar from './Navbar.js';

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
            navbar: ""
        };

        this.getUserData = this.getUserData.bind(this);
        this.getDropListData = this.getDropListData.bind(this);
    }


    // Check if the jwt of user is valid in order to display the navbar
    componentDidMount() {
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


    render() {
        return(
            <div className="Search">
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
                            <input type="text" placeholder="Type..." />
                            <hr />
                            <button>
                                Search
                            </button>
                        </div>
                        <div className="target-field">
                            <button className="search-button-active">
                                Candidate
                            </button>
                            <button className="">
                                Job post
                            </button>
                        </div>
                    </div>
                    <div className="results">

                    </div>
                </div>
            </div>
        );
    }
}

export default Search;
