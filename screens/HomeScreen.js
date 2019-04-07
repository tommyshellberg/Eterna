import React from 'react';
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';

import { List, ListItem, Text } from 'native-base'
import { MonoText } from '../components/StyledText';

export default class HomeScreen extends React.Component {
  static navigationOptions = {
    title: 'Contacts'
  };

  render() {
    return (
      <ScrollView style={styles.container}>
        <List>
          <ListItem itemDivider>
            <Text>A</Text>
          </ListItem>                    
          <ListItem>
            <Text>Aaron Bennet</Text>
          </ListItem>
          <ListItem>
            <Text>Ali Connors</Text>
          </ListItem>
          <ListItem itemDivider>
            <Text>B</Text>
          </ListItem>  
          <ListItem>
            <Text>Bradley Horowitz</Text>
          </ListItem>
          <ListItem itemDivider>
            <Text>C</Text>
          </ListItem>  
          <ListItem>
            <Text>Chuck Chuckerson</Text>
          </ListItem>
          <ListItem>
            <Text>Chula Chuckerson</Text>
          </ListItem>
          <ListItem itemDivider>
            <Text>D</Text>
          </ListItem>  
          <ListItem>
            <Text>Darrel Darrelson</Text>
          </ListItem>
          <ListItem>
            <Text>Debbie Darrelson</Text>
          </ListItem>
          <ListItem itemDivider>
            <Text>E</Text>
          </ListItem>  
          <ListItem>
            <Text>Eric Ericksson</Text>
          </ListItem>
          <ListItem itemDivider>
            <Text>F</Text>
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
    backgroundColor: '#fff',
  }
})
