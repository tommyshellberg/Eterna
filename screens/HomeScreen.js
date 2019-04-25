import React from 'react';
import {
  StyleSheet,
  View,
  FlatList
} from 'react-native';

import _ from 'lodash'
import firebase from '@firebase/app'
import '@firebase/auth'
import '@firebase/database'

import { Button, Text, ListItem } from 'native-base'

export default class HomeScreen extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      contacts: [],
      loading: true,
      userId: ''
    }
    db = firebase.database();
  }

  static navigationOptions = ({navigation}) => {
    return {
      title: 'Contacts',
      headerRight: (
        <View>
          <Button transparent success onPress={() => navigation.navigate('AddContact')}>
            <Text style={{color: "#333"}}>Add</Text>
          </Button>
        </View>
      )
    }
  }

 async componentWillMount() {
    const userId = await firebase.auth().currentUser.uid;
    this.setState({ userId })
    this.getContacts(userId)
  }

  async getContacts(userId) {
    contacts = db.ref(`users/${userId}/contacts`)
    contacts.on('value', (snapshot) => {
      let fullContacts = []
      snapshot.forEach( (child) => {
        fullContacts.push({
          id: child.key,
          details: child.val()
        })
      })

      fullContacts = _.sortBy( fullContacts, [ (o) => o.details.firstName ] )
      this.updateContacts(fullContacts)
    })
  }

  renderListItem = (contact) => {
    return (
      <ListItem onPress={() => this.props.navigation.navigate('Profile', { contact, userId: this.state.userId } )} >
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

  _keyExtractor = (item, index) => item.id;

  render() {
    return (
      <View style={styles.container}>
        <FlatList 
          refreshing={this.state.loading}
          onRefresh={this.refreshData}
          data={this.state.contacts}
          renderItem = { ({item}) => this.renderListItem(item) }
          keyExtractor={this._keyExtractor}
        />
      </View>
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
