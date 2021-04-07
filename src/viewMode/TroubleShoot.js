import React from "react";
import "./TroubleShoot.css";

class TroubleShoot extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        }

        //this.textInput = React.createRef();
        // this.focusTextInput = this.focusTextInput.bind(this);
    }

    componentDidUpdate(prevProps) {
    }

    render() {
        return (
            <div className='troubleShootBox'>

                <div class='closeButton'>
                    <img src='/iconExit.svg' onClick={this.props.onCloseTroubleShoot} alt='exit Icon'></img>
                </div>
                <div class='mainContentBox'>
                    <h1>Help</h1>
                    <h2>Passcode : {this.props.passCode}</h2>
                    <div className='content'>
                        <div>
                            <div className='pointers'>
                                <span className='pointerBullet'>1.</span>
                                <p>
                                    To start the remote after connecting, you may have to hit play/pause.
                            </p>
                            </div>
                            <div className='pointers'>
                                <span className='pointerBullet'>2.</span>
                                <p>
                                    If you face trouble while using the remote, try hitting refresh <span className='icon'>&#x27F3;</span> .
                                </p>
                            </div>
                            <div className='pointers'>
                                <span className='pointerBullet'>3.</span>
                                <p>
                                    If hitting refresh does not help, reset connection on the main extension.
                            </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default TroubleShoot;