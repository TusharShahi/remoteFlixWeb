import React from "react";
import SimpleButton from "./SimpleButton"
import SelectList from "./SelectList";
import SelectListDiv from "./SelectListDiv";

import "./NetflixWatch.css";

import InputSeekBar from "./InputSeekBar";
import VolumeInputBar from "./VolumeInputBar";


import TroubleShoot from "./TroubleShoot";


class NetflixWatch extends React.Component {



  constructor(props) {
    super(props);


    this.closed = false;

    //console.log(this.props.selectedEpisodeIndex);
    //console.log(this.props.episodesList);

    let initialSelectedEpisode = '';
    if (this.props.episodesList != null && this.props.episodesList.length > 0 && this.props.selectedEpisodeIndex != null) {

      initialSelectedEpisode = this.props.episodesList[this.props.selectedEpisodeIndex];
    }

    let initialSelectedAudio = this.props.selectedAudio;
    let initialSelectedSub = this.props.selectedSubtitle;




    this.state = {
      selectedEpisode: initialSelectedEpisode,
      selectedAudio: initialSelectedAudio,
      selectedSubtitle: initialSelectedSub,
      playbackSpeed: this.props.playbackSpeed,
      muteState: this.props.muteState,
      passCode: this.props.passCode,
      skipElement: this.props.skipElement,


      paused: this.props.isPaused,
      volumeLevel: this.props.volumeLevel,
      //episodeNumber: this.props.episodeNumber,
      progress: this.props.progress,
      duration: this.props.duration,

      showTracksDiv: false,
      showTroubleShoot: false

    };

    this.tracksDivRef = React.createRef();

    this.nextEpisode = this.nextEpisode.bind(this);
    this.changeSelection = this.changeSelection.bind(this);
    this.changeSpeed = this.changeSpeed.bind(this);
    this.changeProgress = this.changeProgress.bind(this);
    this.showTrackControlsBox = this.showTrackControlsBox.bind(this);
    this.hideTracksControlsBox = this.hideTracksControlsBox.bind(this);
    this.openTroubleShoot = this.openTroubleShoot.bind(this);
    this.closeTroubleShoot = this.closeTroubleShoot.bind(this);

  }
  componentDidMount() {
    if (window.location.href.split("?").length > 0) {
      //window.alert("component did mount");
      window.history.pushState(null, "", window.location.href.split("?")[0]);
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.selectedAudio !== this.props.selectedAudio) {
      this.setState({
        selectedAudio: this.props.selectedAudio
      });
    }
    if (prevProps.selectedSubtitle !== this.props.selectedSubtitle) {
      console.log(this.props.selectedSubtitle);
      console.log(prevProps.selectedSubtitle);
      this.setState({
        selectedSubtitle: this.props.selectedSubtitle
      });
    }
    if (prevProps.selectedEpisode !== this.props.selectedEpisode) {
      this.setState({
        selectedEpisode: this.props.selectedEpisode
      });
    }
    if (prevProps.playbackSpeed !== this.props.playbackSpeed) {
      this.setState({
        playbackSpeed: this.props.playbackSpeed
      });
    }
    if (prevProps.muteState !== this.props.muteState) {
      this.setState({
        muteState: this.props.muteState
      });
    }
    if (prevProps.isPaused !== this.props.isPaused) {
      console.log("chagning so set state");
      this.setState({
        paused: this.props.isPaused
      });
    }
    if (prevProps.volumeLevel !== this.props.volumeLevel) {
      console.log("chagning so set state Volume");
      this.setState({
        volumeLevel: this.props.volumeLevel
      });
    }
    if (prevProps.selectedEpisodeIndex !== this.props.selectedEpisodeIndex) {
      this.setState({
        selectedEpisode: this.props.episodesList[this.props.selectedEpisodeIndex]
      });
    }
    if (prevProps.skipElement !== this.props.skipElement) {
      console.log("changed skipELement " + this.props.skipElement);
      this.setState({
        skipElement: this.props.skipElement
      });
    }
    if (this.state.showTracksDiv !== prevState.showTracksDiv && this.state.showTracksDiv) {
      this.tracksDivRef.current.focus();
    }
  }

  nextEpisode() {
    //console.log('nextEpisode clcikec');
    if (this.props.selectedEpisodeIndex > -1 && this.props.selectedEpisodeIndex < this.props.episodesList.length) {
      this.props.onNextEpisode();
      //this.setState({ selectedEpisodeIndex: this.props.selectedEpisodeIndex + 1 });
      //this.setState({ selectedEpisode: this.props.episodesList[this.props.selectedEpisodeIndex] });

    }
  }

