import React from "react";

 class SimpleButton extends React.Component {
  constructor(props){
    super(props);

    this.state = {
      buttonType : this.props.type
    };
    this.clickButton = this.clickButton.bind(this);
  }


  clickButton(){
    console.log("callButton is called");
    this.props.socket.emit(this.state.buttonType);
  } 

  render() {
    let buttonType = this.state.buttonType;
    let button;
    if(buttonType == 'forward'){
     button = <span onClick={this.clickButton}>Forward</span>     
    }
    else if(buttonType == 'backward'){
      button = <span onClick={this.clickButton}>Backward</span>
    }
    else if(buttonType == 'play'){
      button = <span onClick={this.clickButton}>Play</span>
    }
    else if(buttonType == 'pause'){
      button = <span onClick={this.clickButton}>Pause</span>
    }
    else if(buttonType == 'nextEpisode'){
      button = <span onClick={this.clickButton}>Next Episode</span>  
    }
    else if(buttonType == 'muteToggle'){
      button = <span onClick={this.clickButton}>Mute Toggle</span>        
    }
    return (
      <div>
          {button}
      </div>
    );
  }
}

export default SimpleButton;