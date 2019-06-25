import React from 'react';
import { StyleSheet, FlatList, View } from 'react-native';
import { ListItem, Text, Card, CardItem } from 'native-base'
import moment from 'moment'
// Redux stuff
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux';
import { sortBirthdaysThirtyDays } from '../actions/contactsActions'

interface Props {
  navigation: any,
  sortBirthdaysThirtyDays: Function,
  upcomingBirthdays: Array<object>
  contacts: Array<object>
}
interface State {
}

class BirthdayScreen extends React.Component<Props, State> {
  
  static navigationOptions = ({navigation}) => ({
    title: 'Upcoming Birthdays'
  })

  renderListItem = (contact) => {
    const { firstName, lastName, birthday } = contact
    return (
      // @todo - just send contact or object with contact? { contact }?
      <ListItem onPress={() =>this.props.navigation.navigate('Profile', { contact } )}>
        <Text>{`${firstName} ${lastName} - ${this.getFormattedBirthday(birthday)}`}</Text>
      </ListItem>     
    )
  }

  getFormattedBirthday = (date) => {
    return moment(date).format("MMMM Do")
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
        {this.props.upcomingBirthdays.length > 0 && <FlatList
          data={this.props.upcomingBirthdays}
          renderItem = { ({item}) =>this.renderListItem(item) }
          keyExtractor={this._keyExtractor}
          /> 
        }
        {this.props.upcomingBirthdays.length === 0 && this.noBirthdaysPrompt() }
      </View>
    )
  }
}

// @todo - do we have all of the items from state we need?
const mapStateToProps = (state) => {
  const { contacts } = state
  const { upcomingBirthdays } = state
  return { contacts, upcomingBirthdays }
}

const mapDispatchToProps = dispatch => (
  bindActionCreators({
    sortBirthdaysThirtyDays
  }, dispatch)
);

export default connect(mapStateToProps, mapDispatchToProps)(BirthdayScreen)

BirthdayScreen.defaultProps = {
  upcomingBirthdays: [],
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15,
    backgroundColor: '#fff',
  },
});