import { createAppContainer, createSwitchNavigator } from 'react-navigation';

import AuthNavigator from './AuthNavigator'
import MainTabNavigator from './MainTabNavigator';

export default createAppContainer(createSwitchNavigator(
  {
  Main: MainTabNavigator,
  Auth: AuthNavigator
  },
  {
    initialRouteName: 'Auth',
  }
));