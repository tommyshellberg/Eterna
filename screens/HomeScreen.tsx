import React from 'react';
import {
  StyleSheet,
  View,
  FlatList
} from 'react-native';

import _ from 'lodash'
import firebase from '@firebase/app'
import '@firebase/auth'

import { Button, Text, ListItem, Spinner, Card, CardItem } from 'native-base'

// Redux stuff
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux';
import { getContacts, setUserId, updateContacts, getDbRef, updateProfile } from '../actions/contactsActions'

interface Props {
  navigation: any
  contacts: Array<object>
  getContacts: Function,
  setUserId: Function,
  userId: string,
  getDbRef: Function,
  updateContacts: Function
  dbRef: any
}
interface State {
  loading: boolean
}

var init: boolean = true

class HomeScreen extends React.Component<Props, State> {

  constructor(props) {
    super(props)
  }

  state: State = {
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

  componentDidUpdate( prevProps, prevState ) {

    const { dbRef } = this.props
    const { userId } = this.props
    const contactsRef =  dbRef.ref(`users/${userId}/contacts`)
    const meRef = dbRef.ref(`users/${userId}/me`)

    // @todo - fix a loop of details being added.
    /*
    if( !init && prevProps.contacts !== this.props.contacts ) {
      console.log('props have updated')
      // @todo - I think I have to convert contacts[] to contacts{} to send to FB.
      // either that or rework the whole app to use contacts{}
      const { contacts } = this.props
      console.log('contacts in componentDidUpdate:')
      console.log(contacts)
      contactsRef.set(contacts)
    }
    */

    if( init && dbRef && userId ) {

      meRef.on('value', snapshot => {
        this.props.updateProfile(snapshot)
      })
      let contacts
      contactsRef.on('value', snapshot => {
        contacts = []
          snapshot.forEach( (child) => {
            console.log('within the forEach')
            console.log('child.key:')
            console.log(child.key)
            console.log('child.key:')
            console.log(child.val().details)
            contacts.push({
              id: child.key,
              details: child.val()
            })
          })
          if (init) init = false
          contacts = _.sortBy( contacts, [ (o) => o.details.firstName ] )

          this.props.updateContacts(contacts)
          this.setState({
            loading: false
          })
        })
        return
    }
  }

  componentWillMount() {

  }

  componentDidMount() {
    const userId = firebase.auth().currentUser.uid;
    this.props.setUserId(userId)
    this.props.getDbRef()

    //this.props.getContacts(userId)
    // @todo - dispatch an action to get cached contacts
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
  // @todo: maybe we can check props.userId before we make any actions(update, add, delete). if it's null go to login page.

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

  // @todo: do we bother with the pull to refresh since FB does it? Or good to have a backup force refresh?
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
          { !this.state.loading && this.props.contacts.length > 0 && 
            <FlatList 
              refreshing={this.state.loading}
              onRefresh={this.refreshData}
              data={this.props.contacts}
              renderItem = { ({item}) => this.renderListItem(item) }
              keyExtractor={this._keyExtractor}
            />
          }
          { !this.state.loading && this.props.contacts.length === 0 && this.createContactPrompt() }
        </View>
    )
  }
}

const mapStateToProps = (state) => {
  

  const contacts:Array<any> = state.contacts
  const { userId } = state
  const { dbRef } = state
  const props = { contacts, userId, dbRef }
  return props
}

const mapDispatchToProps = dispatch => (
  bindActionCreators({
    getContacts,
    setUserId,
    updateContacts,
    getDbRef,
    updateProfile
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
