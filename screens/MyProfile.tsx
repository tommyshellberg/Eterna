import React from 'react';
import { StyleSheet, Share, View } from 'react-native';
import { Form, Card, CardItem, Text, Body, Textarea, Button, Spinner } from 'native-base'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import moment from 'moment'
import {firebase} from '@firebase/app'
import '@firebase/auth'

import TextInput from '../components/fixedLabel'
import CustomDatePicker from '../components/DatePicker'

// Redux stuff
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux';
import { updateProfile, getProfileData } from '../actions/contactsActions'

interface Props {
  me: object,
  getProfileData: Function,
  updateProfile: Function,
  userId: string
}

// @todo - remove loading from internal state and load from this.props
interface State {
  firstName: string,
  lastName: string,
  birthday: any,
  phone: string,
  email: string,
  address: string,
  loading: boolean
}

class ProfileScreen extends React.Component<Props, State> {

  constructor(props) {
    super(props)
    this.state = {
      firstName: this.props.me.firstName || '',
      lastName: this.props.me.lastName || '',
      birthday:  this.props.me.birthday || new Date(),
      phone: this.props.me.phone || '',
      email: this.props.me.email || '',
      address: this.props.me.address || '',
      loading: false
    }
  }

  static navigationOptions = ({navigation}) => {
    
    return {
      title: 'My Profile',
      headerRight: (
        <View>
          <Button transparent onPress={navigation.getParam('logOut')} >
            <Text style={{color: "#333"}}>Logout</Text>
          </Button>
        </View>
      )
    }
}

logOut = () => {
  firebase.auth().signOut()
  .then ( () => {
    alert('Signed out!')
  })
  .catch( (error) => alert(error))
}

componentWillMount() {
  this.props.navigation.setParams({ logOut: this.logOut });
}

componentDidUpdate() {
}

// @todo - this should be loaded from cache initially if possible.
// We then need to figure out how to use the .on() method without needing to overwrite the data or update state unnecessarily.
// actually, we don't need the .on() method at all. we don't need to listen for changes as we control how changes are made.

  handleTextUpdate = (text, prop) => {
    this.setState({[prop]: text}) 
  }

  handleSubmit = () => {
    // @todo - pass in the proper information to updateProfile()
    const contactInfo = {
      firstName: this.state.firstName,
      lastName: this.state.lastName,
      birthday:  this.state.birthday,
      phone: this.state.phone,
      email: this.state.email,
      address: this.state.address
    }

    this.props.updateProfile( contactInfo )
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
          // @todo - change to this.props.loading
          this.state.loading && <Spinner/>
        }
        <Button style={styles.button} full onPress={this.onShare}>
          <Text style={{ color: '#fff' }} >Share My Info</Text>
        </Button>
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
                  selectedDate={ moment(this.state.birthday, "MMMM Do YYYY").toDate() }
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
          <Button style={styles.button} full onPress={this.handleSubmit}>
            <Text style={{ color: '#fff' }} >Save Profile</Text>
          </Button>
          </Form>
        </KeyboardAwareScrollView>
    );
  }
}

// @todo - we don't need all contacts here. state should just be our own data + userId
// @todo - after we clean up the state object(get rid of the extra contacts property within it) clean this up.
const mapStateToProps = (state) => {
  const {userId} = state
  const {me} = state
  const {loading} = state
  return { userId, me, loading }
}

const mapDispatchToProps = dispatch => (
  bindActionCreators({
    updateProfile,
    getProfileData
  }, dispatch)
);

export default connect(mapStateToProps, mapDispatchToProps)(ProfileScreen)

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#3F51B5'
  },
  container: {
    flex: 1,
    paddingTop: 15,
    backgroundColor: '#fff',
  },
});