  showTrackControlsBox() {
    this.setState({ showTracksDiv: true });
  }
  hideTracksControlsBox(event) {
    if (event.target === event.currentTarget) {
      this.setState({ showTracksDiv: false });

    }
  }

  changeSelection(trackValue, trackType) {
    if (trackType == 'audio') {
      this.setState({
        selectedAudio: trackValue
      });
    }
    else if (trackType == 'subs') {
      this.setState({
        selectedSubtitle: trackValue
      });
    }
    else if (trackType == 'episodes') {
      this.setState({
        selectedEpisode: trackValue
      });
    }


  }

  changeSpeed(event) {

    console.log("on change speed called");
    console.log(event);
    console.log(parseFloat(event.target.getAttribute("data-value")));
    this.props.socket.emit("changePlaybackSpeed", parseFloat(event.target.getAttribute("data-value")));
  }

  changeVolume(event) {
    this.props.socket.emit("changeVolume", event.target.value);
  }

  changeProgress(data) {
    this.props.onChangeProgress(data);
  }


  openTroubleShoot() {
    this.setState({
      showTroubleShoot: true
    });
  }

  closeTroubleShoot() {
    this.setState({
      showTroubleShoot: false
    });
  }

  render() {
    let episodeSelectComponent = <div></div>;
    if (this.props.selectedEpisode != null) {
      episodeSelectComponent = <div id='episodesBox' className="trackBox">
        <SelectListDiv socket={this.props.socket} inputs={this.props.episodesList} name='episodes'
          selectedValue={this.state.selectedEpisode} episodeNumber={this.props.episodeNumber}
          onChangeSelection={this.changeSelection} episodeTitle={this.props.title}

        ></SelectListDiv></div>;
    }
    let isPaused = false;
    let isSkipDisabled = false;
    if (this.props.isPaused) isPaused = true;
    if (!this.state.skipElement) {
      isSkipDisabled = true;
    }
    // console.log("render is called " + isSkipDisabled);

    let skipIntroButton = <SimpleButton type='skipIntro' socket={this.props.socket} disabled={isSkipDisabled}></SimpleButton>


    if (this.props.skipElement == 'skip') {
      skipIntroButton = <SimpleButton type='skipIntro' socket={this.props.socket} disabled={isSkipDisabled}></SimpleButton>
    }

    //else if (this.props.skipElement == 'next') {
    //skipIntroButton = <SimpleButton type='skipCredits' socket={this.props.socket}></SimpleButton>
    //}

    let tracksDivBox = null;


    let speedControlInputs = [];
    let speedControlsBox = null;
    let speedLevels = [{
      'speed': 0.5,
      'label': '0.5x'
    },
    {
      'speed': 0.75,
      'label': '0.75x'
    },
    {
      'speed': 1,
      'label': '1x'
    },
    {
      'speed': 1.25,
      'label': '1.25x'
    },
    {
      'speed': 1.5,
      'label': '1.5x'
    }];
    for (let i = 0; i < speedLevels.length; i++) {
      let normalLabel = null;
      let className = 'speedLevel';
      if (speedLevels[i].speed == 1) {
        normalLabel = <p className='normalLabel'>Normal</p>
        className += ' one';
      }
      let circleClassName = 'speedInput speedInput' + i;
      if (speedLevels[i].speed == this.state.playbackSpeed) {
        circleClassName += ' selected';
      }
      speedControlInputs.push(
        <div className={className}>
          <div className={circleClassName} onClick={this.changeSpeed}
            data-value={speedLevels[i]['speed']}></div>
          <p>{speedLevels[i]['label']}</p>
          {normalLabel}
        </div>);
    }
    speedControlsBox = <div className='speedControlsBox'>
      <h4>Playback speed</h4>
      <div>
        <hr />
        {speedControlInputs}
      </div>
    </div>
    if (this.state.showTracksDiv) {
      tracksDivBox =
        <div className='tracksBoxOverlay' onClick={this.hideTracksControlsBox}>
          <div class='tracksDivBox'
            ref={this.tracksDivRef}>
            <div class='closeButton'>
              <img src='/iconExit.svg' onClick={this.hideTracksControlsBox} alt='exit Icon'></img>
            </div>

            <SelectListDiv socket={this.props.socket} inputs={this.props.subtitleTracks} name='subs'
              selectedValue={this.state.selectedSubtitle}
              onChangeSelection={this.changeSelection}
            ></SelectListDiv>

            <SelectListDiv socket={this.props.socket} inputs={this.props.audioTracks} name='audio'
              selectedValue={this.state.selectedAudio}
              onChangeSelection={this.changeSelection}
            ></SelectListDiv>



            {speedControlsBox}


          </div>
        </div >
    }
    let helpBox = null;
    if (this.state.showTroubleShoot) {
      helpBox =
        <div className="helpBox">
          <TroubleShoot passCode={this.props.passCode} onCloseTroubleShoot={this.closeTroubleShoot}></TroubleShoot>
        </div>;

    }

    return (

      <div className="mainRemoteBox">
        {helpBox}

        <div className="topBox">

          <SimpleButton type='help' socket={this.props.socket} onOpenTroubleShoot={this.openTroubleShoot}></SimpleButton>
          <SimpleButton type="smackTV" socket={this.props.socket}></SimpleButton>
          <SimpleButton type='close' socket={this.props.socket} onClose={() => { this.props.onClose(); }}></SimpleButton>
        </div>

        <div className='titleBox'>
          <p className='mainTitle'>{this.props.title}</p>
        </div>

        <div className='episodeSelectBox'>
          {episodeSelectComponent}
        </div>



        <div>

          <div className="otherControlsBox">

            {/* <SimpleButton type='nextEpisode' socket={this.props.socket} onNextEpisode={this.nextEpisode}></SimpleButton>
          */}


            {/* <SimpleButton type='fullScreenToggle' socket={this.props.socket}></SimpleButton>
      */}

            {/*  {skipIntroButton} */}
          </div>
        </div>
        {/*
          < div id="playbackSpeedBox">
          <div class="container">
          <div class="slider">
            <input type="range" min="0.5" max="1.5" step="0.25" value={playbackSpeedRate} onInput={this.changeSpeed} />
            <span className="outputRange">Speed: {playbackSpeedRate}</span>
          </div>
        </div>
      </div>
      */}
        < div id='connectionControlsBox' >


          {/*   <SmackButton socket={this.props.socket} type="smackRemote"></SmackButton>
    */}

        </div >


        <div className='tracksButtonBox'>
          <p onClick={this.showTrackControlsBox}>Subtitles & Audio Options</p>
        </div>
        {tracksDivBox}

        {/*< div className='tracksBox' >
          <div className='subsTracksBox trackBox'>
            <SelectList socket={this.props.socket} inputs={this.props.subtitleTracks} name='subs' selectedValue={this.state.selectedSubtitle}
              onChangeSelection={this.changeSelection}
            ></SelectList>
          </div>

          <div className='audioTracksBox trackBox'>
            <SelectList socket={this.props.socket} inputs={this.props.audioTracks} name='audio' selectedValue={this.state.selectedAudio}></SelectList>
          </div>

  </div >*/}


        <div className="volumeControlsBox">
          <SimpleButton type='muteToggle' socket={this.props.socket} isMute={this.state.muteState}></SimpleButton>
          <VolumeInputBar socket={this.props.socket} volumeLevel={this.state.volumeLevel}
            isMute={this.state.muteState} muteEventName='muteToggle'
          ></VolumeInputBar>


        </div>


        <div className="skipControlBox">
          {skipIntroButton}
        </div>

        <div className='seekBarBox'>
          {/* <SeekBar socket={this.props.socket} progressLock={this.props.progressLock}
            duration={this.props.duration} currentTime={this.props.progress}
            onChangeProgress={this.changeProgress}></SeekBar>
*/}
          <InputSeekBar socket={this.props.socket} duration={this.props.duration} currentTime={this.props.progress}
            onChangeProgress={this.changeProgress}>
          </InputSeekBar>
        </div>


        <div className="bottomBox">

          <SimpleButton type='previous' socket={this.props.socket}></SimpleButton>

          <SimpleButton type='backward' socket={this.props.socket}></SimpleButton>

          <SimpleButton type='play' socket={this.props.socket} paused={isPaused}></SimpleButton>


          <SimpleButton type='forward' socket={this.props.socket}></SimpleButton>




          <SimpleButton type='nextEpisode' socket={this.props.socket} onNextEpisode={this.nextEpisode}></SimpleButton>


        </div>

        {/* <div>
          <VolumeSlider></VolumeSlider>
        </div>*/}

        {/*<div>
          <p>{"Passcode : " + this.state.passCode}</p>
        </div>*/}

      </div >
    );
  }
}

export default NetflixWatch;