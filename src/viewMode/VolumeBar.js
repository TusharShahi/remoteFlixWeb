import React from "react";
import "./VolumeBar.css";

class VolumeBar extends React.Component {

    onplayhead = false;
    previousValue = null;
    timeLineWidth = null;
    constructor(props) {
        super(props);
        this.state = {
            currentVolume: this.props.volumeLevel,
            socket: this.props.socket
        };
        this.clickPercent = this.clickPercent.bind(this);
        this.volumeBarClick = this.volumeBarClick.bind(this);
        this.playheadMouseDown = this.playheadMouseDown.bind(this);
        this.moveVolumeHead = this.moveVolumeHead.bind(this);
        //this.mouseUpSeekbar = this.mouseUpSeekbar.bind(this);

        this.mouseMoveEventHandler = this.mouseMoveEventHandler.bind(this);
        this.mouseUpEventHandler = this.mouseUpEventHandler.bind(this);

        this.timelineRef = React.createRef();
        this.playheadRef = React.createRef();
        this.timelineProgressRef = React.createRef();
    }


    componentDidUpdate(prevProps) {

        if (prevProps.volumeLevel !== this.props.volumeLevel) {

            console.log("did update");
            console.log(this.props.volumeLevel);

            this.setState({
                currentVolume: this.props.volumeLevel
            });

            // timeline width adjusted for playhead    
            let timelineWidth = this.timelineRef.current.offsetWidth;

            let playPercent = timelineWidth * (this.props.volumeLevel);
            //console.log(playPercent);
            //console.log(this.previousValue);
            console.log(timelineWidth);
            console.log(playPercent);
            //if (Math.abs(this.playheadRef.current.style.marginLeft - playPercent) > 15)
            if (playPercent < 10) {
                this.playheadRef.current.style.marginLeft = `${playPercent - 5}px`;
            } else if (this.props.volumeLevel > 99) {
                this.playheadRef.current.style.marginLeft = `${playPercent - 25}px`;
            }
            else {
                this.playheadRef.current.style.marginLeft = `${playPercent - 15}px`;
            }
            this.timelineProgressRef.current.style.width = `${playPercent}px`;

            console.log("done");




        }
    }

    componentDidMount() {
        //console.log(this.timelineRef.current.style.width);
        //this.timeLineWidth = this.timelineRef.current.style.width;
        let timelineWidth = this.timelineRef.current.offsetWidth;
        let playPercent = timelineWidth * (this.props.volumeLevel);
        if (playPercent < 10) {
            this.playheadRef.current.style.marginLeft = `${playPercent - 5}px`;
        } else if (this.props.volumeLevel > 99) {
            this.playheadRef.current.style.marginLeft = `${playPercent - 25}px`;
        }
        else {
            this.playheadRef.current.style.marginLeft = `${playPercent - 15}px`;
        }
        this.timelineProgressRef.current.style.width = `${playPercent}px`;
        window.addEventListener('mouseup', this.mouseUpEventHandler, false);
        //window.addEventListener('touchend', this.mouseUpEventHandler, false);

        //window.addEventListener('')
    }

    clickPercent(event) {
        let timelineWidth = this.timelineRef.current.offsetWidth - this.playheadRef.current.offsetWidth;
        let valueToReturn = 0;
        console.log(timelineWidth);
        if (event.touches != null && event.touches.length > 0) {
            console.log((event.touches[0].pageX - this.timelineRef.current.getBoundingClientRect().left));
            valueToReturn = (event.touches[0].pageX - this.timelineRef.current.getBoundingClientRect().left) / timelineWidth;

        }
        else {
            console.log((event.clientX - this.timelineRef.current.getBoundingClientRect().left));
            valueToReturn = (event.clientX - this.timelineRef.current.getBoundingClientRect().left) / timelineWidth;
        }

        if (valueToReturn > 1) valueToReturn = 1;
        return valueToReturn;
    }

