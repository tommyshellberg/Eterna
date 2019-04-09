import React from 'react';
import { ScrollView, StyleSheet, Button, AsyncStorage } from 'react-native';
import { Form, Card, CardItem, Text, Body, Textarea } from 'native-base'

import moment from 'moment'
import TextInput from '../components/fixedLabel'
import CustomDatePicker from '../components/DatePicker'

export default class MyProfile extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      firstName: 'John',
      lastName: 'Doe',
      birthday: new moment(),
      phone: '(480)555-5555',
      email: 'test@gmail.com',
      address: '123 Main St, San Francisco, California, 90215'
    }
  }

  static navigationOptions = {
    title: 'My Profile',
  }

  async componentDidMount() {
    try {
      state = await AsyncStorage.getItem('@shellCRM:owner') 
      this.setState( JSON.parse(state))
    }
    catch(error) {
      alert("error getting profile: ", error)
    }
  }

  componentDidUpdate() {
    console.log(this.state)
  }

  handleTextUpdate = (text, prop) => {
    this.setState({[prop]: text}) 
  }

  handleFormUpdate = async () => {
    try {
      await AsyncStorage.setItem('@shellCRM:owner', JSON.stringify(this.state));
      alert("Profile updated!")
    } catch (error) {
      alert('Error saving data: ', error)
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
          <Button onPress={this.handleFormUpdate}
                  title="Update" />
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
