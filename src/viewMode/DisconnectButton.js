import React from "react";

class DisconnectButton extends React.Component {
  constructor(props) {
    super(props);
    this.closeConnection = this.closeConnection.bind(this);
  }


  closeConnection() {
    //  //console.log("close is called");
    this.props.socket.emit('disconnect', { from: 'user' });
  }

  render() {
    return (
      <div>
        <span onClick='closeConnection()'>&#10005;</span>
      </div>
    );
  }
}

export default DisconnectButton;