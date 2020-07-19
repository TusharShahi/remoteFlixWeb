import React from "react";
import socketIOClient from "socket.io-client";
import OtpBox from "./OtpBox"
import NetflixWatch from "./viewMode/NetflixWatch";


const ENDPOINT = "http://192.168.1.5";

const PORT = "8080";


 class App extends React.Component {
  constructor(props){
    super(props);


    this.state = {
      
      socket : null,
      mode : 'enter', //enter,view,browse
      service : null
    };
    this.submitOtp = this.submitOtp.bind(this);
    this.attachSocketEvents = this.attachSocketEvents.bind(this);
  }

  componentDidMount(){
    if(this.state.socket!=null){
      this.attachSocketEvents();
    }
    else{
      console.log("socket is null");
    }
  }

  attachSocketEvents(){
      let socket = this.state.socket;
      socket.on("biwayConnection",data=>{
        console.log("bothParties have connected " + JSON.stringify(data));
        if(data.mode == 'netflixView'){
          this.setState({mode : 'view'});
          this.setState({service : 'netflix'});
        }
        else if(data.mode == 'netflixBrowse'){
          this.setState({socket : 'browse'});
          this.setState({service : 'netflix'});
        }
      });
  }

  submitOtp(otpValue){
    console.log(otpValue);
    let newSocket = socketIOClient(ENDPOINT + ":" + PORT + "?otp=" + otpValue + "&connectionType=phone",{reconnectionAttempts : 2});
    newSocket.on("connect", data => {
      console.log("connection has been made");
      this.setState({socket : newSocket},function(){
      console.log("setting");
      this.attachSocketEvents();
      });
 
      console.log('connection from phone has been made');
    });    
  };


  render() {
    let mode = this.state.mode;
    let service = this.state.service
    let mainBox = <OtpBox submitMethod={this.submitOtp}></OtpBox>;
    if(mode == 'view' && service == 'netflix' ){
      mainBox =<NetflixWatch socket={this.state.socket}></NetflixWatch>
    }
    else if(mode == 'browse' && service == 'netflix' ){

    }

    return (
      <div>
        {mainBox}
      </div>
    );
  }
}

export default App;