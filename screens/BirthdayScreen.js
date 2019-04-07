import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { List, ListItem, Text } from 'native-base'

export default class BirthdayScreen extends React.Component {
  static navigationOptions = {
    title: 'Birthdays',
  };

  render() {
    /* Go ahead and delete ExpoConfigView and replace it with your
     * content, we just wanted to give you a quick view of your config */
    return (
      <ScrollView style={styles.container}>
        <List>
          <ListItem itemDivider>
            <Text>January</Text>
          </ListItem>                    
          <ListItem>
            <Text>Aaron Bennet - January 13</Text>
          </ListItem>
          <ListItem>
            <Text>Ali Connors - January 22</Text>
          </ListItem>
          <ListItem itemDivider>
            <Text>February</Text>
          </ListItem>  
          <ListItem>
            <Text>Bradley Horowitz - February 15</Text>
          </ListItem>
          <ListItem itemDivider>
            <Text>March</Text>
          </ListItem>  
          <ListItem>
            <Text>Chuck Chuckerson - March 3</Text>
          </ListItem>
          <ListItem>
            <Text>Chula Chuckerson - March 7</Text>
          </ListItem>
          <ListItem itemDivider>
            <Text>April</Text>
          </ListItem>  
          <ListItem>
            <Text>Darrel Darrelson</Text>
          </ListItem>
          <ListItem>
            <Text>Debbie Darrelson</Text>
          </ListItem>
          <ListItem itemDivider>
            <Text>May</Text>
          </ListItem>  
          <ListItem>
            <Text>Eric Ericksson</Text>
          </ListItem>
          <ListItem itemDivider>
            <Text>June</Text>
          </ListItem>  
          <ListItem>
            <Text>Frank Franksson</Text>
          </ListItem>
        </List>
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