    volumeBarClick(event) {
        //alert("xaxax");
        console.log("xanax");
        this.moveVolumeHead(event);
        //Emit current time 
        let currentVolume = 100 * this.clickPercent(event);
        console.log(currentVolume);

        let playHeadMarginLeft = this.playheadRef.current.style.marginLeft;
        this.previousValue = parseFloat(playHeadMarginLeft.split('p')[0]);

        this.props.socket.emit("changeVolume", currentVolume);
        if (currentVolume == 0 || this.props.isMute) {
            this.props.socket.emit(this.props.muteEventName);
        }

    }

    playheadMouseDown(event) {
        console.log("on mouse down");
        window.addEventListener('mousemove', this.mouseMoveEventHandler, false);
        //window.addEventListener('touchmove', this.mouseMoveEventHandler, false);

        console.log("xxx");
        let timelineWidth = this.timelineRef.current.offsetWidth - this.playheadRef.current.offsetWidth;
        ///console.log('tlw ' + timelineWidth);
        //console.log('tlw clientx ' + event.clientX);
        let newMargLeft = 0;
        if (event.touches != null && event.touches.length > 0) {
            newMargLeft = event.touches[0].pageX - this.timelineRef.current.getBoundingClientRect().left;

        }
        else {
            newMargLeft = event.clientX - this.timelineRef.current.getBoundingClientRect().left;
        }

        console.log(newMargLeft);

        this.moveVolumeHead(event);

        let currentVolume = (newMargLeft) / timelineWidth;
        //Emit current volume 
        this.props.socket.emit("changeVolume", currentVolume);
        if (currentVolume == 0 || this.props.isMute) {
            this.props.socket.emit(this.props.muteEventName);
        }

    }

    mouseMoveEventHandler(event) {
        if (this.onplayhead) {
            console.log("mousemove onplayhead");
            this.moveVolumeHead(event);
        }
    }

    mouseUpEventHandler(event) {
        if (this.onplayhead) {
            console.log("mouse up onplayhead");
            window.removeEventListener('mousemove', this.mouseMoveEventHandler);
        }

    }

    moveVolumeHead(event) {

        if (this.timelineRef.current != null && this.playheadRef.current != null) {
            console.log("xaxaxaxaa");

            let timelineWidth = this.timelineRef.current.offsetWidth - this.playheadRef.current.offsetWidth;

            let newMargLeft = 0;
            console.log('-----');
            if (event.touches != null && event.touches.length > 0) {

                newMargLeft = event.touches[0].pageX - this.timelineRef.current.getBoundingClientRect().left;
            }
            else {
                newMargLeft = event.clientX - this.timelineRef.current.getBoundingClientRect().left;
            }

            if (newMargLeft >= 0 && newMargLeft <= timelineWidth) {
                if (newMargLeft < 10) {
                    this.playheadRef.current.style.marginLeft = `${newMargLeft - 5}px`;
                } else if (this.state.currentVolume > 99) {
                    this.playheadRef.current.style.marginLeft = `${newMargLeft - 25}px`;
                }
                else {
                    this.playheadRef.current.style.marginLeft = `${newMargLeft - 15}px`;
                }
                this.timelineProgressRef.current.style.width = `${newMargLeft}px`;
                console.log("done");
            }
            if (newMargLeft < 0) {
                this.playheadRef.current.style.marginLeft = "0px";
                this.timelineProgressRef.current.style.width = "0%";

            }
            if (newMargLeft > timelineWidth) {
                this.playheadRef.current.style.marginLeft = timelineWidth + "px";
                this.timelineProgressRef.current.style.width = "75%";

            }


        }
    }

    mouseUpSeekbar(event) {
        if (this.onplayhead == true) {
            this.moveVolumeHead(event);
            let volumehead = document.getElementById('volumehead'); // volumehead
            let playHeadMarginLeft = volumehead.style.marginLeft;
            this.previousValue = parseFloat(playHeadMarginLeft.split('p')[0]);

        }
        this.onplayhead = false;
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



        return (
            <div id="audioplayer">

                <div id="timeline" onClick={this.volumeBarClick} onMouseDown={this.party}
                    ref={this.timelineRef}>

                    <div className="timelineProgress" ref={this.timelineProgressRef}>

                    </div>
                    <scan id="volumehead" tabindex="0" ref={this.playheadRef}
                        onMouseDown={this.playheadMouseDown}></scan>
                </div>

            </div>
        );
    }
}

export default VolumeBar;