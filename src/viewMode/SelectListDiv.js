import React from "react";
import { Socket } from "socket.io-client";

import "./SelectListDiv.css";
class SelectListDiv extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      value: this.props.selectedValue,
      episodeNumber: this.props.episodeNumber
    };

    this.listRef = React.createRef();

    this.getList = this.getList.bind(this);
    this.showList = this.showList.bind(this);
    this.hideList = this.hideList.bind(this);
    this.toggleList = this.toggleList.bind(this);

    this.changeSelection = this.changeSelection.bind(this);
  }

  componentDidMount() {
    if (this.props.name != "episodes") {
      console.log("did mount");
      let listLength = this.props.inputs.length;
      let newHeight = listLength * 50 - 10;
      let newHeightPx = newHeight + "px";
      console.log(newHeightPx);
      this.listRef.current.style.height = newHeightPx;
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.episodeNumber !== this.props.episodeNumber) {
      this.setState({
        episodeNumber: this.props.episodeNumber
      });
    }
  }

  getList() {
    let items = [];
    //console.log('selected value is ' + this.props.selectedValue);

    if (this.props.inputs != null) {
      for (let i = 0; i < this.props.inputs.length; i++) {
        let episodeNumberSpan = null;
        if (this.props.name == "episodes" && this.props.episodeNumber != null) {
          let episodeNumber = "S" + this.props.seasonNumber + ":E" + (i + 1);
          episodeNumberSpan = (
            <span className="trackNumber">{episodeNumber}</span>
          );
        }
        if (this.props.name == "subs") console.log(this.props.selectedValue);

        if (this.props.selectedValue == this.props.inputs[i]) {
          //console.log('it is true for ' + i);
          items.push(
            <div className="listItem selected">
              {episodeNumberSpan}
              <span className="trackTitle">{this.props.inputs[i]}</span>
            </div>
          );
        } else {
          items.push(
            <div
              className="listItem"
              onClick={this.changeSelection.bind(this, this.props.inputs[i])}
            >
              {episodeNumberSpan}
              <span className="trackTitle">{this.props.inputs[i]}</span>
            </div>
          );
        }
      }
    }
    return items;
  }

  changeSelection(newValue) {
    console.log(newValue);
    let emitEvent = "";
    let selectedData = null;
    if (this.props.name == "subs") {
      emitEvent = "changeSubs";
      selectedData = newValue;
    } else if (this.props.name == "episodes") {
      emitEvent = "changeEpisodes";

      console.log(this.props.inputs);
      if (this.props.inputs != null && this.props.inputs.length > 0) {
        selectedData = this.props.inputs.indexOf(newValue);
      }
    } else if (this.props.name == "audio") {
      emitEvent = "changeAudios";
      selectedData = newValue;
    }
    console.log("emit change in " + emitEvent);
    console.log(selectedData);
    this.props.socket.emit(emitEvent, selectedData);
    this.hideList();
    this.props.onChangeSelection(newValue, this.props.name);
    this.setState({ value: newValue });
  }

  showList() {
    console.log("show list called");
    this.listRef.current.classList.remove("hideList");
    this.listRef.current.classList.add("showList");
  }

  hideList() {
    console.log("hide list called");
    this.listRef.current.classList.remove("showList");
    this.listRef.current.classList.add("hideList");
  }

  toggleList() {
    if (this.listRef.current.classList.contains("showList")) {
      this.hideList();
    } else {
      this.showList();
    }
  }

  render() {
    // console.log("rendered");
    if (this.props.name == "subs") {
      console.log(this.props.selectedValue);
    }
    console.log(this.props);
    let listType = undefined;
    let episodeNumber = undefined;
    let listClassName = " listDiv hideList";
    if (this.props.name == "subs") {
      listType = <h4>Subtitles</h4>;
      listClassName = "subtitles" + listClassName;
    } else if (this.props.name == "audio") {
      listType = <h4>Audio</h4>;
      listClassName = "audios" + listClassName;
    } else if (this.props.name == "episodes") {
      if (this.state.episodeNumber != null) {
        console.log(this.props.episodeTitle);
        if (this.props.episodeTitle != null) {
          console.log(this.props.episodeNumber);
          if (this.props.episodeNumber == null) {
          } else {
            const episodeTitle = `S${this.props.seasonNumber}: E${
              this.props.episodeNumber === 0 ? 1 : this.props.episodeNumber
            }`;
            episodeNumber = (
              <span className="episodeNumber">{episodeTitle}</span>
            );
          }
        }
      }
    }
    let parentDivClassName = "SelectList " + this.props.name;
    console.log(this.props.selectedValue);
    return (
      <div className={parentDivClassName}>
        {listType}

        <div tabIndex="0" onBlur={this.hideList} className={this.props.name}>
          <div onClick={this.toggleList} className="ListTitle">
            {episodeNumber}
            <div>
              <p>{this.props.selectedValue}</p>
              <img src="/iconChevronDown.svg" alt="Down Arrow"></img>
            </div>
          </div>

          <div className={listClassName} ref={this.listRef}>
            {this.getList()}
          </div>
        </div>
      </div>
    );
  }
}

export default SelectListDiv;
