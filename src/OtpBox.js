import React from "react";
import "./OtpBox.css";

class OtpBox extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      otpValue: null
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    //this.textInput = React.createRef();
    // this.focusTextInput = this.focusTextInput.bind(this);
  }

  handleChange(event) {
    this.setState({ otpValue: event.target.value });
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

  render() {
    return (

      <div>
        <h1>FlixRemote</h1>
        <div>
          <form onSubmit={this.handleSubmit}>
            <label htmlFor="inputOtp">Please Enter OTP</label>
            <input type="text" pattern="[0-9]{6}" id="inputOtp"
              onChange={this.handleChange}
              /*placeholder="Please enter passcode"*/
              autoComplete="off"
            />
            <input type="submit" value="Submit"></input>
          </form>
        </div>
      </div>
    );
  }
}

export default OtpBox;