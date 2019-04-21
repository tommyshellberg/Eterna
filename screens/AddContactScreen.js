import React from 'react';
import { StyleSheet, Share } from 'react-native';
import { Form, Card, CardItem, Text, Body, Textarea, Button } from 'native-base'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import moment from 'moment'
import {firebase} from '@firebase/app'
import '@firebase/auth'
import '@firebase/database'

import TextInput from '../components/fixedLabel'
import CustomDatePicker from '../components/DatePicker'

export default class AddContactScreen extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      firstName: '',
      lastName: '',
      birthday:  new Date(),
      phone: '',
      email: '',
      address: ''
    }
    this.userId = ''
    db = firebase.database();
  }

  static navigationOptions = {
    title: 'New Contact',
  };

  handleTextUpdate = (text, prop) => {
    this.setState({[prop]: text}) 
  }

  async componentWillMount() {
    this.userId = await firebase.auth().currentUser.uid
  }

  handleFormSubmit = async () => {
      // When the button is submitted, add a new record. 
      // Keep in mind the format we use, { id: id, details: this.state }

    let contactObj = this.state
    const dbRef = await db.ref(`users/${this.userId}/contacts`)
    const contactRef = await dbRef.push()
    contactRef.set(contactObj)
    .then( () => this.props.navigation.navigate('Home'))
    .catch ( (error) => alert('failed to create contact!'))
  }

  getFormattedBirthday = (date) => {
    return moment(date).format("MMMM Do YYYY")
  }

  handleBirthdayUpdate = ( date ) => {
    this.setState({ birthday: date.toString() })
  }

  render() {
    return (
      <KeyboardAwareScrollView extraScrollHeight={100} enableOnAndroid={true} keyboardShouldPersistTaps='handled'>
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
              <Body >
                <Textarea bordered 
                  style={{ width: '100%' }}
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
          <Button full info onPress={this.handleFormSubmit}>
            <Text>Create Contact</Text>
          </Button>
        </KeyboardAwareScrollView>
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
