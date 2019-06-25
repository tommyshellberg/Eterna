import React from 'react';
import { Platform, StatusBar, StyleSheet, View } from 'react-native';
import { AppLoading, Asset, Font, Icon } from 'expo';
import firebase from '@firebase/app'

//Redux stuff
import { Provider } from 'react-redux'
import { createStore } from 'redux'
import {contactsReducer, getDbRef } from './reducers/contactsReducer'

// React Navigation stuff
import AppNavigator from './navigation/AppNavigator';

// Import Firebase Config
import { config } from './config/'

interface State {
  isLoadingComplete: boolean
}

interface Props {}

const store = createStore(contactsReducer)

export default class App extends React.Component<Props, State> {
  state = {
    isLoadingComplete: false,
  }

  componentWillMount() {
    if(!firebase.apps.length) {
      firebase.initializeApp(config)
      getDbRef()
    }
  }

  render() {
    if (!this.state.isLoadingComplete) {
      return (
        <AppLoading
          startAsync={this._loadResourcesAsync}
          onError={this._handleLoadingError}
          onFinish={this._handleFinishLoading}
        />
      );
    } else {
      return (
        <Provider store={store}>
          <View style={styles.container}>
          {Platform.OS === 'ios' && <StatusBar barStyle="default" />}
          <AppNavigator />
          </View>
        </Provider>
      )
    }
  }

  _loadResourcesAsync = async () => {
    return Promise.all([
      Asset.loadAsync([
        require('./assets/images/sunbgimage.png')
      ]),
      Font.loadAsync({
        // This is the font that we are using for our tab bar
        ...Icon.Ionicons.font,
        'Roboto_medium': require('native-base/Fonts/Roboto_medium.ttf'),
      }),
    ]);
  };

  _handleLoadingError = error => {
    // In this case, you might want to report the error to your error
    // reporting service, for example Sentry
    console.warn(error);
  };

  _handleFinishLoading = () => {
    this.setState({ isLoadingComplete: true });
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
