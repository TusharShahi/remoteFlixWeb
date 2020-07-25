import React from "react";
import SimpleButton from "./SimpleButton"
import SelectList from "./SelectList";


 class NetflixWatch extends React.Component {
  constructor(props){
    super(props);
    console.log(this.props);
    this.state = {

    };
    
  }


  render() {
    let episodeSelectComponent = <div></div>;
    if(this.props.selectedEpisode == null){
      episodeSelectComponent =  <div id='episodesBox'>
        <h4>{this.props.episodeSelectComponent}</h4>
      <SelectList socket={this.props.socket}  inputs={this.props.episodes} name='episodes' selectedValue={this.props.selectedEpisode}></SelectList></div>;
    }

    return (

      <div>
          <h1>Netflix View Mode</h1>
          

          <div id='tracksBox'>
            <div id='subsTracksBox'>
                <SelectList socket={this.props.socket} inputs={this.props.subtitleTracks} name='subs' selectedValue={this.props.selectedSubtitle}></SelectList>            
              </div>
                
              <div id='audioTracksBox'>
                <SelectList socket={this.props.socket}  inputs={this.props.audioTracks} name='audio' selectedValue={this.props.selectedAudio}></SelectList>
              </div>

          </div>


          <SimpleButton type='play' socket={this.props.socket}></SimpleButton>
          <SimpleButton type='pause' socket={this.props.socket}></SimpleButton>
          <SimpleButton type='forward' socket={this.props.socket}></SimpleButton>
          <SimpleButton type='backward' socket={this.props.socket}></SimpleButton>
          
          <SimpleButton type='nextEpisode' socket={this.props.socket}></SimpleButton>
          <SimpleButton type='muteToggle' socket={this.props.socket}></SimpleButton>

      </div>
    );
  }
}

export default NetflixWatch;