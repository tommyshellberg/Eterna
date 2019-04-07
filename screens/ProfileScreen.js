import React from 'react';
import { ScrollView, StyleSheet, Button, AsyncStorage } from 'react-native';
import { Form, Card, CardItem, Text, Body, Textarea } from 'native-base'

import { debounce } from "lodash";
import TextInput from '../components/fixedLabel'


retrieveData = async (key) => {
  try {
    return await AsyncStorage.getItem(key);
  } catch (error) {
    // Error retrieving data
  }
};

const owner = retrieveData('@shellCRM:owner')

export default class ProfileScreen extends React.Component {
  static navigationOptions = {
    title: 'Profile',
  };

  state = {
    firstName: this.props.navigation.getParam('firstName') || owner.firstName,
    lastName: this.props.navigation.getParam('lastName') || owner.lastName,
    birthday: new Date(),
    phone: this.props.navigation.getParam('phone') || owner.phone,
    email: this.props.navigation.getParam('email') || owner.email,
    address: this.props.navigation.getParam('address') || owner.address
  }

  handleTextUpdate = (text, prop) => {
    this.setState({[prop]: text}) 
  }

  handleFormUpdate = async () => {
    try {
      await AsyncStorage.setItem('@shellCRM:owner', this.state);
    } catch (error) {
      // Error saving data
    }
  }

  componentWillUpdate() {
    console.log(this.state)
  }

  getFormattedBirthday = (date) => {
    return `${date.getDate()}/${date.getMonth()+1}/${date.getFullYear()}`
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
              <TextInput label="Birthday" placeholder={this.getFormattedBirthday(this.state.birthday)}/>
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
