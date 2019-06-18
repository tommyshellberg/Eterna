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
import { getContacts, setUserId, updateContacts, getDbRef, updateProfile, getProfileData } from '../actions/contactsActions'

interface Props {
  navigation: any
  contacts: Array<object>
  getContacts: Function,
  setUserId: Function,
  userId: string,
  getDbRef: Function,
  updateContacts: Function
  dbRef: any,
  getProfileData: Function,
  me: object
}
interface State {
  loading: boolean,
  canSync: boolean
}

var init: boolean = true

class HomeScreen extends React.Component<Props, State> {

  constructor(props) {
    super(props)
  }

  state: State = {
    loading: true,
    canSync: false
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

    // @todo - we also need to think about the key provided to firebase(child.key like below).
    // I don't think we can let firebase choose it if we send a whole object. gotta use our own.
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

      let contacts
      contactsRef.on('value', snapshot => {
        contacts = []
        console.log('this is the snapshot')
        console.log(snapshot)
          snapshot.forEach( (child) => {
            console.log('this is an individual child')
            console.log(child)
            console.log('this is an individual childs address')
            console.log(child.val().address)
            // @todo - do we just use the key here like normal(loaded from FB)? Or use our own special key(index)?
            contacts.push({
              ...child.val(),
              id: child.key
            })
          })
          if (init) init = false
          contacts = _.sortBy( contacts, [ (o) => o.firstName ] )
          console.log('these are the contacts')
          console.log(contacts)
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
    this.props.getProfileData(userId)


    //this.props.getContacts(userId)
    // @todo - dispatch an action to get cached contacts
  }

  renderListItem = (contact) => {
    return (
      <ListItem onPress={() => this.props.navigation.navigate('Profile', { contact, userId: this.props.userId } )} >
        <Text>{`${contact.firstName} ${contact.lastName}`}</Text>
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

  syncContacts = () => {
    // @todo - convert this.props.contacts to a new object tree which is ready to be saved to firebase using contactsRef.set
    // @todo - perhaps dump the snapshot from the .on() method to see what it looks like.
    // write a test for this.
    console.log('calling syncContacts')
    const contacts = this.props.contacts
    console.log('converting contacts to object')
    console.log(_.keyBy(contacts, 'id'))

    const contactsRef =  this.props.dbRef.ref(`users/${this.props.userId}/contacts`)
    contactsRef.set(contacts)
    .then(() => alert('success!'))
    .catch(err => alert('error!'))
  }


  _keyExtractor = (item, index) => {
    // @todo - the home page items loaded from FB have a different structure than items created from AddNewContact.
    // @todo - item.id refers here to the key generated by FB. We should probably use our generated ID? Or the random ID from FB?
    // @todo if the latter it means we need to bring in our props properly.
    return item.id.toString()
  };

  render() {
    console.log('render() being fired')
    return (
        <View style={styles.container}>
          <Button style={styles.button} full onPress={this.syncContacts} disabled={this.state.canSync}>
            <Text style={{color:'#fff' }}>Sync Contacts</Text>
          </Button>
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
  const { me } = state
  const props = { contacts, userId, dbRef, me }
  return props
}

const mapDispatchToProps = dispatch => (
  bindActionCreators({
    getContacts,
    setUserId,
    updateContacts,
    getDbRef,
    updateProfile,
    getProfileData
  }, dispatch)
);

export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen)

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#3F51B5"
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
