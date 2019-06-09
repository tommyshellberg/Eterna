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
import { getContacts, setUserId, updateContacts, getDbRef } from '../actions/contactsActions'

interface Props {
  navigation: any
  contacts: object
  getContacts: Function,
  setUserId: Function,
  userId: string,
  getDbRef: Function,
  updateContacts: Function
  dbRef: any
}
interface State {
  contacts: Array<object>,
  loading: boolean
}

var init = true

class HomeScreen extends React.Component<Props, State> {

  constructor(props) {
    super(props)
  }

  state: State = {
    contacts: [],
    loading: true
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
    const { dbRef } = this.props.contacts
    const { userId } = this.props.contacts

    console.log('the userId within Home Screen are:')
    console.log(userId)
    console.log('the contacts within Home Screen are:')
    console.log(this.props.contacts.contacts)
    console.log('the loading bool within Home Screen are:')
    console.log(this.state.loading)

    if( init && dbRef && userId ) {
      const contactsRef =  dbRef.ref(`users/${userId}/contacts`)
      let contacts = []
      contactsRef.on('value', snapshot => {
          snapshot.forEach( (child) => {
            contacts.push({
              id: child.key,
              details: child.val()
            })
          })
          console.log('contacts are updating')
          if (init) init = false
          contacts = _.sortBy( contacts, [ (o) => o.details.firstName ] )
          console.log('the context of this within the nested if statement in componentDidUpdate is:')
          console.log(this)
          this.props.updateContacts(contacts)
          this.setState({
            loading: false
          })
        })
        console.log('the contacts within getContactsFromDB is: ')
        console.log(contacts)
    }
  }

  componentDidMount() {
    const userId = firebase.auth().currentUser.uid;
    this.props.setUserId(userId)
    this.props.getDbRef()
    //this.props.getContacts(userId)
    // dispatch an action to get cached contacts
  }

  renderListItem = (contact) => {
    return (
      <ListItem onPress={() => this.props.navigation.navigate('Profile', { contact, userId: this.props.userId } )} >
        <Text>{`${contact.details.firstName} ${contact.details.lastName}`}</Text>
      </ListItem>
    )
  }

  // @todo: move checkLoginStatus() higher up in the app to force them out of main screen back to auth.
  // @todo: implement caching for data.

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

  refreshData = () => {
    this.props.getContacts(this.props.userId)
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
          { !this.state.loading && this.props.contacts.contacts.length > 0 && 
            <FlatList 
              refreshing={this.state.loading}
              onRefresh={this.refreshData}
              data={this.props.contacts.contacts}
              renderItem = { ({item}) => this.renderListItem(item) }
              keyExtractor={this._keyExtractor}
            />
          }
          { !this.state.loading && this.props.contacts.contacts.length === 0 && this.createContactPrompt() }
        </View>
    )
  }
}

const mapStateToProps = (state) => {
  const { contacts } = state
  const { userId } = state
  const { dbRef } = state
  return { contacts, userId, dbRef }
}

const mapDispatchToProps = dispatch => (
  bindActionCreators({
    getContacts,
    setUserId,
    updateContacts,
    getDbRef
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
