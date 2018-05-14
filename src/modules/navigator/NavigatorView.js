import React, {Component} from 'react';

import AppNavigator from './Navigator';
import NavigationService from '../../services/navigationService';
import PushNotification from 'react-native-push-notification-ce';

class NavigatorView extends Component {
  static displayName = 'NavigationView';

  componentDidMount() {
    PushNotification.appStart();
  }

  render() {

    return (
      <AppNavigator ref={navigatorRef => {
        NavigationService.setTopLevelNavigator(navigatorRef);
      }}/>
    );
  }
}

export default NavigatorView;
