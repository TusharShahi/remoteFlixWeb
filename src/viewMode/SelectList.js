import React from "react";
import { Socket } from "socket.io-client";

 class SelectList extends React.Component {
  constructor(props){
    super(props);
    
    this.state = {
      value : this.props.selectedValue
    };
    this.getList = this.getList.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  getList(){
    let items= [];
    
    if(this.props.inputs!=null){
      for(let i = 0; i < this.props.inputs.length;i++){
        items.push(<option key={this.props.inputs[i]} value={this.props.inputs[i]}>{this.props.inputs[i]}</option>); 
      }
    }
    return items;  
  }

  handleChange(event) {    
    console.log('called');
      let emitEvent = '';
      if(this.props.name == 'subs'){
        emitEvent = 'changeSubs'
      }
      else if(this.props.name == 'episodes'){
        emitEvent = 'changeEpisode'
      }
      else if(this.props.name == 'audio'){
        emitEvent = 'changeAudio'
      }
      if(emitEvent!=''){
        console.log('there has been a change');
        this.props.socket.emit(emitEvent,event.target.value);
        this.setState({value: event.target.value});  
      }
  }
 

  render() {
    let listType  = '';
    if(this.props.name == 'subs'){
      listType = 'Subtitles';
    }
    else if(this.props.name == 'audio'){
        listType = 'Audio';
    }
    else if(this.props.name == 'episodes'){
        listType = 'Episodes';     
    }

  
    return (
      <div>
        <h4>{listType}</h4>  
        <select value={this.state.value} onChange={this.handleChange}>
            {this.getList()}
        </select>
      </div>
    );
  }
}

export default SelectList;