import React from "react";
import "./SimpleButton.css";

class SimpleButton extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      buttonType: this.props.type
    };
    this.clickButton = this.clickButton.bind(this);
  }


  clickButton() {
    //console.og("callButton is called");

    if (this.state.buttonType == 'close')
      this.props.socket.disconnect();
    else
      this.props.socket.emit(this.state.buttonType);
    if (this.state.buttonType == 'nextEpisode')
      this.props.onNextEpisode();

  }

  render() {
    let buttonType = this.state.buttonType;
    let button;
    if (buttonType == 'close') {
      button = <span onClick={this.clickButton}>Close</span>
    }
    else if (buttonType == 'forward') {
      button = <span onClick={this.clickButton}>Forward</span>
    }
    else if (buttonType == 'backward') {
      button = <span onClick={this.clickButton}>Backward</span>
    }
    else if (buttonType == 'play') {
      button = <span onClick={this.clickButton}>Play</span>
    }
    else if (buttonType == 'pause') {
      button = <span onClick={this.clickButton}>Pause</span>
    }
    else if (buttonType == 'nextEpisode') {
      button = <span onClick={this.clickButton}>Next Episode</span>

      //document.getElementById('episodes').getElementsByTagName('option').selected = 'selected'
    }
    else if (buttonType == 'muteToggle') {
      button = <span onClick={this.clickButton}>Mute Toggle</span>
    }
    else if (buttonType == 'fullScreenToggle') {
      button = <span onClick={this.clickButton}>Full Screen Toggle</span>
    }
    else if (buttonType == 'skipIntro') {
      button = <span onClick={this.clickButton}>Skip Intro/Recap</span>
    }
    else if (buttonType == 'volumeUp') {
      button = <span onClick={this.clickButton}>Vol. Up</span>
    }
    else if (buttonType == 'volumeDown') {
      button = <span onClick={this.clickButton}>Vol. Down</span>
    }

    return (
      <div>
        {button}
      </div>
    );
  }
}

export default SimpleButton;