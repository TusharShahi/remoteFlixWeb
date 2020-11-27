import React from "react";
import "./SmackButton.css";

class SmackButton extends React.Component {
    constructor(props) {
        super(props);
        //console.log('fake commit');
        this.state = {
        };
        this.clickButton = this.clickButton.bind(this);
    }


    clickButton() {
        this.props.socket.emit(this.props.type);
    }

    render() {
        let buttonText;
        if (this.props.type == 'smackRemote') {
            buttonText = 'Smack Remote';
        }
        else if (this.props.type == 'smackTV') {
            buttonText = <i class="fas fa-redo"></i>;
        }

        return (
            <div className='smackButton'>
                <span onClick={this.clickButton}>{buttonText}</span>
            </div >
        );
    }
}

export default SmackButton;