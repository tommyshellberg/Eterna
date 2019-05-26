import React from 'react';
import { StyleSheet, FlatList, View } from 'react-native';
import { ListItem, Text, Card, CardItem } from 'native-base'
import moment from 'moment'
import _ from 'lodash'
import firebase from '@firebase/app'
import '@firebase/auth'
import '@firebase/database'
import sortContacts from '../components/functions/birthdaySort.js'

export default class BirthdayScreen extends React.Component {

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

  async componentWillMount() {
    const userId = await firebase.auth().currentUser.uid;
    this.setState({userId})
    contacts = db.ref(`users/${userId}/contacts`)
    contacts.on('value', (snapshot) => {
      let fullContacts = []
      snapshot.forEach( (child) => {
        fullContacts.push({
          id: child.key,
          details: child.val()
        })
      })
      const sortedContacts = sortContacts(fullContacts)
      this.updateContacts(sortedContacts)
    })
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15,
    backgroundColor: '#fff',
  },
});