import React from "react";
import SimpleButton from "./SimpleButton"
import SelectList from "./SelectList";

import SmackButton from "./SmackButton"
import "./NetflixWatch.css";
import SeekBar from "./SeekBar";


class NetflixWatch extends React.Component {



  constructor(props) {
    super(props);

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
      selectedSub: initialSelectedSub,
      playbackSpeed: this.props.playbackSpeed,
      muteState: this.props.muteState,
      passCode: this.props.passCode,
      skipElement: this.props.skipElement,

      progress: this.props.progress,
      duration: this.props.duration
    };


    this.nextEpisode = this.nextEpisode.bind(this);
    this.changeSelection = this.changeSelection.bind(this);
    this.changeSpeed = this.changeSpeed.bind(this);
    this.changeProgress = this.changeProgress.bind(this);

  }


  componentDidUpdate(prevProps) {
    if (prevProps.selectedAudio !== this.props.selectedAudio) {
      this.setState({
        selectedAudio: this.props.selectedAudio
      });
    }
    if (prevProps.selectedSubtitle !== this.props.selectedSubtitle) {
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
    if (prevProps.selectedEpisodeIndex !== this.props.selectedEpisodeIndex) {
      this.setState({
        selectedEpisode: this.props.episodesList[this.props.selectedEpisodeIndex]
      });
    }
    if (prevProps.skipElement !== this.props.skipElement) {
      this.setState({
        skipElement: this.props.skipElement
      });
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
    this.props.socket.emit("changePlaybackSpeed", event.target.value);
  }

  changeVolume(event) {
    this.props.socket.emit("changeVolume", event.target.value);
  }

  changeProgress(data) {
    this.props.onChangeProgress(data);
  }

  render() {
    //console.log('rendered netflixwatch');
    //console.log(this.props.selectedEpisodeIndex);
    let playbackSpeedRate = this.props.playbackSpeed;
    //console.log(playbackSpeedRate);
    //this.setState({ selectedEpisodeIndex: this.props.selectedEpisodeIndex });
    let episodeSelectComponent = <div></div>;
    if (this.props.selectedEpisode != null) {
      episodeSelectComponent = <div id='episodesBox' className="trackBox">
        <SelectList socket={this.props.socket} inputs={this.props.episodesList} name='episodes' selectedValue={this.state.selectedEpisode}
          onChangeSelection={this.changeSelection}

        ></SelectList></div>;
    }
    let skipIntroButton = '';
    if (this.props.skipElement == 'skip') {
      skipIntroButton = <SimpleButton type='skipIntro' socket={this.props.socket}></SimpleButton>
    }
    //else if (this.props.skipElement == 'next') {
    //skipIntroButton = <SimpleButton type='skipCredits' socket={this.props.socket}></SimpleButton>
    //}


    return (
      <div className="mainRemoteBox">




        <div className="topControlsBox">

          <SimpleButton type='muteToggle' socket={this.props.socket} isMute={this.state.muteState}></SimpleButton>
          <SimpleButton type='close' socket={this.props.socket}></SimpleButton>
          <SmackButton socket={this.props.socket} type="smackTV"></SmackButton>

        </div>
        {/*
        <div className="volumeControlsBox">


          <div className="muteBox">
            <SimpleButton muteState={isMute} type='muteToggle' socket={this.props.socket}></SimpleButton>
          </div>
          <div className="container">
            <div className="slider">
              <input type="range" orient="vertical" min="0" max="1" step="0.01" value={playbackSpeedRate} onInput={this.changeSpeed} />
            </div>
          </div>
        </div>
        */}

        {/* <div>
          <SeekBar socket={this.props.socket} progressLock={this.props.progressLock}
            duration={this.props.duration} currentTime={this.props.progress}
            onChangeProgress={this.changeProgress}></SeekBar>
       </div> */}

        <div>

          <div className="playControlsBox">
            <div className="volumeControlsBox">
              <SimpleButton type='volumeUp' socket={this.props.socket}></SimpleButton>
              <span>Vol.</span>
              <SimpleButton type='volumeDown' socket={this.props.socket}></SimpleButton>
            </div>
            <div className="playPauseControlsBox">
              <SimpleButton type='play' socket={this.props.socket}></SimpleButton>
            </div>
            {/*<SimpleButton type='pause' socket={this.props.socket}></SimpleButton>
            */}
            <div className="pointControlsBox">
              <SimpleButton type='forward' socket={this.props.socket}></SimpleButton>
              <SimpleButton type='backward' socket={this.props.socket}></SimpleButton>
            </div>
          </div>
          {/* <div className='volumeControlsBox'>
          </div> */}
          <div className="otherControlsBox">

            <SimpleButton type='nextEpisode' socket={this.props.socket} onNextEpisode={this.nextEpisode}></SimpleButton>



            {/* <SimpleButton type='fullScreenToggle' socket={this.props.socket}></SimpleButton>
      */}

            {skipIntroButton}
          </div>
        </div>

        <div id="playbackSpeedBox">
          <div class="container">
            <div class="slider">
              <input type="range" min="0.5" max="2" step="0.25" value={playbackSpeedRate} onInput={this.changeSpeed} />
              <span className="outputRange">Speed: {playbackSpeedRate}</span>
            </div>
          </div>
        </div>
        <div id='connectionControlsBox'>


          {/*   <SmackButton socket={this.props.socket} type="smackRemote"></SmackButton>
    */}

        </div>




        {episodeSelectComponent}

        <div className='tracksBox'>
          <div className='subsTracksBox trackBox'>
            <SelectList socket={this.props.socket} inputs={this.props.subtitleTracks} name='subs' selectedValue={this.state.selectedSubtitle}
              onChangeSelection={this.changeSelection}
            ></SelectList>
          </div>

          <div className='audioTracksBox trackBox'>
            <SelectList socket={this.props.socket} inputs={this.props.audioTracks} name='audio' selectedValue={this.state.selectedAudio}></SelectList>
          </div>

        </div>

        {/* <div>
          <VolumeSlider></VolumeSlider>
        </div>*/}

        <div>
          <p>{"Passcode : " + this.state.passCode}</p>
        </div>

        <h1>Netflix View Mode</h1>
      </div>
    );
  }
}

export default NetflixWatch;