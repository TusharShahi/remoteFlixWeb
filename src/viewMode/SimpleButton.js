import React from "react";
import "./SimpleButton.css";

class SimpleButton extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      buttonType: this.props.type
    };
    this.clickButton = this.clickButton.bind(this);
    this.startScanner = this.startScanner.bind(this);

  }


  clickButton() {
    //console.og("callButton is called");
    console.log(this.props.type);
    if (this.state.buttonType == 'close')
      this.props.socket.disconnect();
    else if (this.state.buttonType == 'scan')
      this.props.onStartScanner();
    else
      this.props.socket.emit(this.state.buttonType);
    if (this.state.buttonType == 'nextEpisode')
      this.props.onNextEpisode();

  }

  startScanner() {
    this.props.onStartScanner();

  }

  render() {
    let buttonType = this.state.buttonType;
    let divClassName = 'simpleButton ' + this.state.buttonType + 'Div';
    let button;
    if (buttonType == 'close') {
      button = <span className='closeButton'><i class="fas fa-power-off"></i></span>
    }
    else if (buttonType == 'forward') {
      button = <span><i class="fas fa-forward"></i></span>
    }
    else if (buttonType == 'backward') {
      button = <span><i class="fas fa-backward"></i></span>
    }
    else if (buttonType == 'play') {
      button = <span>
        <i class="fa fa-play"></i>
        <i class="fa fa-pause"></i>
      </span>
    }
    else if (buttonType == 'pause') {
      button = <span>Pause</span>
    }
    else if (buttonType == 'nextEpisode') {
      button = <span><i class="fas fa-step-forward"></i></span>

      //document.getElementById('episodes').getElementsByTagName('option').selected = 'selected'
    }
    else if (buttonType == 'muteToggle') {
      if (this.props.isMute) {
        button = <span><i class="fas fa-volume-mute"></i></span>
      }
      else {
        button = <span><i class="fas fa-volume-up"></i></span>
      }
    }
    else if (buttonType == 'fullScreenToggle') {
      button = <span>Full Screen Toggle</span>
    }
    else if (buttonType == 'skipIntro') {
      button = <span>Skip</span>
    }
    else if (buttonType == 'skipCredits') {
      button = <span>Next Episode</span>
    }
    else if (buttonType == 'volumeUp') {
      button = <span><i class="fas fa-plus"></i></span>
    }
    else if (buttonType == 'volumeDown') {
      button = <span ><i class="fas fa-minus"></i></span>
    }
    else if (buttonType == 'scan') {
      button = <span>Scan</span>
    }

    return (
      <div className={divClassName} onClick={this.clickButton}>
        {button}
      </div>
    );
  }
}

export default SimpleButton;