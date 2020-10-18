import React from "react";
import socketIOClient from "socket.io-client";
import OtpBox from "./OtpBox"
import NetflixWatch from "./viewMode/NetflixWatch";
import NetflixPremier from "./viewMode/NetflixPremier";


//const ENDPOINT = process.env.REACT_APP_SERVER_URL;

const PORT = "8080";


class App extends React.Component {



  constructor(props) {
    super(props);
    //console.log('constructor is called');

    this.state = {
      selectedEpisode: '',
      selectedAudio: '',
      selectedSubtitle: '',

      episodes: [],
      subtitleTracks: [],
      audioTracks: [],
      socket: null,
      mode: 'enter', //enter,view,browse,premier
      service: null,
      selectedEpisodeIndex: -1
    };

    this.submitOtp = this.submitOtp.bind(this);
    this.attachSocketEvents = this.attachSocketEvents.bind(this);
    this.goToLandingPage = this.goToLandingPage.bind(this);
    this.nextEpisode = this.nextEpisode.bind(this);
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
      //console.log('modeChange');
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
      console.log("received view mode data setup");
      console.log(data);
      this.setState({
        selectedEpisodeIndex: data.episodes.list.indexOf(data.episodes.selected),
        selectedEpisode: data.episodes.selected,
        selectedAudio: data.selectedAudio,
        selectedSubtitle: data.selectedSubtitle,

        episodes: data.episodes.list,
        subtitleTracks: data.subtitleTracks,
        audioTracks: data.audioTracksList,

      });
      /*if (data.episodes.list != null) {
        let index = data.episodes.list.indexOf(data.episodes.selected);
        this.setState({
          selectedEpisodeIndex: 4
        });
      }*/


    });





  }

  nextEpisode() {
    //console.log('xxxx');
    this.setState({
      selectedEpisodeIndex: this.state.selectedEpisodeIndex + 1
    });

  }

  submitOtp(otpValue) {
    //console.og(otpValue);
    //let newSocket = socketIOClient("http://192.168.0.11:8080?otp=" + otpValue + "&connectionType=phone", { reconnectionAttempts: 2 });
    let newSocket = socketIOClient(process.env.REACT_APP_SERVER_URL + "?otp=" + otpValue + "&connectionType=phone", { reconnectionAttempts: 2 });
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
        episodesList={this.state.episodes} selectedEpisode={this.state.selectedEpisode} selectedEpisodeIndex={this.state.selectedEpisodeIndex}
        audioTracks={this.state.audioTracks} selectedAudio={this.state.selectedAudio}
        subtitleTracks={this.state.subtitleTracks} selectedSubtitle={this.state.selectedSubtitle}
        onNextEpisode={this.nextEpisode}
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