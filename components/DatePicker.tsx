import React, { Component } from 'react';
import { DatePicker } from 'native-base';

interface Props {
  selectedDate: Date,
  handleDateChange: Function
  formattedDate: string
}

interface State {
  chosenDate: Date,
}

export default class CustomDatePicker extends Component<Props, State> {
  constructor(props) {
    super(props);
    this.state = { chosenDate: this.props.selectedDate || new Date() };
    this.setDate = this.setDate.bind(this);
  }
  setDate( newDate: Date ) {
    this.setState({ chosenDate: newDate });
  }

  componentDidMount() {
    console.log('selected date in datepicker:')
    console.log(this.props.selectedDate)
  }

  componentDidUpdate( prevProps: Props, prevState: State ) {
      // compare old and prev state, if date is changed, call the callback
      if ( prevState.chosenDate !== this.state.chosenDate ) {
        this.props.handleDateChange(this.state.chosenDate)
      }
  }

  render() {
    return (
          <DatePicker
            defaultDate={ this.props.selectedDate || new Date("1980-01-01T22:00:00.000Z") }
            minimumDate={ new Date("1900-01-01T22:00:00.000Z") }
            maximumDate={ new Date() }
            locale={"en"}
            timeZoneOffsetInMinutes={undefined}
            modalTransparent={false}
            animationType={"fade"}
            androidMode={"default"}
            placeHolderText={this.props.formattedDate}
            textStyle={{ color: "green" }}
            placeHolderTextStyle={{ color: "#222" }}
            onDateChange={this.setDate}
            disabled={false}
            />
    )
  }
}