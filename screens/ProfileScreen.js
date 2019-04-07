import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { Form, Card, CardItem, Text, Body, Textarea } from 'native-base'

import TextInput from '../components/fixedLabel'

export default class ProfileScreen extends React.Component {
  static navigationOptions = {
    title: 'Profile',
  };

  state = {
    firstName: "Thomas",
    lastName: "Shellberg",
    birthday: new Date(),
    email: "thomas@shellberg.com",
    address: "Ruhreckstrasse 39, Hagen, 58099, Germany"
  }

  getFormattedBirthday = (date) => {
    return `${date.getDate()}/${date.getMonth()}/${date.getFullYear()}`
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
                <TextInput label="First Name" placeholder={this.state.firstName}/>
              </Body>
            </CardItem>
            <CardItem>
              <Body>
                <TextInput label="Last Name" placeholder={this.state.lastName}/>
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
              <TextInput label="Email" placeholder={this.state.email}/>
            </Body>
          </CardItem>
          <CardItem>
            <Body>
              <TextInput label="Phone" placeholder={this.state.phone}/>
            </Body>
          </CardItem>
        </Card>
        <Card>
          <CardItem header>
            <Text>Address</Text>
          </CardItem>
          <CardItem>
            <Body>
              <Textarea label="Address" rowSpan={3} placeholder={this.state.address}/>
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
