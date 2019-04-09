import React, { Component } from 'react';
import { DatePicker } from 'native-base';
import moment from 'moment'

export default class CustomDatePicker extends Component {
  constructor(props) {
    super(props);
    this.state = { chosenDate: this.props.selectedDate || new Date() };
    this.setDate = this.setDate.bind(this);
  }
  setDate(newDate) {
    this.setState({ chosenDate: newDate });
  }

  componentDidUpdate( prevProps, prevState ) {
      // compare old and prev state, if date is changed, call the callback
      if ( prevState.chosenDate !== this.state.chosenDate ) {
        this.props.handleDateChange(this.state.chosenDate)
      }
  }

  render() {
    return (
          <DatePicker
            defaultDate={ this.props.chosenDate || new Date("1980-01-01T22:00:00.000Z") }
            minimumDate={ new Date("1900-01-01T22:00:00.000Z") }
            maximumDate={ new Date() }
            locale={"en"}
            timeZoneOffsetInMinutes={undefined}
            modalTransparent={false}
            animationType={"fade"}
            androidMode={"default"}
            placeHolderText={this.props.formattedDate}
            textStyle={{ color: "green" }}
            placeHolderTextStyle={{ color: "#d3d3d3" }}
            onDateChange={this.setDate}
            disabled={false}
            />
    )
  }
}