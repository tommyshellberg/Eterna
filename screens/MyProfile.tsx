import React from 'react';
import { StyleSheet, Share, View } from 'react-native';
import { Form, Card, CardItem, Text, Body, Textarea, Button, Spinner } from 'native-base'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import moment from 'moment'
import { debounce } from 'lodash'
import {firebase} from '@firebase/app'
import '@firebase/auth'
import '@firebase/database'

import TextInput from '../components/fixedLabel'
import CustomDatePicker from '../components/DatePicker'

interface Props {}

interface State {
  firstName: string,
  lastName: string,
  birthday: any,
  phone: string,
  email: string,
  address: string,
  loading: boolean
}

let db:any = null

export default class ProfileScreen extends React.Component<Props, State> {

  constructor(props) {
    super(props)
    this.userId = ''
    db = firebase.database();
  }

  state: State = {
    firstName: '',
    lastName: '',
    birthday:  new Date(),
    phone: '',
    email: '',
    address: '',
    loading: false
  }

  static navigationOptions = ({navigation}) => {
    
    return {
      title: 'My Profile',
      headerRight: (
        <View>
          <Button transparent success onPress={() => {
            firebase.auth().signOut()
              .then ( () => {
                alert('Signed out!')
              })
              .catch( (error) => alert(error))
            }}
            >
            <Text style={{color: "#333"}}>Logout</Text>
          </Button>
        </View>
      )
    }
}

  async componentWillMount() {
    this.setState({loading: true})
    this.userId = await firebase.auth().currentUser.uid;
    let me = db.ref(`users/${this.userId}/me`)
    let obj = {}
    me.on('value', (snapshot) => {
      snapshot.forEach( (child) => {
        const key = child.key
        const val = child.val()
        obj[key] = val
      })
      this.setState(obj)
    })
    this.setState({loading: false})
  }

  handleTextUpdate = (text, prop) => {
    this.setState({[prop]: text}) 
  }

  handleStateUpdate = debounce( () => {
    db.ref(`users/${this.userId}/me`)
    .set({
      firstName: this.state.firstName,
      lastName: this.state.lastName,
      birthday:  this.state.birthday,
      phone: this.state.phone,
      email: this.state.email,
      address: this.state.address
    })
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
        //

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
        { 
          this.state.loading && <Spinner/>
        }
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
          <Button info full onPress={this.onShare}>
            <Text style={{ color: '#333' }} >Share My Info</Text>
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
