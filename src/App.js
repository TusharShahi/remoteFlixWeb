import React from "react";
import socketIOClient from "socket.io-client";
import OtpBox from "./OtpBox"
import NetflixWatch from "./viewMode/NetflixWatch";
import NetflixPremier from "./viewMode/NetflixPremier";


const ENDPOINT = process.env.SERVER_URL;

const PORT = "8080";


class App extends React.Component {
  constructor(props) {
    super(props);


    this.state = {
      selectedEpisode: '',
      selectedAudio: '',
      selectedSubtitle: '',

      episodes: [],
      subtitleTracks: [],
      audioTracks: [],
      socket: null,
      mode: 'enter', //enter,view,browse,premier
      service: null
    };
    this.submitOtp = this.submitOtp.bind(this);
    this.attachSocketEvents = this.attachSocketEvents.bind(this);
    this.goToLandingPage = this.goToLandingPage.bind(this);
  }

  componentDidMount() {
    if (this.state.socket != null) {
      this.attachSocketEvents();
    }
    else {
    }
  }


  goToLandingPage() {
    this.setState({
      socket: null,
      mode: 'enter',
      service: null
    });

  }

  attachSocketEvents() {
    let socket = this.state.socket;
    socket.on("biwayConnection", data => {
      window.isConnected = true;
      ////console.og("bothParties have connected " + JSON.stringify(data));
      if (data.mode == 'netflixView') {
        ////console.og('setting mode to netflixView');
        this.setState({ mode: 'view' });
        this.setState({ service: 'netflix' });
      }
      else if (data.mode == 'netflixBrowse') {
        ////console.og('setting mode to netflixBrowse');
        this.setState({ mode: 'browse' });
        this.setState({ service: 'netflix' });
      }
      else if (data.mode == 'netflixPremier') {
        ////console.og('setting mode to netflixPremier');
        this.setState({ mode: 'premier' });
        this.setState({ service: 'netflix' });
      }
    });

    socket.on("biwayConnectionEnded", data => {
      this.goToLandingPage();
      window.isConnected = false;
    });

    socket.on("disconnect", data => {
      this.goToLandingPage();
      window.isConnected = false;

    });


    socket.on("modeChange", data => {
      //console.og('modeChange');
      //console.og(data);
      if (data.mode == 'netflixView') {
        //console.og('setting mode to netflixView');
        this.setState({ mode: 'view' });
        this.setState({ service: 'netflix' });
      }
      else if (data.mode == 'netflixBrowse') {
        //console.og('setting mode to netflixBrowse');
        this.setState({ mode: 'browse' });
        this.setState({ service: 'netflix' });
      }
      else if (data.mode == 'netflixPremier') {
        //console.og('setting mode to netflixPremier');
        this.setState({ mode: 'premier' });
        this.setState({ service: 'netflix' });
      }

    });

    socket.on("viewModeDataSetup", data => {
      //console.og("received view mode data setup");
      //console.og(data);
      this.setState({
        selectedEpisode: data.episodes.selected,
        selectedAudio: data.selectedAudio,
        selectedSubtitle: data.selectedSubtitle,

        episodes: data.episodes.list,
        subtitleTracks: data.subtitleTracks,
        audioTracks: data.audioTracksList
      });
    });


  }

  submitOtp(otpValue) {
    //console.og(otpValue);
    let newSocket = socketIOClient(ENDPOINT + ":" + PORT + "?otp=" + otpValue + "&connectionType=phone", { reconnectionAttempts: 2 });
    newSocket.on("connect", data => {
      //console.og("connection has been made");
      this.setState({ socket: newSocket }, function () {
        //console.og("setting");
        this.attachSocketEvents();
      });

      //console.og('connection from phone has been made');
    });
  };


  render() {
    let mode = this.state.mode;
    let service = this.state.service;
    //console.og(mode);
    //console.og(service);
    let mainBox = <OtpBox submitMethod={this.submitOtp}></OtpBox>;
    if (mode == 'view' && service == 'netflix') {
      mainBox = <NetflixWatch socket={this.state.socket}
        episodesList={this.state.episodes} selectedEpisode={this.state.selectedEpisode}
        audioTracks={this.state.audioTracks} selectedAudio={this.state.selectedAudio}
        subtitleTracks={this.state.subtitleTracks} selectedSubtitle={this.state.selectedSubtitle}
      ></NetflixWatch>
    }
    else if (mode == 'browse' && service == 'netflix') {
    }
    else if (mode == 'premier' && service == 'netflix') {
      mainBox = <NetflixPremier socket={this.state.socket}></NetflixPremier>
    }

    return (
      <div>
        {mainBox}
      </div>
    );
  }
}

export default App;