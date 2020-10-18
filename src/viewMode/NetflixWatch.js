import React from "react";
import SimpleButton from "./SimpleButton"
import SelectList from "./SelectList";

import SmackButton from "./SmackButton"
import "./NetflixWatch.css";


class NetflixWatch extends React.Component {
  constructor(props) {
    super(props);

    //console.log(this.props.selectedEpisodeIndex);
    //console.log(this.props.episodesList);

    this.state = {
    };


    this.nextEpisode = this.nextEpisode.bind(this);

  }


  nextEpisode() {
    //console.log('nextEpisode clcikec');
    if (this.props.selectedEpisodeIndex > -1 && this.props.selectedEpisodeIndex < this.props.episodesList.length) {
      this.props.onNextEpisode();
      //this.setState({ selectedEpisodeIndex: this.props.selectedEpisodeIndex + 1 });
      //this.setState({ selectedEpisode: this.props.episodesList[this.props.selectedEpisodeIndex] });

    }
  }

  render() {
    //console.log('rendered netflixwatch');
    //console.log(this.props.selectedEpisodeIndex);

    let selectedEpisode;
    if (this.props.episodesList != null && this.props.episodesList.length > 0 && this.props.selectedEpisodeIndex != null) {

      selectedEpisode = this.props.episodesList[this.props.selectedEpisodeIndex];
    }
    //this.setState({ selectedEpisodeIndex: this.props.selectedEpisodeIndex });
    let episodeSelectComponent = <div></div>;
    if (this.props.selectedEpisode != null) {
      episodeSelectComponent = <div id='episodesBox' className="trackBox">
        <SelectList socket={this.props.socket} inputs={this.props.episodesList} name='episodes' selectedValue={selectedEpisode}
        ></SelectList></div>;
    }
    let skipIntroButton = <SimpleButton type='skipIntro' socket={this.props.socket}></SimpleButton>


    return (
      <div>
        <h1>Netflix View Mode</h1>

        {episodeSelectComponent}

        <div className='tracksBox'>
          <div className='subsTracksBox trackBox'>
            <SelectList socket={this.props.socket} inputs={this.props.subtitleTracks} name='subs' selectedValue={this.props.selectedSubtitle}
            ></SelectList>
          </div>

          <div className='audioTracksBox trackBox'>
            <SelectList socket={this.props.socket} inputs={this.props.audioTracks} name='audio' selectedValue={this.props.selectedAudio}></SelectList>
          </div>

        </div>

        <div>

          <div className="playControlsBox">
            <SimpleButton type='play' socket={this.props.socket}></SimpleButton>
            <SimpleButton type='pause' socket={this.props.socket}></SimpleButton>
            <SimpleButton type='forward' socket={this.props.socket}></SimpleButton>
            <SimpleButton type='backward' socket={this.props.socket}></SimpleButton>
          </div>
          <div className='volumeControlsBox'>
            <SimpleButton type='volumeUp' socket={this.props.socket}></SimpleButton>
            <SimpleButton type='volumeDown' socket={this.props.socket}></SimpleButton>
            <SimpleButton type='muteToggle' socket={this.props.socket}></SimpleButton>
          </div>
          <div className="otherControlsBox">

            <SimpleButton type='nextEpisode' socket={this.props.socket} onNextEpisode={this.nextEpisode}></SimpleButton>



            {/* <SimpleButton type='fullScreenToggle' socket={this.props.socket}></SimpleButton>
    */}

            {skipIntroButton}
          </div>
        </div>

        <div id='connectionControlsBox'>
          <SimpleButton type='close' socket={this.props.socket}></SimpleButton>
          <SmackButton socket={this.props.socket} type="smackTV"></SmackButton>
          <SmackButton socket={this.props.socket} type="smackRemote"></SmackButton>

        </div>

      </div>
    );
  }
}

export default NetflixWatch;