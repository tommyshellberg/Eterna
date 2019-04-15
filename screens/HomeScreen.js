import React from 'react';
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';

import { Spinner } from 'native-base'

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
      contacts: [],
      loading: true
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
      let fullContacts = []
      snapshot.forEach( (child) => {
        fullContacts.push({
          id: child.key,
          details: child.val()
        })
      })
      this.updateContacts(fullContacts)
    })
  }

  // TODO: Make sure the list can be refreshed by swiping up
  // TODO: grab the key in the db for each contact and send it as a prop to the Profile page.

  renderListItem = (contact) => {
    return (
      <ListItem onPress={() => this.props.navigation.navigate('Profile', contact)}>
        <Text>{`${contact.details.firstName} ${contact.details.lastName}`}</Text>
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
    this.setState({ 
      contacts,
      loading: false
     })
  }

  componentDidUpdate() {
  }

  render() {
    return (
      <ScrollView style={styles.container}>
        { this.state.loading && <Spinner color='blue' style={styles.spinner}/>}
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
  },
  spinner: {
    justifyContent: 'center',
    flexDirection: 'column',
    alignSelf: 'center'
  }
})
