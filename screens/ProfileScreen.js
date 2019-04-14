import React from 'react';
import { ScrollView, StyleSheet, Button, AsyncStorage } from 'react-native';
import { Form, Card, CardItem, Text, Body, Textarea } from 'native-base'
import moment from 'moment'
import firebase from '@firebase/app'
import '@firebase/auth'
import '@firebase/database'

import TextInput from '../components/fixedLabel'
import CustomDatePicker from '../components/DatePicker'

export default class ProfileScreen extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      firstName: this.props.navigation.getParam('firstName'),
      lastName: this.props.navigation.getParam('lastName'),
      birthday: this.props.navigation.getParam('birthday') || new Date(),
      phone: this.props.navigation.getParam('phone'),
      email: this.props.navigation.getParam('email'),
      address: this.props.navigation.getParam('address')
    }
    this.userId = ''
    db = firebase.database();
  }

  static navigationOptions = {
    title: 'Profile',
  };

  async componentDidMount() {
    this.userId = await firebase.auth().currentUser.uid;
    console.log(this.props.key)
  }

  handleTextUpdate = (text, prop) => {
    this.setState({[prop]: text}) 
  }

  //TODO: pass the user key as prop from HomeScreen
  handleStateUpdate() {
    db.ref(`users/${this.userId}/contacts/${this.props.id}`).update(this.state)
  }

  componentDidUpdate(prevProps, prevState) {
    if ( prevState !== this.state ) {
      this.handleStateUpdate()
    }
  }

  getFormattedBirthday = (date) => {
    return moment(date).format("MMMM Do YYYY")
  }

  handleBirthdayUpdate = ( date ) => {
    this.setState({ birthday: date })
  }

  render() {
    return (
      <ScrollView style={styles.container}>
      <Form>
        <Card>
            <CardItem header>
              <Text>Name</Text>
            </CardItem>
            <CardItem>
              <Body>
                <TextInput 
                  prop="firstName"
                  label="First Name" 
                  placeholder={this.state.firstName}
                  value={this.state.firstName}
                  handleTextUpdate={this.handleTextUpdate}
                  />
              </Body>
            </CardItem>
            <CardItem>
              <Body>
                <TextInput 
                  prop="lastName"
                  label="Last Name" 
                  placeholder={this.state.lastName}
                  value={this.state.lastName}
                  handleTextUpdate={this.handleTextUpdate}
                />
              </Body>
            </CardItem>
        </Card>
        <Card>
          <CardItem header>
            <Text>Birthday</Text>
          </CardItem>
          <CardItem>
            <Body>
              <CustomDatePicker
                handleDateChange={this.handleBirthdayUpdate}
                selectedDate={this.state.birthday}
                formattedDate={this.getFormattedBirthday(this.state.birthday)}
              />
            </Body>
          </CardItem>
        </Card>
        <Card>
          <CardItem header>
            <Text>Contact Information</Text>
          </CardItem>
          <CardItem>
            <Body>
              <TextInput 
                prop="email"
                label="Email" 
                placeholder={this.state.email}
                value={this.state.email}
                handleTextUpdate={this.handleTextUpdate}
              />
            </Body>
          </CardItem>
          <CardItem>
            <Body>
              <TextInput                 
                prop="phone"
                label="Phone Number" 
                placeholder={this.state.phone}
                value={this.state.phone}
                handleTextUpdate={this.handleTextUpdate}/>
            </Body>
          </CardItem>
        </Card>
        <Card>
          <CardItem header>
            <Text>Address</Text>
          </CardItem>
          <CardItem>
            <Body>
              <Textarea 
                label="Address" 
                rowSpan={3} 
                placeholder={this.state.address}
                value={this.state.address}
                onChangeText={(text) => this.handleTextUpdate(text, 'address')}
              />
            </Body>
          </CardItem>
        </Card>
        </Form>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15,
    backgroundColor: '#fff',
  },
});
