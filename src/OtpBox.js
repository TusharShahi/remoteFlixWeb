import React from "react";
import "./OtpBox.css";
import QRCodeScanner from "./QRCodeScanner";

class OtpBox extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      otpValue: null,
      connectionError: '',
      showForceLogin: false
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.forceLoginFunction = this.forceLoginFunction.bind(this);
    this.sendScannedOTP = this.sendScannedOTP.bind(this);
    //this.textInput = React.createRef();
    // this.focusTextInput = this.focusTextInput.bind(this);
  }

  handleChange(event) {
    this.setState({ otpValue: event.target.value });
    this.props.clearAlert();
  }

  focusTextInput() {
    // Explicitly focus the text input using the raw DOM API
    // Note: we're accessing "current" to get the DOM node
    //   this.textInput.current.focus();
  }


  handleSubmit(event) {
    console.log('on submit clicked');
    event.preventDefault();
    this.props.submitMethod(this.state.otpValue);

  }

  componentDidUpdate(prevProps) {
    console.log('component did update');
    console.log(prevProps.showConnectionError);
    console.log(this.props.showConnectionError);
    if (prevProps.showConnectionError !== this.props.showConnectionError) {
      console.log('change');
      let displayForceLogin = false;
      if (this.props.showConnectionError == "One phone is already connected.") {
        displayForceLogin = true;
      }
      console.log(displayForceLogin);
      this.setState({
        connectionError: this.props.showConnectionError,
        showForceLogin: displayForceLogin
      });
    }
  }

  sendScannedOTP(otpValue) {
    this.props.submitMethod(otpValue);
  }

  forceLoginFunction() {
    this.props.forceLogin();
  }

  render() {
    console.log('renderedd');
    let alertText = <p>{this.state.connectionError}</p>;
    //let forceLogin = null;
    if (this.state.showForceLogin) {
      console.log('asdsd');
      alertText = <p>One phone is already connected.
        <span role="button" className="forceLoginButton" onClick={this.forceLoginFunction}>Force Login?</span>
      </p>
    }
    return (

      <div>
        <h1>FlixRemote</h1>
        <div>
          <QRCodeScanner onSuccessfulScan={this.sendScannedOTP}></QRCodeScanner>

        </div>
        <div>
          <form onSubmit={this.handleSubmit}>
            <label htmlFor="inputOtp">Please Enter 6 Digit Passcode</label>
            <input
              type="text" pattern="[0-9]{6}" id="inputOtp"
              inputmode="numeric"
              onChange={this.handleChange} maxLength="6"
              oninvalid="this.setCustomValidity('Enter 6 Digit Passcode')"
              oninput="this.setCustomValidity('')"
              /*placeholder="Please enter passcode"*/
              autoComplete="off" required
            />
            <input type="submit" value="Submit"></input>
          </form>
          <div role="alert" aria-live="polite">
            {alertText}
          </div>
        </div>
      </div>
    );
  }
}

export default OtpBox;