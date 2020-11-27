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
    let divClassName = this.state.buttonType + 'Div';
    let button;
    if (buttonType == 'close') {
      button = <span onClick={this.clickButton} className='closeButton'><i class="fas fa-power-off"></i></span>
    }
    else if (buttonType == 'forward') {
      button = <span onClick={this.clickButton}><i class="fas fa-forward"></i></span>
    }
    else if (buttonType == 'backward') {
      button = <span onClick={this.clickButton}><i class="fas fa-backward"></i></span>
    }
    else if (buttonType == 'play') {
      button = <span onClick={this.clickButton}>
        <i class="fa fa-play"></i>
        <i class="fa fa-pause"></i>
      </span>
    }
    else if (buttonType == 'pause') {
      button = <span onClick={this.clickButton}>Pause</span>
    }
    else if (buttonType == 'nextEpisode') {
      button = <span onClick={this.clickButton}><i class="fas fa-step-forward"></i></span>

      //document.getElementById('episodes').getElementsByTagName('option').selected = 'selected'
    }
    else if (buttonType == 'muteToggle') {
      button = <span onClick={this.clickButton}><i class="fas fa-volume-mute"></i></span>
    }
    else if (buttonType == 'fullScreenToggle') {
      button = <span onClick={this.clickButton}>Full Screen Toggle</span>
    }
    else if (buttonType == 'skipIntro') {
      button = <span onClick={this.clickButton}>Skip</span>
    }
    else if (buttonType == 'volumeUp') {
      button = <span onClick={this.clickButton}><i class="fas fa-plus"></i></span>
    }
    else if (buttonType == 'volumeDown') {
      button = <span onClick={this.clickButton}><i class="fas fa-minus"></i></span>
    }

    return (
      <div className={divClassName}>
        {button}
      </div>
    );
  }
}

export default SimpleButton;