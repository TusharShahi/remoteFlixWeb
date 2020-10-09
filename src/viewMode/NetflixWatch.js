import React from "react";
import SimpleButton from "./SimpleButton"
import SelectList from "./SelectList";

import SmackButton from "./SmackButton"


import "./NetflixWatch.css";

class NetflixWatch extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      episodesList: this.props.episodesList
    };

  }


  render() {

    let episodeSelectComponent = <div></div>;

    if (this.props.selectedEpisode != null) {
      episodeSelectComponent = <div id='episodesBox' className="trackBox">
        <SelectList socket={this.props.socket} inputs={this.props.episodesList} name='episodes' selectedValue={this.props.selectedEpisode}></SelectList></div>;
    }

    let skipIntroButton = <SimpleButton type='skipIntro' socket={this.props.socket}></SimpleButton>


    return (

      <div>
        <h1>Netflix View Mode</h1>


        {episodeSelectComponent}

        <div className='tracksBox'>
          <div className='subsTracksBox trackBox'>
            <SelectList socket={this.props.socket} inputs={this.props.subtitleTracks} name='subs' selectedValue={this.props.selectedSubtitle}></SelectList>
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

            <SimpleButton type='nextEpisode' socket={this.props.socket}></SimpleButton>

            {/* <SimpleButton type='fullScreenToggle' socket={this.props.socket}></SimpleButton>

    */}
            {skipIntroButton}
          </div>
        </div>

        <div id='connectionControlsBox'>
          <SimpleButton type='close' socket={this.props.socket}></SimpleButton>
          <SmackButton socket={this.props.socket}></SmackButton>
        </div>


      </div>
    );
  }
}

export default NetflixWatch;