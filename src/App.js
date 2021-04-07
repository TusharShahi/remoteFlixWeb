import React from "react";

import queryString from 'query-string';

import socketIOClient from "socket.io-client";
import OtpBox from "./OtpBox"
import NetflixWatch from "./viewMode/NetflixWatch";
import NetflixPremier from "./viewMode/NetflixPremier";
import HelpBox from "./HelpBox";
import { Route, Switch } from "react-router-dom";


import "./App.css";

//const ENDPOINT = process.env.REACT_APP_SERVER_URL;

const PORT = "8080";


class App extends React.Component {


  progressLock = false;
  closed = false;

  constructor(props) {
    super(props);
    ////console.log('constructor is called');

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
      selectedEpisodeIndex: -1,
      recentOTPs: [],
      playbackSpeed: 1,
      showHelp: false,
      dislpayConnectionError: false,
      heartBeat: null,
      lastUsedOtp: null,

      muteState: false,
      skipElement: false,
      paused: false,
      volumeLevel: 1,

      title: 'Sample Title',
      episodeNumber: null,
      episodeTitle: null,

      duration: 0,
      progress: 0,

      browserURL: null,
      loggedIn: false
    };


    this.submitOtp = this.submitOtp.bind(this);
    this.attachSocketEvents = this.attachSocketEvents.bind(this);
    this.goToLandingPage = this.goToLandingPage.bind(this);
    this.nextEpisode = this.nextEpisode.bind(this);
    this.heartBeatFunction = this.heartBeatFunction.bind(this);
    this.toggleHelp = this.toggleHelp.bind(this);
    this.showConnectionError = this.showConnectionError.bind(this);
    this.forceLoginfunction = this.forceLoginfunction.bind(this);
    this.clearAlertFunction = this.clearAlertFunction.bind(this);

    this.checkForLensRedirect = this.checkForLensRedirect.bind(this);

