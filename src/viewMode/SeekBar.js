import React from "react";
import "./SeekBar.css";

class SeekBar extends React.Component {

    onplayhead = false;

    constructor(props) {
        super(props);
        this.state = {
            duration: this.props.duration,
            currentTime: this.props.currentTime,
            socket: this.props.socket
        };
        this.clickPercent = this.clickPercent.bind(this);
        this.timelineClick = this.timelineClick.bind(this);
        this.playheadMouseDown = this.playheadMouseDown.bind(this);
        this.moveplayhead = this.moveplayhead.bind(this);
        //this.mouseUpSeekbar = this.mouseUpSeekbar.bind(this);
        this.formatTime = this.formatTime.bind(this);
        this.mouseMoveEventHandler = this.mouseMoveEventHandler.bind(this);
        this.mouseUpEventHandler = this.mouseUpEventHandler.bind(this);
    }


    componentDidUpdate(prevProps) {
        if (prevProps.duration !== this.props.duration) {
            this.setState({
                duration: this.props.duration
            });


        }
        if (prevProps.currentTime !== this.props.currentTime) {
            this.setState({
                currentTime: this.props.currentTime
            });
            //console.log("changing");
            let playhead = document.getElementById('playhead'); // playhead
            let timeline = document.getElementById('timeline'); // timeline

            // timeline width adjusted for playhead    
            let timelineWidth = timeline.offsetWidth - playhead.offsetWidth;

            let playPercent = timelineWidth * (this.state.currentTime / this.state.duration);
            playhead.style.marginLeft = playPercent + "px";

        }
    }

    componentDidMount() {
        window.addEventListener('mouseup', this.mouseUpEventHandler, false);
        //window.addEventListener('touchend', this.mouseUpEventHandler, false);

        //window.addEventListener('')
    }

    clickPercent(event) {
        let playhead = document.getElementById('playhead');
        let timeline = document.getElementById('timeline');
        let timelineWidth = timeline.offsetWidth - playhead.offsetWidth;
        let valueToReturn = 0;
        if (event.touches != null && event.touches.length > 0) {
            valueToReturn = (event.touches[0].pageX - timeline.getBoundingClientRect().left) / timelineWidth;

        }
        else {
            valueToReturn = (event.clientX - timeline.getBoundingClientRect().left) / timelineWidth;
        }
        return valueToReturn;
    }

    timelineClick(event) {
        //alert("xaxax");
        console.log("xanax");
        this.moveplayhead(event);
        //Emit current time 
        let currentTime = this.state.duration * this.clickPercent(event);
        this.convertChangeToKeyPress(currentTime, true);
        //this.props.socket.emit("changeProgress", currentTime);
    }

    playheadMouseDown(event) {
        window.addEventListener('mousemove', this.mouseMoveEventHandler, false);
        //window.addEventListener('touchmove', this.mouseMoveEventHandler, false);

        console.log("xxx");
        this.onplayhead = true;
        let playhead = document.getElementById('playhead'); // playhead
        let timeline = document.getElementById('timeline'); // timeline
        let timelineWidth = timeline.offsetWidth - playhead.offsetWidth;
        //console.log('tlw ' + timelineWidth);
        //console.log('tlw clientx ' + event.clientX);
        let newMargLeft = 0;
        if (event.touches != null && event.touches.length > 0) {
            newMargLeft = event.touches[0].pageX - timeline.getBoundingClientRect().left;

        }
        else {
            newMargLeft = event.clientX - timeline.getBoundingClientRect().left;
        }

        console.log(newMargLeft);

        this.moveplayhead(event);

        let currentTime = (newMargLeft) / timelineWidth;

        //Emit current time 
        this.convertChangeToKeyPress(currentTime, false);
    }

    mouseMoveEventHandler(event) {
        if (this.onplayhead) {
            console.log("mousemove onplayhead");
            this.moveplayhead(event);
        }
    }

    mouseUpEventHandler(event) {
        if (this.onplayhead) {
            console.log("mouse up onplayhead");
            window.removeEventListener('mousemove', this.mouseMoveEventHandler);
        }

    }

    moveplayhead(event) {
        //window.alert("yeah");
        let playhead = document.getElementById('playhead'); // playhead
        let timeline = document.getElementById('timeline'); // timeline
        if (timeline != null && playhead != null) {
            console.log("xaxaxaxaa");
            let timelineWidth = timeline.offsetWidth - playhead.offsetWidth;

            let newMargLeft = 0;
            console.log('-----');
            if (event.touches != null && event.touches.length > 0) {
                console.log("touches");
                console.log(event.touches);
                newMargLeft = event.touches[0].pageX - timeline.getBoundingClientRect().left;
            }
            else {
                newMargLeft = event.clientX - timeline.getBoundingClientRect().left;
            }

            if (newMargLeft >= 0 && newMargLeft <= timelineWidth) {
                playhead.style.marginLeft = newMargLeft + "px";
            }
            if (newMargLeft < 0) {
                playhead.style.marginLeft = "0px";
            }
            if (newMargLeft > timelineWidth) {
                playhead.style.marginLeft = timelineWidth + "px";
            }


        }
    }

    mouseUpSeekbar(event) {
        if (this.onplayhead == true) {
            this.moveplayhead(event);
            //window.removeEventListener('mousemove', this.moveplayhead, true);
            //let currentTime = this.duration * this.clickPercent(event);
            //Emit play
        }
        this.onplayhead = false;
    }

    formatTime(number) {
        let h = Math.floor(number / 3600);
        let m = Math.floor(number % 3600 / 60);
        let s = Math.floor(number % 3600 % 60);

        let hDisplay = h > 0 ? h + ":" : "";
        let mDisplay = m > 0 ? m + ":" : "";
        let sDisplay = s;
        return hDisplay + mDisplay + sDisplay;
    }

    convertChangeToKeyPress(currentTime, playVideo) {
        let keyType = 'left';
        if (currentTime > this.state.currentTime) {
            keyType = 'right';
        }

        let absoluteDifference = Math.abs(currentTime - this.state.currentTime);
        let numPress = Math.floor(absoluteDifference / 10);
        let dataToBePassed = {
            'numPress': numPress,
            'keyType': keyType,
            'play': playVideo,
            'diff': Math.abs(currentTime - this.state.currentTime),
            'currentTime': currentTime
        }
        //this.props.socket.emit("changeProgress", dataToBePassed);
        this.props.onChangeProgress(dataToBePassed);
    }


    componentWillUnmount() {
        //Clean up activities
        window.removeEventListener('mousemove', this.mouseMoveEventHandler, false);
        window.removeEventListener('mouseup', this.mouseUpEventHandler, false);
        //window.removeEventListener('touchmove', this.mouseMoveEventHandler, false);
        //window.removeEventListener('touchstart', this.mouseUpEventHandler, false);

        this.onplayhead = false;

    }

    render() {


        let formattedTime = this.formatTime(this.state.duration - this.state.currentTime);

        return (
            <div id="audioplayer">
                <div id="timeline" onClick={this.timelineClick}>
                    <div id="playhead" tabindex="0"
                        onMouseDown={this.playheadMouseDown}></div>
                </div>
                <span>
                    {formattedTime}
                </span>
            </div>
        );
    }
}

export default SeekBar;