import React, {Component} from 'react';

import NavigationService from '../../services/navigationService';
import AppNavigator from './Navigator';

class NavigatorView extends Component {
  static displayName = 'NavigationView';

  render() {
    return (
      <AppNavigator ref={navigatorRef => {
        NavigationService.setTopLevelNavigator(navigatorRef);
      }} />
    );
  }
}

export default NavigatorView;
