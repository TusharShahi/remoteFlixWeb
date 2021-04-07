import React from "react";
import "./SimpleButton.css";

class SimpleButton extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      buttonType: this.props.type,
      isPaused: this.props.paused,
      isSkipDisabled: this.props.disabled

    };
    this.clickButton = this.clickButton.bind(this);
    this.startScanner = this.startScanner.bind(this);

    this.buttonRef = React.createRef();
  }

  componentDidUpdate(prevProps) {
    if (this.state.buttonType == 'skipIntro') {
      console.log()
      if (prevProps.disabled != this.props.disabled) {
        this.setState({
          isSkipDisabled: this.props.disabled
        })
      }
    }
  }
  clickButton() {
    //console.og("callButton is called");
    //console.log(this.props.type);
    if (this.state.buttonType == 'play')
      this.setState({
        isPaused: true
      });
    else
      this.setState({
        isPaused: false
      });


    if (!this.state.isSkipDisabled) {
      if (this.state.buttonType == 'close') {
        this.props.socket.disconnect();
        this.props.onClose();
      }
      else if (this.state.buttonType == 'scan')
        this.props.onStartScanner();
      else if (this.state.buttonType == 'help') {
        this.props.onOpenTroubleShoot();
      }
      else
        this.props.socket.emit(this.state.buttonType);
      if (this.state.buttonType == 'nextEpisode')
        this.props.onNextEpisode();
    }

  }

  startScanner() {
    this.props.onStartScanner();

  }

  render() {
    let buttonType = this.state.buttonType;
    let divClassName = 'simpleButton ' + this.state.buttonType + 'Div';
    let button;
    if (buttonType == 'close') {
      button = <span>
        <img src="/iconPower.svg" alt="Close"></img>
      </span>
    }
    else if (buttonType == 'forward') {
      button = <span>
        <img src="/skipForward.svg" alt="skip forward"></img>
      </span>
    }
    else if (buttonType == 'backward') {
      button = <span>
        <img src="/skipBackward.svg" alt="skip backward"></img>
      </span>
    }
    else if (buttonType == 'play') {
      if (this.props.paused) {
        // console.log("paused --- ");
        button = <span>
          <img src="/iconPlay.svg" alt="play"></img>
        </span>
      }
      else {
        button = <span>
          <img src="/iconPause.svg" alt="pause"></img>
        </span>
      }
    }
    else if (buttonType == 'pause') {
      button = <span>Pause</span>
    }
    else if (buttonType == 'nextEpisode') {
      button = <span>
        <img src="/nextEpisode.svg" alt="next Episode"></img>
      </span>

      //document.getElementById('episodes').getElementsByTagName('option').selected = 'selected'
    }
    else if (buttonType == 'previous') {
      button = <span>
        <img src="/previousEpisode.svg" alt="previous"></img>
      </span>
    }
    else if (buttonType == 'muteToggle') {
      if (this.props.isMute) {
        button = <span><img src="/iconVolumeOff.svg" alt="Volume Off"></img></span>
      }
      else {
        button = <span><img src="/iconVolumeOn.svg" alt="Volume On"></img></span>
      }
    }
    else if (buttonType == 'fullScreenToggle') {
      button = <span>Full Screen Toggle</span>
    }
    else if (buttonType == 'skipIntro') {
      if (this.state.isSkipDisabled)
        divClassName += ' buttonDisabled'
      button = <span>Skip Intro</span>
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
    else if (buttonType == 'help') {
      button = <span>
        <img src="/iconHelp.svg" alt="help"></img>
      </span>
    }
    else if (buttonType == 'smackTV') {
      button = <span>
        <img src="/iconRefresh.svg" alt="Smack Remote"></img>
      </span>

    }

    return (
      <div className={divClassName} onClick={this.clickButton} ref={this.buttonRef}>
        {button}
      </div>
    );
  }
}

export default SimpleButton;