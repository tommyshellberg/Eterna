import React from 'react';
import { StyleSheet, Share, View } from 'react-native';
import { Form, Card, CardItem, Text, Body, Textarea, Button } from 'native-base'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import moment from 'moment'
import { debounce } from 'lodash'
import {firebase} from '@firebase/app'
import '@firebase/auth'
import '@firebase/database'

import TextInput from '../components/fixedLabel'
import CustomDatePicker from '../components/DatePicker'

export default class ProfileScreen extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
    
      firstName: this.props.navigation.state.params.contact.details.firstName,
      lastName: this.props.navigation.state.params.contact.details.lastName,
      birthday: this.props.navigation.state.params.contact.details.birthday || new Date(),
      phone: this.props.navigation.state.params.contact.details.phone,
      email: this.props.navigation.state.params.contact.details.email,
      address: this.props.navigation.state.params.contact.details.address
      
    }
    userId = this.props.navigation.state.params.userId
    db = firebase.database();
  }

  static navigationOptions = ({navigation}) => {
    return {
      title: 'Profile',
      headerRight: (
        <View>
          <Button transparent danger onPress={ () => {
            db.ref(`users/${userId}/contacts/${navigation.state.params.contact.id}`)
            .remove()
            .then( () => alert('deleted!') )
            .catch( () => alert('failed to delete!') )
            navigation.navigate('Home')
            } }>
            <Text style={{color: "red"}}>Delete</Text>
          </Button>
        </View>
      )
    }
  }

  componentDidMount() {
  }

  handleTextUpdate = (text, prop) => {
    this.setState({[prop]: text}) 
  }

  handleStateUpdate = debounce( () => {
    db.ref(`users/${userId}/contacts/${this.props.navigation.getParam('id')}`)
    .set(this.state)
    .then( () => alert('successfully updated'))
    .catch ( (error) => alert('failed to update record!'))
  }, 1000)

  componentDidUpdate = (prevProps, prevState) => {
    if ( prevState !== this.state ) {
      this.handleStateUpdate()
    }
  }

  getFormattedBirthday = (date) => {
    return moment(date).format("MMMM Do YYYY")
  }

  handleBirthdayUpdate = ( date ) => {
    this.setState({ birthday: date.toString() })
  }

  onShare = async () => {
    try {
      const shareState = this.state
      shareState.birthday = moment(this.state.birthday).format("MMMM Do YYYY")
      const result = await Share.share({
        // TODO: Prettyify or leave as JSON to allow importing?

        message: JSON.stringify(this.state),
        title: `Contact information for ${this.state.firstName} ${this.state.lastName}`
      },
      {
        dialogTitle: `Contact information for ${this.state.firstName} ${this.state.lastName}`
      });

      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      alert(error.message);
    }
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
                autoCorrect={false}
                keyboardType="email-address"
                autoCapitalize='none'
                textContentType="emailAddress"
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
                handleTextUpdate={this.handleTextUpdate}
                autoCorrect={false}
                autoCapitalize='none'
                keyboardType="phone-pad"
                textContentType="telephoneNumber"
                />
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
        <Button full info onPress={this.onShare}>
          <Text>Share This Contact</Text>
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
