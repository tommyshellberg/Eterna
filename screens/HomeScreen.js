import React from 'react';
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';

import _ from 'lodash'
import firebase from '@firebase/app'
import '@firebase/auth'
import '@firebase/database'

import { FlatList } from 'react-native'
import { ListItem, Text } from 'native-base'

export default class HomeScreen extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      contacts: []
    }
    db = firebase.database();
  }

  static navigationOptions = {
    title: 'Contacts'
  }

  componentWillMount() {
    const userId = firebase.auth().currentUser.uid;
    contacts = db.ref(`users/${userId}/contacts`)
    contacts.on('value', (snapshot) => {
      this.updateContacts(snapshot.val());
    });
  }

  // TODO: Make sure the list can be refreshed by swiping up

  renderListItem = (contact) => {
    return (
      <ListItem onPress={() => this.props.navigation.navigate('Profile', contact) } key={contact.id}>
        <Text>{`${contact.firstName} ${contact.lastName}`}</Text>
      </ListItem>
    )
  }

  checkLoginStatus() {
    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        return user
        // ...
      } else {
        return null
      }
    });
  }

  updateContacts(contacts) {
    this.setState({ contacts: _.values(contacts) })
  }

  componentDidUpdate() {
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
    backgroundColor: '#fff',
  }
})
