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

import { Button, Text, ListItem, Spinner, Card, CardItem } from 'native-base'

// Redux stuff
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux';
import { getCachedContacts, setUserId } from '../actions/contactsActions'

interface Props {
  navigation: any
  contacts: object
  getCachedContacts: Function
}
interface State {
  contacts: Array<object>,
  loading: boolean,
  userId: string
}

class HomeScreen extends React.Component<Props, State> {

  constructor(props) {
    super(props)

    db = firebase.database();
  }

  state: State = {
    contacts: [],
    loading: true,
    userId: ''
  }

  static navigationOptions = ({navigation}) => {
    return {
      title: 'Contacts',
      headerRight: (
        <View>
          <Button transparent onPress={() => navigation.navigate('AddContact')}>
            <Text style={{color: "#333"}}>Add</Text>
          </Button>
        </View>
      )
    }
  }

  componentDidUpdate() {
    console.log('contacts are: ')
    console.log(this.props.contacts.contacts)
  }

  componentDidMount() {
    this.props.getCachedContacts()
    const userId = firebase.auth().currentUser.uid;
    this.props.setUserId(userId)
    //this.getContacts(this.props.contacts.userId)
    // dispatch an action to get cached contacts
  }

  async getContacts(userId) {
    const contacts = db.ref(`users/${userId}/contacts`)
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
    this.getContacts(this.state.userId)
  }

  createContactPrompt = () => {
    return (
      <Card>
        <CardItem>
          <Text>No contacts found! Why not create one?</Text>
        </CardItem>
      </Card>
    )
  }


  _keyExtractor = (item, index) => item.id;

  render() {
    return (
        <View style={styles.container}>
          { this.state.loading && <Spinner/> }
          { !this.state.loading && this.state.contacts.length > 0 && 
            <FlatList 
              refreshing={this.state.loading}
              onRefresh={this.refreshData}
              data={this.state.contacts}
              renderItem = { ({item}) => this.renderListItem(item) }
              keyExtractor={this._keyExtractor}
            />
          }
          { !this.state.loading && this.state.contacts.length === 0 && this.createContactPrompt() }
        </View>
    )
  }
}

const mapStateToProps = (state) => {
  const { contacts } = state
  const { userId } = state
  return { contacts, userId }
}

const mapDispatchToProps = dispatch => (
  bindActionCreators({
    getCachedContacts,
    setUserId
  }, dispatch)
);

export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen)

const styles = StyleSheet.create({
  button: {
    backgroundColor: "transparent"
  },
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
