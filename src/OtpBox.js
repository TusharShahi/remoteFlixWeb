import React from "react";


 class OtpBox extends React.Component {
  constructor(props){
    super(props);
    this.state = {
        otpValue : null
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  
  }

  handleChange(event){
    this.setState({otpValue: event.target.value});
  }

  handleSubmit(event) {
    event.preventDefault();
    this.props.submitMethod(this.state.otpValue);
   
  }

  render() {
    return (
      <div>
          <form onSubmit = {this.handleSubmit}>
                <input type="text" pattern="[0-9]{6}"
                        onChange={this.handleChange} />
                <input type="submit" value="Submit"></input>
          </form>
      </div>
    );
  }
}

export default OtpBox;