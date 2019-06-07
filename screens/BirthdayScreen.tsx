import React from 'react';
import { StyleSheet, FlatList, View } from 'react-native';
import { ListItem, Text, Card, CardItem } from 'native-base'
import moment from 'moment'
import _ from 'lodash'
import firebase from '@firebase/app'
import '@firebase/auth'
import '@firebase/database'
import { Cache } from "react-native-cache";
import { AsyncStorage } from 'react-native';

import sortContacts from '../components/functions/birthdaySort.js'

// Redux stuff
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux';
import { sortBirthdaysThirtyDays } from '../actions/contactsActions'

interface Props {
  navigation: any
}
interface State {
  contacts: Array<object>,
  userId: string
}

let db = null
let shellCache = null

class BirthdayScreen extends React.Component<Props, State> {

  constructor(props) {
    super(props)
    this.state = {
      contacts: [],
      userId: ''
    }
    db = firebase.database()
  }

  static navigationOptions = {
    title: 'Upcoming Birthdays',
  }

 componentDidMount () {

    // @todo - pass in actual arguments here - the list of contacts.
    this.props.sortBirthdaysThirtyDays(null)

    const userId = firebase.auth().currentUser.uid;
    this.setState({userId})

    // init cache
    shellCache = new Cache({
      namespace: "shellCRM",
      policy: {
          maxEntries: 50000
      },
      backend: AsyncStorage
    })

    // check for cache
    shellCache.getItem( "contacts", (err, entries) => {
        if(err) return console.log('there is an error')
      if( entries && entries.length > 0 ) {
        this.sortAndUpdateContacts( entries )
      } else {
          let contacts = db.ref(`users/${userId}/contacts`)
          contacts.on('value', (snapshot) => {
            let fullContacts = []
            snapshot.forEach( (child) => {
              fullContacts.push({
                id: child.key,
                details: child.val()
              })
            })
            this.sortAndUpdateContacts( fullContacts )
          })
        }
    })
  }

  componentWillUpdate() {
  }

  // TODO: research the lifecycle methods better. ComponentDidUpdate is running before componentDidMount. That's a problem.
  componentDidUpdate( prevProps, prevState ) {
    if ( prevState !== this.state ) {
      if( shellCache && this.state.contacts.length > 0 ) {
        shellCache.setItem("contacts", this.state.contacts, function(err) {
            // key => contacts, value => this.state.contacts
            if(err) console.log('error with setting cache')
        })
      }
    }
  }

  sortAndUpdateContacts = ( fullContacts:Array<object> ) => {
    const sortedContacts = sortContacts( fullContacts )
    this.updateContacts(sortedContacts)
  }

  renderListItem(contact) {
    const { firstName, lastName, birthday } = contact.details
    return (
      <ListItem onPress={() => this.props.navigation.navigate('Profile', { contact, userId: this.state.userId } )}>
        <Text>{`${firstName} ${lastName} - ${this.getFormattedBirthday(birthday)}`}</Text>
      </ListItem>     
    )
  }

  getFormattedBirthday = (date) => {
    return moment(date).format("MMMM Do")
  }

  convertObjToArray = (obj) => {
    return _.values(obj)
  }

  updateContacts(contacts) {
    this.setState({ contacts })
  }

  noBirthdaysPrompt = () => {
    return (
      <Card>
        <CardItem>
          <Text>No birthdays coming up in the next month.</Text>
        </CardItem>
      </Card>
    )
  }

  _keyExtractor = (item, index) => item.id;

  render() {
    return (
      <View style={styles.container}>
        { this.state.contacts.length > 0 && <FlatList
          data={this.state.contacts}
          renderItem = { ({item}) => this.renderListItem(item) }
          keyExtractor={this._keyExtractor}
          /> 
        }
        { this.state.contacts.length === 0 && this.noBirthdaysPrompt() }
      </View>
    )
  }
}

// @todo - do we have all of the items from state we need?
const mapStateToProps = (state) => {
  const { contacts } = state
  const { userId } = state
  return { contacts, userId }
}

const mapDispatchToProps = dispatch => (
  bindActionCreators({
    sortBirthdaysThirtyDays
  }, dispatch)
);

export default connect(mapStateToProps, mapDispatchToProps)(BirthdayScreen)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15,
    backgroundColor: '#fff',
  },
});