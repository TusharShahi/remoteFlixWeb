import React from "react";

 class SimpleButton extends React.Component {
  constructor(props){
    super(props);

    this.state = {
      buttonType : this.props.type,
      socket : this.props.socket
    };
    this.clickButton = this.clickButton.bind(this);
  }


  clickButton(){
    console.log("callButton is called");
    this.state.socket.emit(this.state.buttonType);
  } 

  render() {
    let buttonType = this.state.buttonType;
    let button;
    if(buttonType == 'forward'){
     button = <span onClick={this.clickButton}>&#x23ef;</span>     
    }
    else if(buttonType == 'backward'){
      button = <span onClick={this.clickButton}>&#x23f8;</span>
    }
    else if(buttonType == 'play'){
      button = <span onClick={this.clickButton}>&#x23e9;</span>
    }
    else if(buttonType == 'pause'){
      button = <span onClick={this.clickButton}>&#x23ea;</span>
    }
    return (
      <div>
          {button}
      </div>
    );
  }
}

export default SimpleButton;