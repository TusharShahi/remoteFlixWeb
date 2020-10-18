import React from "react";
import { Socket } from "socket.io-client";


import "./SelectList.css";
class SelectList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      value: this.props.selectedValue
    };
    this.getList = this.getList.bind(this);
    this.handleChange = this.handleChange.bind(this);


  }

  getList() {
    let items = [];
    //console.log('selected value is ' + this.props.selectedValue);

    if (this.props.inputs != null) {
      for (let i = 0; i < this.props.inputs.length; i++) {
        if (this.props.selectedValue == this.props.inputs[i]) {
          //console.log('it is true for ' + i);
          items.push(<option key={this.props.inputs[i]} value={this.props.inputs[i]}>{this.props.inputs[i]}</option>);
        }
        else {
          items.push(<option key={this.props.inputs[i]} value={this.props.inputs[i]}>{this.props.inputs[i]}</option>);

        }
      }
    }
    return items;
  }

  handleChange(event) {
    //console.og('called');
    let emitEvent = '';
    let selectedData = null;
    if (this.props.name == 'subs') {
      emitEvent = 'changeSubs'
      selectedData = event.target.value;
    }
    else if (this.props.name == 'episodes') {
      emitEvent = 'changeEpisodes'
      selectedData = document.getElementsByClassName('episodes')[0].selectedIndex;

    }
    else if (this.props.name == 'audio') {
      emitEvent = 'changeAudios'
      selectedData = event.target.value;
    }
    if (emitEvent != '') {
      //console.og('there has been a change');
      this.props.socket.emit(emitEvent, selectedData);
      this.setState({ value: event.target.value });
    }
  }

  componentDidMount() {
    //console.og('rendered select list');
  }

  render() {
    let listType = '';
    if (this.props.name == 'subs') {
      listType = 'Subtitles';
    }
    else if (this.props.name == 'audio') {
      listType = 'Audio';
    }
    else if (this.props.name == 'episodes') {
      listType = 'Episodes';
    }


    return (
      <div className='SelectList'>
        <h4>{listType}</h4>
        <select onChange={this.handleChange} className={this.props.name} value={this.props.selectedValue}>
          {this.getList()}
        </select>
      </div>
    );
  }
}

export default SelectList;