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
import { getContacts, setUserId, updateContacts, getDbRef, updateProfile, getProfileData, sortBirthdaysThirtyDays } from '../actions/contactsActions'

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
  me: object,
  sortBirthdaysThirtyDays: Function
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

    if( init && dbRef && userId ) {

      let contacts
      contactsRef.on('value', snapshot => {
        contacts = []
          snapshot.forEach( (child) => {
            contacts.push({
              ...child.val(),
              id: child.key
            })
          })
          if (init) init = false
          contacts = _.sortBy( contacts, [ (o) => o.firstName ] )
          this.props.updateContacts(contacts)
          this.props.sortBirthdaysThirtyDays(contacts)
          this.setState({
            loading: false
          })
        })
        return
    }
    if( !init && this.props.me !== prevProps.me ) {
      const me = this.props.me
      meRef.set(me)
    }
  }

  componentDidMount() {
    const userId = firebase.auth().currentUser.uid;
    this.props.setUserId(userId)
    this.props.getDbRef()
    this.props.getProfileData(userId)
  }

  renderListItem = (contact) => {
    return (
      <ListItem onPress={() => this.props.navigation.navigate('Profile', { contact, userId: this.props.userId } )} >
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
    // write a test for this.
    const contacts = this.props.contacts
    this.props.sortBirthdaysThirtyDays(contacts)
    const contactsRef =  this.props.dbRef.ref(`users/${this.props.userId}/contacts`)
    contactsRef.set(contacts)
    .then(() => alert('success!'))
    .catch(err => alert('error!'))
  }

  _keyExtractor = (item, index) => {
    return item.id.toString()
  };

  render() {
    return (
        <View style={styles.container}>
        { this.props.contacts.length > 0 && 
          <Button style={styles.button} full onPress={this.syncContacts}>
          <Text style={{color:'#fff' }}>Sync Contacts</Text>
          </Button>
        }
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
    getProfileData,
    sortBirthdaysThirtyDays
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
