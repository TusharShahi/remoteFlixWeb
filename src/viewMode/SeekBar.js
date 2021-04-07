import React from "react";
import "./SeekBar.css";

class SeekBar extends React.Component {

    onplayhead = false;
    lockTimeLine = false;
    previousValue = null;

    clickPercentValue = null;
    mouseUpValueToUse = null;
    constructor(props) {
        super(props);
        this.state = {
            duration: this.props.duration,
            currentTime: this.props.currentTime,
            socket: this.props.socket
        };

        this.timelineRef = React.createRef();
        this.playheadRef = React.createRef();
        this.timelineProgressRef = React.createRef();

        this.clickPercent = this.clickPercent.bind(this);
        this.timelineClick = this.timelineClick.bind(this);
        this.playheadMouseDown = this.playheadMouseDown.bind(this);
        this.playheadMouseUp = this.playheadMouseUp.bind(this);
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
            //console.log(this.lockTimeLine);


            this.setState({
                currentTime: this.props.currentTime
            });
            //console.log("changing");


            // timeline width adjusted for playhead    
            let timelineWidth = this.timelineRef.current.offsetWidth;

            let playPercent = timelineWidth * (this.state.currentTime / this.state.duration);
            //console.log(playPercent);
            //console.log(this.previousValue);
            if (this.lockTimeLine == true &&
                (this.previousValue != null && Math.abs(playPercent - this.previousValue) < 2)) {
            }
            else {
                //console.log(playPercent);
                this.playheadRef.current.style.marginLeft = playPercent + "px";
                this.timelineProgressRef.current.style.width = `${playPercent + 2}px`;
                //  console.log("done");
            }



        }
    }

    componentDidMount() {
        window.addEventListener('mouseup', this.mouseUpEventHandler, false);
        //window.addEventListener('touchend', this.mouseUpEventHandler, false);

        //window.addEventListener('')
    }

    clickPercent(event) {

        let timelineWidth = this.timelineRef.current.offsetWidth - this.playheadRef.current.offsetWidth;
        let valueToReturn = 0;
        if (event.touches != null && event.touches.length > 0) {
            valueToReturn = (event.touches[0].pageX - this.timelineRef.current.getBoundingClientRect().left) / timelineWidth;

        }
        else {
            valueToReturn = (event.clientX - this.timelineRef.current.getBoundingClientRect().left) / timelineWidth;
        }
        return valueToReturn;
    }

    timelineClick(event) {
        //alert("xaxax");
        console.log("timeline click called");
        this.moveplayhead(event);
        //Emit current time 
        let currentTime = this.state.duration * this.clickPercent(event);
        console.log(currentTime);

        let playHeadMarginLeft = this.playheadRef.current.style.marginLeft;
        this.previousValue = parseFloat(playHeadMarginLeft.split('p')[0]);

        this.convertChangeToKeyPress(currentTime, true);
        //this.props.socket.emit("changeProgress", currentTime);
    }

    playheadMouseDown(event) {
        console.log("on mouse down");
        window.addEventListener('mousemove', this.mouseMoveEventHandler, false);
        //window.addEventListener('touchmove', this.mouseMoveEventHandler, false);

        console.log("xxx");
        this.onplayhead = true;

        // let timelineWidth = this.timelineRef.current.offsetWidth - this.playheadRef.current.offsetWidth;
        //console.log('tlw ' + timelineWidth);
        //console.log('tlw clientx ' + event.clientX);
        // let newMargLeft = 0;
        // if (event.touches != null && event.touches.length > 0) {
        //   newMargLeft = event.touches[0].pageX - this.timelineRef.current.getBoundingClientRect().left;

        //      }
        //        else {
        // newMargLeft = event.clientX - this.timelineRef.current.getBoundingClientRect().left;
        //    }

        //console.log(newMargLeft);

        this.moveplayhead(event);

        //let currentTime = (newMargLeft) / timelineWidth;

        //Emit current time 
        // this.convertChangeToKeyPress(currentTime, false);
    }

    playheadMouseUp(event) {
        console.log("mouse up");
        if (this.clickPercentValue != null) {

            let currentTime = this.state.duration * this.clickPercentValue;
            console.log("current Time is " + currentTime);

            //let playHeadMarginLeft = this.playheadRef.current.style.marginLeft;
            //this.previousValue = parseFloat(playHeadMarginLeft.split('p')[0]);
            this.convertChangeToKeyPress(currentTime, true);

        }
    }


    mouseMoveEventHandler(event) {
        if (this.onplayhead) {
            console.log("mousemove onplayhead");
            this.moveplayhead(event);
        }
    }

    mouseUpEventHandler(event) {
        if (this.onplayhead) {
            console.log("mouse up event handler");
            window.removeEventListener('mousemove', this.mouseMoveEventHandler);
        }

    }

    moveplayhead(event) {
        console.log("move playhead called");
        this.lockTimeLine = true;
        setTimeout(() => {
            this.lockTimeLine = false;
        }, 3000);



        if (this.timelineRef.current != null && this.playheadRef.current != null) {

            let timelineWidth = this.timelineRef.current.offsetWidth - this.playheadRef.current.offsetWidth;

            let newMargLeft = 0;
            console.log('-----');
            if (event.touches != null && event.touches.length > 0) {

                newMargLeft = event.touches[0].pageX - this.timelineRef.current.getBoundingClientRect().left;
            }
            else {
                newMargLeft = event.clientX - this.timelineRef.current.getBoundingClientRect().left;
            }

            this.clickPercentValue = newMargLeft;

            if (newMargLeft >= 0 && newMargLeft <= timelineWidth) {
                this.playheadRef.current.style.marginLeft = newMargLeft + "px";
                this.timelineProgressRef.current.style.width = `${newMargLeft}px`;

            }
            if (newMargLeft < 0) {
                this.playheadRef.current.style.marginLeft = "0px";
                this.timelineProgressRef.current.style.width = "0%";

            }
            if (newMargLeft > timelineWidth) {
                this.playheadRef.current.style.marginLeft = timelineWidth + "px";
                this.timelineProgressRef.current.style.width = "100%";

            }

            let valueToReturn = 0;
            if (event.touches != null && event.touches.length > 0) {
                valueToReturn = (event.touches[0].pageX - this.timelineRef.current.getBoundingClientRect().left) / timelineWidth;
            }
            else {
                valueToReturn = (event.clientX - this.timelineRef.current.getBoundingClientRect().left) / timelineWidth;
            }
            console.log(valueToReturn);
            this.clickPercentValue = valueToReturn;

        }
    }

    mouseUpSeekbar(event) {
        console.log("mouse up seekar called");
        if (this.onplayhead == true) {
            this.moveplayhead(event);

            let playHeadMarginLeft = this.playheadRef.current.style.marginLeft;
            this.previousValue = parseFloat(playHeadMarginLeft.split('p')[0]);
            //window.removeEventListener('mousemove', Lethis.moveplayhead, true);
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
        let mDisplay = m > -1 ? m < 10 ? "0" + m + ":" : m + ":" : "";
        let sDisplay = s > -1 ? s < 10 ? "0" + s : s : "";
        return hDisplay + mDisplay + sDisplay;
    }

    convertChangeToKeyPress(currentTime, playVideo) {
        console.log("converting to key press");
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
        let elapsedTime = this.formatTime(this.state.currentTime);

        return (
            <div id="seekBar">

                <div id="timeline" ref={this.timelineRef} onClick={this.timelineClick} onMouseDown={this.party}>

                    <div className="timelineProgress" ref={this.timelineProgressRef}>

                    </div>
                    <scan id="playhead" tabindex="0" ref={this.playheadRef}
                        onMouseDown={this.playheadMouseDown} onMouseUp={this.playheadMouseUp}
                        onTouchStart={this.playheadMouseDown} onTouchEnd={this.playheadMouseUp}

                    ></scan>
                </div>
                <span className='elapsedTime'>
                    {elapsedTime}
                </span>
                <span className='remainingTime'>
                    {formattedTime}
                </span>
            </div>
        );
    }
}

export default SeekBar;