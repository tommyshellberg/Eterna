import React from 'react';
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';

import { List, ListItem, Text } from 'native-base'
import {contacts} from '../data/contacts.json'

export default class HomeScreen extends React.Component {

  constructor(props) {
    super(props)
  }

  static navigationOptions = {
    title: 'Contacts'
  }

  renderListItem = (contact) => {
    return (
      <ListItem onPress={() => this.props.navigation.navigate('Profile', contact) } key={contact.id}>
        <Text>{`${contact.firstName} ${contact.lastName}`}</Text>
      </ListItem>
    )
  }

  render() {
    return (
      <ScrollView style={styles.container}>
        <List>
          { contacts.map( contact => this.renderListItem(contact) ) }
        </List>
      </ScrollView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  }
})
