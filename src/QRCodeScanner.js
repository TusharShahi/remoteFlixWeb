import React, { Component } from 'react'
import SimpleButton from './viewMode/SimpleButton';
import "./QRCodeScanner.css";

import jsQR from "jsqr";

const regexForOTP = '^[0-9]{6}$';

class QRCodeScanner extends Component {
    constructor(props) {

        super(props);

        this.stream = null;

        this.state = {
            result: 'No result',
            streaming: false,
            width: window.innerWidth - 20,
            height: 0,
            canvas: null,
            takePictureInterval: null
        }

        this.takePicture = this.takePicture.bind(this);
        this.startScan = this.startScan.bind(this);
        this.takePicture = this.takePicture.bind(this);

    }

    componentDidMount() {
        let videoElements = document.getElementsByTagName('video');
        let inputVideo = null;
        if (videoElements.length > 0) {
            inputVideo = videoElements[0];
            inputVideo.addEventListener('canplay', () => {
                console.log(this);

                if (!this.state.streaming) {
                    let newHeight = inputVideo.videoHeight / (inputVideo.videoWidth / this.state.width);

                    console.log("now run");
                    console.log(this.state.width);
                    console.log(this.state.height);

                    inputVideo.setAttribute('width', this.state.width);
                    inputVideo.setAttribute('height', newHeight);
                    this.state.canvas.setAttribute('width', this.state.width);
                    this.state.canvas.setAttribute('height', newHeight);
                    this.setState({
                        height: newHeight,
                        streaming: true
                    });

                    let clickInterval = setInterval(this.takePicture, 300);

                    this.setState({
                        takePictureInterval: clickInterval
                    });
                }
            }, false);
        }
    }

    componentWillUnmount() {
        clearInterval(this.takePictureInterval);
        if (this.stream != null)
            this.stream.getTracks().forEach((track) => {
                track.stop();
            });
    }

    startScan() {
        let videoElements = document.getElementsByTagName('video');
        let inputVideo = null;
        if (videoElements.length > 0) {
            inputVideo = videoElements[0];
            navigator.mediaDevices.getUserMedia({
                video:
                {
                    facingMode:
                        { exact: 'environment' }
                    ,
                    width: { min: window.innerWidth - 20 },
                    height: { min: window.innerHeight - 200 }
                }, audio: false
            })
                .then((inputStream) => {
                    inputVideo.srcObject = inputStream;
                    let canvasElement = document.getElementsByTagName('canvas')[0];
                    console.log(canvasElement);
                    this.setState({
                        canvas: canvasElement
                    });
                    this.stream = inputStream;
                    console.log(this.state.canvas);
                    inputVideo.play();
                })
                .catch(function (err) {
                    console.log("An error occurred: " + err);
                });
        }
        else {


        }
    }

    takePicture() {
        let videoElements = document.getElementsByTagName('video');
        let inputVideo = null;
        if (videoElements.length > 0) {
            inputVideo = videoElements[0];
            console.log("called");
            console.log(this.state.canvas);
            let canvas = document.getElementsByTagName('canvas')[0];
            let context = canvas.getContext('2d');
            console.log(context);

            if (this.state.width && this.state.height) {
                //let canvas = { ...this.state.canvas }
                canvas.width = this.state.width;;
                canvas.height = this.state.height;
                this.setState({ canvas });
                context.drawImage(inputVideo, 0, 0, canvas.width, canvas.height);
                //, this.state.width, this.state.height);

                //console.log(this.state.width);
                //console.log(this.state.height);
                let imageData = context.getImageData(0, 0, this.state.width, this.state.height);
                //console.log(imageData);


                const scannedResult = jsQR(imageData.data, imageData.width, imageData.height);
                //console.log(scannedResult);
                if (scannedResult != null) {
                    if (scannedResult.data != null && scannedResult.data.match(regexForOTP)) {
                        console.log("matched");
                        console.log("Found QR code", scannedResult.data);
                        this.props.onSuccessfulScan(scannedResult.data);
                    }
                }
            }
        }
    }



    render() {
        return (
            <div className="Scanner">
                <div className="Camera">
                    <video id="video">Video stream not available.</video>
                </div>
                <canvas className="canvas">
                </canvas>


                <SimpleButton type="scan" onStartScanner={this.startScan}></SimpleButton>
            </div>
        )
    }
}


export default QRCodeScanner;