import React from "react";
import SimpleButton from "./SimpleButton"

import SmackButton from "./SmackButton";

import "./NetflixPremier.css";

class NetflixPremier extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        };

    }


    render() {
        return (

            <div>
                <h1>Netflix Premier Mode</h1>



                <div className="playControlsBox">
                    <SimpleButton type='play' socket={this.props.socket}></SimpleButton>
                </div>
                <div id='connectionControlsBox'>
                    <SimpleButton type='goBack' socket={this.props.socket}></SimpleButton>
                    <SimpleButton type='close' socket={this.props.socket}></SimpleButton>
                    <SmackButton socket={this.props.socket}></SmackButton>
                </div>


            </div>
        );
    }
}

export default NetflixPremier;