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

    };


    this.nextEpisode = this.nextEpisode.bind(this);
    this.changeSelection = this.changeSelection.bind(this);
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

  render() {
    //console.log('rendered netflixwatch');
    //console.log(this.props.selectedEpisodeIndex);
    console.log(this.state.selectedEpisode);

    console.log(this.state.selectedSubtitle);
    console.log(this.state.selectedAudio);

    //this.setState({ selectedEpisodeIndex: this.props.selectedEpisodeIndex });
    let episodeSelectComponent = <div></div>;
    if (this.props.selectedEpisode != null) {
      episodeSelectComponent = <div id='episodesBox' className="trackBox">
        <SelectList socket={this.props.socket} inputs={this.props.episodesList} name='episodes' selectedValue={this.state.selectedEpisode}
          onChangeSelection={this.changeSelection}

        ></SelectList></div>;
    }
    let skipIntroButton = <SimpleButton type='skipIntro' socket={this.props.socket}></SimpleButton>


    return (
      <div>



        <div className="topControlsBox">

          <SimpleButton type='muteToggle' socket={this.props.socket}></SimpleButton>
          <SimpleButton type='close' socket={this.props.socket}></SimpleButton>
          <SmackButton socket={this.props.socket} type="smackTV"></SmackButton>

        </div>


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

        <h1>Netflix View Mode</h1>
      </div>
    );
  }
}

export default NetflixWatch;