import React from 'react';
import { ScrollView, StyleSheet, FlatList } from 'react-native';
import { ListItem, Text } from 'native-base'
import moment from 'moment'
import _ from 'lodash'
import firebase from '@firebase/app'
import '@firebase/auth'
import '@firebase/database'

export default class BirthdayScreen extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      contacts: []
    }
    db = firebase.database()
    now = moment()
    nextMonth = moment(now).add(1, 'M')
  }

  static navigationOptions = {
    title: 'Upcoming Birthdays',
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

  renderListItem(contact) {
    const { firstName, lastName, birthday } = contact.details
    return (
      <ListItem onPress={() => this.props.navigation.navigate('Profile', contact)}>
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
    const filteredContactsArray = contacts
    .filter( (contact) => contact.details.birthday !== undefined )
    .map(contact => { 
      contact.details.tempBirthday = moment(contact.details.birthday).year(now.year()).format()
      return contact
    })
    
    const isBetweenContacts = filteredContactsArray.filter( contact => 
      moment(contact.details.tempBirthday).isBetween(now, nextMonth)
    )
   const sortedContacts = _.orderBy(isBetweenContacts, ['tempBirthday'], ['asc'])
    this.setState({ contacts: sortedContacts })
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
    paddingTop: 15,
    backgroundColor: '#fff',
  },
});