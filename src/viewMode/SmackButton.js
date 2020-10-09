import React from "react";
import "./SmackButton.css";

class SmackButton extends React.Component {
    constructor(props) {
        super(props);
        console.log('fake commit');
        this.state = {
            buttonType: this.props.type
        };
        this.clickButton = this.clickButton.bind(this);
    }


    clickButton() {
        this.props.socket.emit('smack');
    }

    render() {
        return (
            <div className='smackButton'>
                <span onClick={this.clickButton}>Smack</span>
            </div >
        );
    }
}

export default SmackButton;