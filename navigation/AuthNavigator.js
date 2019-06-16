import { createStackNavigator } from 'react-navigation';
import SignInScreen from '../screens/SignInScreen'
import RegisterScreen from '../screens/RegisterScreen'
import ResetScreen from '../screens/ForgotPassword'
import LoadingScreen from '../screens/Loading'

export default createStackNavigator({
    Loading: {
      screen: LoadingScreen,
    },
    Login: {
      screen: SignInScreen,
      navigationOptions: () => ({
        title: `Login`,
        headerBackTitle: null,
        headerLeft: null
      }),
    },
    Register: {
      screen: RegisterScreen,
      navigationOptions: () => ({
        title: `Register`,
      }),
    },
    Reset: {
      screen: ResetScreen,
      navigationOptions: () => ({
        title: `Reset Password`,
      }),
    }
  }, {
    initialRouteName: 'Loading'
  });