import React from "react";
import Slider from 'react-input-slider';
import "./InputSeekBar.css";

class InputSeekBar extends React.Component {

    //   onplayhead = false;
    lockTimeLine = false;
    draggingEnd = true;

    dragTime = null;
    // previousValue = null;

    //clickPercentValue = null;
    //mouseUpValueToUse = null;
    constructor(props) {
        super(props);
        this.state = {
            duration: this.props.duration,
            currentTime: this.props.currentTime,
            socket: this.props.socket
        };

        this.convertChangeToKeyPress = this.convertChangeToKeyPress.bind(this);
        this.dragEnd = this.dragEnd.bind(this);


    }


    componentDidUpdate(prevProps) {
        if (prevProps.duration !== this.props.duration) {
            this.setState({
                duration: this.props.duration
            });


        }

        if (prevProps.currentTime !== this.props.currentTime) {
            //console.log(this.lockTimeLine);

            if (!this.lockTimeLine) {
                this.setState({
                    currentTime: this.props.currentTime
                });

            }
            //console.log("changing");


        }
    }

    componentDidMount() {
        // window.addEventListener('mouseup', this.mouseUpEventHandler, false);
        //window.addEventListener('touchend', this.mouseUpEventHandler, false);

        //window.addEventListener('')
    }




    formatTime(number) {
        let h = Math.floor(number / 3600);
        let m = Math.floor(number % 3600 / 60);
        let s = Math.floor(number % 3600 % 60);

        let hDisplay = h > 0 ? h + ":" : "";
        let mDisplay = m > -1 ? m < 10 ? "0" + m + ":" : m + ":" : "";
        let sDisplay = s > -1 ? s < 10 ? "0" + s : s : "";
        return hDisplay + mDisplay + sDisplay;
    }

    convertChangeToKeyPress(currentTime, playVideo) {
        if (!this.lockTimeLine) {
            console.log("converting to key press" + currentTime + "  " + this.state.currentTime);
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
            console.log(dataToBePassed);
            this.props.onChangeProgress(dataToBePassed);

        }
        else {
            console.log("converting to key press" + currentTime + "  " + this.state.currentTime);
            let keyType = 'left';
            if (currentTime > this.state.currentTime) {
                keyType = 'right';
            }

            let absoluteDifference = Math.abs(currentTime - this.state.currentTime);
            let numPress = Math.floor(absoluteDifference / 10);
            let dataToBePassed = {
                'numPress': numPress,
                'keyType': keyType,
                'play': false,
                'diff': Math.abs(currentTime - this.state.currentTime),
                'currentTime': currentTime,
                'type': 'drag'
            }
            console.log(dataToBePassed);
            this.props.onChangeProgress(dataToBePassed);
            this.setState({
                currentTime: currentTime
            });
        }
    }

    dragEnd(event) {
        console.log(event);
        console.log(event.clientX);
        console.log(event.target.value);
        this.draggingEnd = true;
        this.lockTimeLine = false;
        this.props.socket.emit("play");
    }
    dragStart(event) {
        console.log("drag start");
        this.draggingEnd = false;
        this.lockTimeLine = true;

    }


    componentWillUnmount() {
        //Clean up activities
        //  window.removeEventListener('mousemove', this.mouseMoveEventHandler, false);
        //    window.removeEventListener('mouseup', this.mouseUpEventHandler, false);
        //window.removeEventListener('touchmove', this.mouseMoveEventHandler, false);
        //window.removeEventListener('touchstart', this.mouseUpEventHandler, false);

        //   this.onplayhead = false;

    }

    render() {


        let formattedTime = this.formatTime(this.state.duration - this.state.currentTime);
        let elapsedTime = this.formatTime(this.state.currentTime);

        return (
            <div>
                <Slider
                    styles={{
                        track: {
                            backgroundColor: '#383838'
                        },
                        active: {
                            backgroundColor: '#E50914'
                        },
                        thumb: {
                            width: 20,
                            height: 20
                        }
                    }}

                    axis="x"
                    xstep={0.001}
                    xmin={0}
                    xmax={this.state.duration}
                    x={this.state.currentTime}
                    onChange={({ x }) => this.convertChangeToKeyPress(x, true)}
                    onDragEnd={(event) => this.dragEnd(event)}
                    onDragStart={(event) => this.dragStart(event)}




                />
                <span className='timeStamp elapsedTime'>
                    {elapsedTime}
                </span>
                <span className='timeStamp remainingTime'>
                    {formattedTime}
                </span>
            </div>
        );
    }
}

export default InputSeekBar;