import React from "react";
import Slider from 'react-input-slider';
import "./VolumeInputBar.css";

class VolumeInputBar extends React.Component {

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
            currentVolume: this.props.volumeLevel,
            socket: this.props.socket
        };

        this.changeVolume = this.changeVolume.bind(this);


    }


    componentDidUpdate(prevProps) {
        if (prevProps.volumeLevel !== this.props.volumeLevel) {


            this.setState({
                currentVolume: this.props.volumeLevel
            });
        }
    }

    componentDidMount() {
        // window.addEventListener('mouseup', this.mouseUpEventHandler, false);
        //window.addEventListener('touchend', this.mouseUpEventHandler, false);

        //window.addEventListener('')
    }


    changeVolume(value) {
        console.log("emit volume " + value);
        this.props.socket.emit("changeVolume", (value * 100));

        if (value == 0 || this.props.isMute) {
            this.props.socket.emit(this.props.muteEventName);
        }

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


        return (
            <div id="audioplayer">

                <Slider
                    styles={{
                        track: {
                            backgroundColor: '#383838'
                        },
                        active: {
                            backgroundColor: '#f5f5f5'
                        },
                        thumb: {
                            width: 20,
                            height: 20
                        }
                    }}

                    axis="x"
                    xstep={0.001}
                    xmin={0}
                    xmax={1}
                    x={this.state.currentVolume}
                    onChange={({ x }) => this.changeVolume(x, true)}


                />
            </div>

        );
    }
}

export default VolumeInputBar;