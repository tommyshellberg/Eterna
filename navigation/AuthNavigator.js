import { createStackNavigator } from 'react-navigation';
import SignInScreen from '../screens/SignInScreen'
import RegisterScreen from '../screens/RegisterScreen'

export default createStackNavigator({
    Login: {
      screen: SignInScreen,
      navigationOptions: () => ({
        title: `Login`,
        headerBackTitle: null
      }),
    },
    Register: {
      screen: RegisterScreen,
      navigationOptions: () => ({
        title: `Register`,
      }),
    }
  });