import React from 'react';
import './DisplayMessage.css'

class DisplayMessage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            displayMessageFlag: this.props.displayMessageFlag,
            message: ""
        };
        this.displayMessage = this.displayMessage.bind(this);
    }

    componentDidUpdate() {
        if(this.props.displayMessageFlag !== this.state.displayMessageFlag) {
            this.setState({
                displayMessageFlag: this.props.displayMessageFlag
            });
            if(this.props.displayMessage !== "" && this.props.displayMessage !== null) {
                this.displayMessage();
            }
        }
    }

    // display each new message given and after 3 seconds close it.
    displayMessage() {
        var msg = document.querySelector(".DisplayMessage");
        msg.classList.remove("deactivate-display-message");
        this.setState({
            message: this.props.displayMessage
        });
        setTimeout(()=>{
            msg.classList.add("deactivate-display-message");
            this.setState({
                message: ""
            });
        }, 3000);
    }

    render() {
        return (
            <div className="DisplayMessage deactivate-display-message">
                <p>{this.state.message}</p>
            </div>
        );
    }
}

export default DisplayMessage;