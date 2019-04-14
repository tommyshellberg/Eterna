import React from 'react';
import { ScrollView, StyleSheet, FlatList } from 'react-native';
import { ListItem, Text } from 'native-base'
import moment from 'moment'
import _ from 'lodash'
import firebase from '@firebase/app'
import '@firebase/auth'
import '@firebase/database'

export default class BirthdayScreen extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      contacts: []
    }
    db = firebase.database()
  }

  static navigationOptions = {
    title: 'Birthdays',
  }

  componentWillMount() {
    const userId = firebase.auth().currentUser.uid;
    contacts = db.ref(`users/${userId}/contacts`).orderByChild('birthday')
    contacts.on('value', (snapshot) => {
      this.updateContacts(snapshot.val());
    });
  }

  componentDidUpdate() {
    console.log(this.state.contacts)
  }

  getFormattedBirthday = (date) => {
    return moment(date).format("MMMM Do YYYY")
  }

  renderListItem(contact) {
    return (
      <ListItem itemDivider>
        <Text>{`${contact.firstName} ${contact.lastName} - ${this.getFormattedBirthday(contact.birthday)}`}</Text>
      </ListItem>     
    )
  }

  updateContacts(contacts) {
    this.setState({ contacts: _.values(contacts) })
  }

  render() {
    return (
      <ScrollView style={styles.container}>
        <FlatList
          data={this.state.contacts}
          renderItem = { ({item}) => this.renderListItem(item) }
        />
      </ScrollView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15,
    backgroundColor: '#fff',
  },
});