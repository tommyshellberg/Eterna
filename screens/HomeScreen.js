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
    this.getContacts()
  }

  async getContacts() {
    console.log('calling getContacts')
    const userId = await firebase.auth().currentUser.uid;
    contacts = db.ref(`users/${userId}/contacts`)
    contacts.once('value', (snapshot) => {
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

  renderListItem = (contact) => {
    return (
      <ListItem onPress={() => this.props.navigation.navigate('Profile', contact)}>
        <Text>{`${contact.details.firstName} ${contact.details.lastName}`}</Text>
      </ListItem>
    )
  }

  // TODO: move checkLoginStatus() higher up in the app to force them out of main screen back to auth.
  // TODO: implement caching for data.

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

  refreshData = () => {
    this.getContacts()
  }

  render() {
    return (
      <ScrollView style={styles.container}>
        { this.state.loading && <Spinner color='blue' style={styles.spinner}/>}
        <FlatList 
          refreshing={this.state.loading}
          onRefresh={this.refreshData}
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
