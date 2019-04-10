import { createStackNavigator } from 'react-navigation';
import SignInScreen from '../screens/SignInScreen'

export default createStackNavigator({
    Login: {
      screen: SignInScreen,
      navigationOptions: () => ({
        title: `Login`,
        headerBackTitle: null
      }),
    },
    Reset: {
      screen: SignInScreen,
      navigationOptions: () => ({
        title: `Reset Password`,
      }),
    }
  });