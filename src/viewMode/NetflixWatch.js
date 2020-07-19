import React from "react";
import SimpleButton from "./SimpleButton"


 class NetflixWatch extends React.Component {
  constructor(props){
    super(props);

    this.state = {
      

    };
    
  }


  render() {
    return (

      <div>
          <h1>Netflix View Mode</h1>
          <SimpleButton type='play' socket={this.props.socket}></SimpleButton>
          <SimpleButton type='pause' socket={this.props.socket}></SimpleButton>
          <SimpleButton type='forward' socket={this.props.socket}></SimpleButton>
          <SimpleButton type='backward' socket={this.props.socket}></SimpleButton>
          

      </div>
    );
  }
}

export default NetflixWatch;