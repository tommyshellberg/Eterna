import React from 'react';
import { Platform, StatusBar, StyleSheet, View } from 'react-native';
import { AppLoading, Asset, Font, Icon } from 'expo';
import firebase from '@firebase/app'

//Redux stuff
import { Provider } from 'react-redux'
import { createStore } from 'redux'
import contactsReducer from './reducers/contactsReducer'

// React Navigation stuff
import AppNavigator from './navigation/AppNavigator';

interface State {
  isLoadingComplete: boolean
}

interface Props {}

const store = createStore(contactsReducer)

export default class App extends React.Component<Props, State> {
  state = {
    isLoadingComplete: false,
  }

  async componentWillMount() {
    const config = {
      apiKey: "AIzaSyBfPgnFti35J4GQDUTU_Yf9_wSM9-d-lQs",
      authDomain: "shellcrm-48104.firebaseapp.com",
      databaseURL: "https://shellcrm-48104.firebaseio.com",
      projectId: "shellcrm-48104",
      storageBucket: "shellcrm-48104.appspot.com",
      messagingSenderId: "812296684473"
    }
    if(!firebase.apps.length) {
      await firebase.initializeApp(config);
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

      );
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
        // We include SpaceMono because we use it in HomeScreen.js. Feel free
        // to remove this if you are not using it in your app
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