    this.changeProgress = this.changeProgress.bind(this);
    this.closeClicked = this.closeClicked.bind(this);
  }

  heartBeatFunction() {
    if (this.state.socket != null)
      this.state.socket.emit("heartBeatFromClient");

  }

  checkForLensRedirect() {

    //window.alert(this.props.location.search);
    const parsed = queryString.parse(this.props.location.search);
    if (parsed != null && parsed.otp != null) {
      let otpParam = parsed.otp;


      if (otpParam.length == 6) {

        this.submitOtp(otpParam);
      }
      else if (otpParam.indexOf("=") > 0) {
        let otpParamsArray = otpParam.split("=");
        if (otpParamsArray.length > 1) {
          if (otpParamsArray.length == 6) {
            this.submitOtp(otpParamsArray[1]);
          }
        }
      }


    }
  }
  //window.alert(JSON.stringify(parsed));}



  generateOTPsList(recentOTPsMapString, recentOTPsMap) {

    let recentOTPsList = [];
    if (recentOTPsMapString != null) {
      recentOTPsMap = JSON.parse(recentOTPsMapString);

      let otps = Object.keys(recentOTPsMap).map(function (key) {
        return [key, recentOTPsMap[key]];
      });

      //console.log(otps);

      // Sort the array based on the second element
      otps.sort(function (first, second) {
        return second[1] - first[1];
      });

      /*for (let key of Object.keys(otps)) {
        if (key != null)
          if (Date.now() - otps[key] < 51840000) {
            recentOTPsList.push(key);
          }
      }*/

      recentOTPsList = [otps[0][0]];
    }

    return recentOTPsList;

  }


  componentDidMount() {
    this.checkForLensRedirect();


    let storageDataLoggedIn = localStorage.getItem('loggedIn');
    //console.log(localStorage);
    //console.log("did mount -- " + this.state.loggedIn + " -- " + storageDataLoggedIn);
    //console.log(this.state.lastUsedOtp);
    let storageDataLastUsedOTP = localStorage.getItem('lastUsedOTP');
    //console.log(storageDataLastUsedOTP);
    if (storageDataLoggedIn != null && storageDataLoggedIn != 'false') {
      this.submitOtp(storageDataLastUsedOTP);
    }

    let recentOTPsMapString = localStorage.getItem('recentOTPsMap');
    let recentOTPsMap = new Map();

    let recentOTPsList = this.generateOTPsList(recentOTPsMapString, recentOTPsMap);

    this.setState({
      recentOTPs: recentOTPsList
    });

    if (this.state.socket != null) {
      this.attachSocketEvents();
    }
    else {
    }
  }
  componentDidUpdate() {

  }


  goToLandingPage() {
    //console.log('go to landing page');
    let recentOTPsMapString = localStorage.getItem('recentOTPsMap');
    let recentOTPsMap = new Map();

    let recentOTPsList = this.generateOTPsList(recentOTPsMapString, recentOTPsMap);


    this.setState({
      socket: null,
      mode: 'enter',
      service: null,
      recentOTPs: recentOTPsList
    });

  }

  showConnectionError(errorText) {
    //console.log(errorText);
    this.setState({
      dislpayConnectionError: errorText
    });


  }


  attachSocketEvents() {
    let socket = this.state.socket;
    socket.on("biwayConnection", data => {
      window.isConnected = true;
      //////console.og("bothParties have connected " + JSON.stringify(data));
      if (data.mode == 'netflixView') {
        //////console.og('setting mode to netflixView');

        this.setState({
          mode: 'view',
          service: 'netflix',
          loggedIn: true
        });
        localStorage.setItem('loggedIn', true);
        localStorage.setItem('lastUsedOTP', this.state.lastUsedOtp);
      }
      else if (data.mode == 'netflixBrowse') {
        //////console.og('setting mode to netflixBrowse');
        this.setState({ mode: 'browse' });
        this.setState({ service: 'netflix' });
      }
      else if (data.mode == 'netflixPremier') {
        //////console.og('setting mode to netflixPremier');
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

    socket.on("cantJoin", data => {
      this.showConnectionError("One phone is already connected.");

      //console.log('hello');
    });

    socket.on("noReceivingDesktop", data => {
      this.showConnectionError("No Desktop with same OTP found. Please recheck OTP and try again.");

      //console.log('hello2');
    });

    socket.on("modeChange", data => {
      ////console.log('modeChange');
      ////console.og(data);
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

    socket.on("viewModeDataSetup", data => {
      console.log("received view mode data setup");
      ////console.log(data);
      let episodeIndex = -1;
      if (data.episodes.list != null && data.episodes.list.length > 0) {
        episodeIndex = data.episodes.list.indexOf(data.episodes.selected);
      }
      // //console.log('episodeNumber is ');
      // //console.log(data.episodeNumber);
      //console.log("selected  " + data.selectedSubtitle);

      console.log(data.title);
      console.log(data.episodeNumber);
      console.log(data.title);
      this.setState({
        selectedEpisodeIndex: episodeIndex,
        selectedEpisode: data.episodes.selected,
        selectedAudio: data.selectedAudio,
        selectedSubtitle: data.selectedSubtitle,

        episodes: data.episodes.list,
        subtitleTracks: data.subtitleTracks,
        audioTracks: data.audioTracksList,

        episodeNumber: data.episodeNumber,
        title: data.title,
        episodeTitle: data.episodeTitle


      });
      /*if (data.episodes.list != null) {
        let index = data.episodes.list.indexOf(data.episodes.selected);
        this.setState({
          selectedEpisodeIndex: 4
        });
      }*/


    });

    socket.on("heartBeatFromServer", data => {

    });

    socket.on("playbackSpeed", data => {
      // //console.log("play back speed has changed " + data);
      ////console.log(data);
      if (data !== this.state.playbackSpeed)
        this.setState({
          playbackSpeed: data
        });

    });

    socket.on("muteState", data => {
      // //console.log("received muteState " + data);
      if (data == true) {
        this.setState({
          volumeLevel: 0
        });

      }
      this.setState({
        muteState: data
      });

    });

    socket.on("changeSkipElement", data => {
      //console.log("received changeSkipElement");
      //console.log(data);
      this.setState({
        skipElement: data
      });
    });

    socket.on("durationProgressData", data => {
      //console.log("durationData incoming");
      //console.log(data);
      if (!this.progressLock) {
        this.setState({
          progress: data.progress,
          duration: data.duration

        });

      }
      else {
        //console.log("locked");

      }
    });

    socket.on("paused", data => {
      ////console.log("received pause" + data);
      this.setState({
        paused: data
      });
    });

    socket.on("volumeLevel", data => {
      ////console.log("received volumeLevelChange" + data);
      ////console.log(this.state.volumeLevel);
      //let muteStateValue = false;

      //if (data == 0)
      //muteStateValue = true;
      if (!this.state.muteState) {
        this.setState({
          volumeLevel: data,
          // muteState: muteStateValue
        });

      }
    });

    socket.on("changeURL", data => {
      this.setState({
        browserURL: data
      });
    });
  }

  nextEpisode() {
    ////console.log('xxxx');
    this.setState({
      selectedEpisodeIndex: this.state.selectedEpisodeIndex + 1
    });

  }

  submitOtp(otpValue) {
    // window.alert("otp is " + otpValue);
    ////console.log("this submit OTP " + otpValue);
    this.setState({ lastUsedOtp: otpValue });
    //console.log("this last used otp " + otpValue);
    //let newSocket = socketIOClient("http://192.168.1.12:8080?otp=" + otpValue + "&connectionType=phone", { reconnectionAttempts: 2 });
    let newSocket = socketIOClient(process.env.REACT_APP_SERVER_URL + "?otp=" + otpValue + "&connectionType=phone", { reconnectionAttempts: 2 });

    newSocket.on("connect", data => {
      ////console.log("connection has been made");

      //let recentOTP = 'OTP-' + Date.now();
      let recentOTPsMapString = localStorage.getItem('recentOTPsMap');

      // //console.log(recentOTPsMapString);
      let recentOTPsMap = new Map();
      if (recentOTPsMapString != null) {
        recentOTPsMap = JSON.parse(recentOTPsMapString);
      }

      recentOTPsMap[otpValue] = Date.now();
      localStorage.setItem('recentOTPsMap', JSON.stringify(recentOTPsMap));


      //localStorage.setItem('', keyName);
      this.setState({ socket: newSocket }, function () {
        ////console.og("setting");
        this.attachSocketEvents();

        let newHeartBeat = setInterval(this.heartBeatFunction, 3000);


      });

      ////console.og('connection from phone has been made');
    });

    newSocket.on("connect_error", data => {
      this.showConnectionError("Oops. Something went wrong. Please try again");
    });

    newSocket.on("connect_failed", data => {
      this.showConnectionError("Oops. Our server is down. Please try after some time.");
    });

  };


  toggleHelp() {
    this.setState({ showHelp: (!this.state.showHelp) });
  };

  forceLoginfunction() {
    //console.log(this.state.socket);
    //console.log(this.state.lastUsedOtp);
    if (this.state.socket != null)
      this.state.socket.emit("forceLogin", this.state.lastUsedOtp);

  }

  clearAlertFunction() {
    if (this.state.dislpayConnectionError != false) {
      this.setState({
        dislpayConnectionError: false
      });
    }

  }

  changeProgress(data) {
    // this.progressLock = true;
    //console.log("change progress " + data.currentTime);
    this.setState({
      progress: data.currentTime
    });
    this.state.socket.emit("changeProgress", data);

    setTimeout(() => {
      //console.log("removed progresslock");
      this.progressLock = false;
    }, 3000);
  }

  closeClicked() {
    this.loggedIn = false;
    localStorage.setItem('loggedIn', false);


  }

  render() {
    // window.alert(this.props.location.search);
    /*if (this.props.location.search != null) {
      let queryParams = this.props.location.search.split("=");
      if (queryParams != null && queryParams.length > 1) {
        let queryParams.l
  
      }
    }*/
    let mode = this.state.mode;
    let service = this.state.service;
    ////console.og(mode);
    ////console.og(service);


    let recentOTPButtons = "";
    let recentOTPsHeading = "";

    if (this.state.recentOTPs.length > 0) {
      recentOTPsHeading = "Reconnect with"
      recentOTPButtons = this.state.recentOTPs.map((x) => <span className="recentOTPButton" onClick={() => this.submitOtp(x)} >{x}</span>);
    }
    let recentOTPBox =
      <div className="recentOTPBox"><span>{recentOTPsHeading}</span>{recentOTPButtons}</div>

    let mainBox = <div><OtpBox submitMethod={this.submitOtp}
      forceLogin={this.forceLoginfunction} clearAlert={this.clearAlertFunction}
      showConnectionError={this.state.dislpayConnectionError}></OtpBox>
      {recentOTPBox}
    </div>;


    if (mode == 'view' && service == 'netflix') {
      if (this.state.skipElement == 'next') {

      }

      mainBox = <NetflixWatch socket={this.state.socket}
        episodesList={this.state.episodes} selectedEpisode={this.state.selectedEpisode} selectedEpisodeIndex={this.state.selectedEpisodeIndex}
        audioTracks={this.state.audioTracks} selectedAudio={this.state.selectedAudio}
        subtitleTracks={this.state.subtitleTracks} selectedSubtitle={this.state.selectedSubtitle}
        title={this.state.title} episodeNumber={this.state.episodeNumber}

        isPaused={this.state.paused} volumeLevel={this.state.volumeLevel}
        playbackSpeed={this.state.playbackSpeed} muteState={this.state.muteState} skipElement={this.state.skipElement}
        duration={this.state.duration} progress={this.state.progress}
        onNextEpisode={this.nextEpisode} passCode={this.state.lastUsedOtp}
        progressLock={this.progressLock}
        onChangeProgress={this.changeProgress} onClose={this.closeClicked}
        onOpenTroubleshoot={this.openTroubleshoot}

      ></NetflixWatch>
    }
    else if (mode == 'browse' && service == 'netflix') {
    }
    else if (mode == 'premier' && service == 'netflix') {
      mainBox = <NetflixPremier socket={this.state.socket}></NetflixPremier>
    }

    return (
      <div class='appBox'>
        {mainBox}
        {/*<div class="remoteGuideBox">
          {helpCloseButton}
        </div>
       <div id='helpBoxMain' className={this.state.showHelp ? 'helpBox' : 'helpBoxClosed'}>
          <span onclick={this.toggleHelp}></span>
          <img src="helpImage.png" alt="Help for remote Control"
            className={this.state.showHelp ? 'showHelpImage' : 'dontShowHelpImage'}>
          </img>

    </div> */}



      </div>


    );
  }
}

export default App;