import React from 'react';
import { StyleSheet, Share } from 'react-native';
import { Form, Card, CardItem, Text, Body, Textarea, Button } from 'native-base'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

import * as yup from 'yup';
import moment from 'moment'
import {debounce} from 'lodash'
import {firebase} from '@firebase/app'
import '@firebase/auth'
import '@firebase/database'

import TextInput from '../components/fixedLabel'
import CustomDatePicker from '../components/DatePicker'

const firstNameSchema = yup.string().required().min(2).max(15)
const lastNameSchema = yup.string().required().min(2).max(15)
const emailSchema = yup.string().trim().email()
const phoneRegExp = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/
const phoneSchema = yup.string().trim().matches(phoneRegExp)
const addressSchema =  yup.string().min(10).max(100)

export default class AddContactScreen extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
        firstName: '',
        lastName: '',
        birthday:  new Date(),
        phone: '',
        email: '',
        address: '',
        showImport: false,
        importJSON: '',
        isValidfirstName: false,
        isValidlastName: false,
        isValidphone: false,
        isValidemail: false,
        isValidaddress: false,
        disableSubmit: true
    }
    this.userId = ''
    db = firebase.database();
  }

  static navigationOptions = {
    title: 'New Contact',
  };

  handleTextUpdate = (text, prop) => {
    this.setState({[prop]: text})
    this.validateField(prop, text) 
  }

  componentDidUpdate () {
      // TODO: make more performant by comparing prevState and new state.
      // TODO: put validation in here.
      const {isValidfirstName, isValidlastName, isValidphone, isValidemail, isValidaddress, disableSubmit } = this.state
      if ( disableSubmit && isValidfirstName && isValidlastName && isValidphone && isValidemail && isValidaddress) {
          this.setState({disableSubmit: false})
      }
  }

  validateField = debounce ((prop, text) => {
    console.log( [prop] + text)
      switch(prop) {
        case 'firstName':
            firstNameSchema.isValid(text)
            .then( (valid) => this.setState({ isValidfirstName: valid }))
            break
        case 'lastName':
            lastNameSchema.isValid(text)
            .then( (valid) => this.setState({ isValidlastName: valid }))
            break
        case 'address':
            addressSchema.isValid(text)
            .then( (valid) => this.setState({ isValidaddress: valid }))
            break
        case 'phone':
            phoneSchema.isValid(text)
            .then( (valid) => this.setState({ isValidphone: valid }))
            break
        case 'email':
            emailSchema.isValid(text)
            .then( (valid) => this.setState({ isValidemail: valid }))
            break
        default:
            console.log('default being called')
            break
      }
  }, 500)

  async componentWillMount() {
    this.userId = await firebase.auth().currentUser.uid
  }

  handleFormSubmit = async () => {
      // When the button is submitted, add a new record. 
      // Keep in mind the format we use, { id: id, details: this.state }
    
    const {birthday, address, phone, firstName, lastName, email} = this.state
    let contactObj = { birthday, address, phone, firstName, lastName, email}
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

  handleImport = () => {
      if ( this.state.importJSON === '' && !this.state.showImport ) {
        this.setState({ showImport: true })
      } else if ( this.state.importJSON !== '' && this.state.showImport ) {
          // replace the above if statement with a function call to validate the JSON. Use a library
        this.importJSON()
      }
  }

  importJSON = () => {
      const parsedJSON = JSON.parse(this.state.importJSON)
      parsedJSON.birthday = moment(parsedJSON).format()
      this.setState(parsedJSON)
  }

  render() {
    return (
      <KeyboardAwareScrollView extraScrollHeight={100} enableOnAndroid={true} keyboardShouldPersistTaps='handled'>
        { this.state.showImport && <Textarea
            value={this.state.importJSON}
            style={{ width: '100%' }}
            label="JSON Import" 
            rowSpan={3} 
            placeholder="Paste a JSON object here"
            onChangeText={(text) => this.handleTextUpdate(text, 'importJSON')}
        ></Textarea> }
        <Button full info onPress={this.handleImport}>
            <Text>{ this.state.showImport ? 'Import' : 'Import from JSON' }</Text>
        </Button>
        <Form>
          <Card>
              <CardItem header>
                <Text>Name</Text>
              </CardItem>
              <CardItem>
                <Body>
                  <TextInput 
                    error={!this.state.isValidfirstName}
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
                    error={!this.state.isValidlastName}
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
                  error={!this.state.isValidemail}
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
                  error={!this.state.isValidphone}             
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
                  error={!this.state.isValidaddress}
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
          <Button full info onPress={this.handleFormSubmit} disabled={this.state.disableSubmit}>
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
