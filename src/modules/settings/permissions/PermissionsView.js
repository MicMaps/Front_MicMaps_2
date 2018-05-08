import React, {Component} from 'react';
import Permissions from 'react-native-permissions';
import ReactNativeAndroidSettings from 'react-native-android-settings';

import {
  View,
  Switch,
  Alert,
  StyleSheet,
  AppState,
  Platform
} from 'react-native';
import PermissionsViewHeader from '../../../components/headers/permissionsViewHeader';
import PageHeader from '../../../components/custom-views/pageHeader';
import * as ViewUtils from '../../../utils/viewUtils';
import CustomSelectInput from '../../../components/custom-views/selectInput';
import {NavigationActions} from 'react-navigation';

class PermissionsView extends Component {
  static displayName = 'SettingsView';

  constructor(props) {
    super(props);
    this.state = {
      location: false,
      notification: false,
      isReady: false
    }
    this.loadPermissions = this.loadPermissions.bind(this)
    this.renderLocationSwitch = this.renderLocationSwitch.bind(this)
    this.renderNotificationSwitch = this.renderNotificationSwitch.bind(this)
    this.changeLocationPermission = this.changeLocationPermission.bind(this)
    this.changeNotificationPermission = this.changeNotificationPermission.bind(this)
    this._handleAppStateChange = this._handleAppStateChange.bind(this);
  }

  componentDidMount() {

    this.loadPermissions()
    AppState.addEventListener('change', this._handleAppStateChange);
  }

  render() {
    console.log('PERMISSIONS_PAGE_STATE', this.state);
    return (
      <View style={styles.container}>
        <PermissionsViewHeader
          onRightButtonPress={() => this.props.navigation.dispatch(NavigationActions.back())} />
        <PageHeader title={'PERMISSIONS'} />
        <CustomSelectInput
          inputValue={'Location'}
          renderRightContainer={() => this.renderLocationSwitch()} />
      </View>
    );
  }

  renderLocationSwitch() {

    const {location} = this.state;
    return (
      <View style={styles.switchContainer} >
        <Switch
          style={styles.switchButton}
          value={location}
          onValueChange={() => this.changeLocationPermission()}
          onTintColor={ViewUtils.COLOR_THEME_GREEN} />
      </View>
    );
  }

  renderNotificationSwitch() {

    const {notification} = this.state;
    return (
      <View style={styles.switchContainer} >
        <Switch
          style={styles.switchButton}
          value={notification}
          onValueChange={() => this.changeNotificationPermission()}
          onTintColor={ViewUtils.COLOR_THEME_GREEN} />
      </View>
    );
  }

  loadPermissions() {
    // Permissions.check('notification', 'always')
    //   .then(notificationPermission => {
    //     if(notificationPermission === 'authorized') {
    //       this.setState({notification: true})
    //     } else this.setState({notification: false})
    //
    //     console.log('notification permissions check response: ', notificationPermission)
    // })

    Permissions.check('location')
      .then(locationPermission => {
        if(locationPermission === 'authorized') {
          this.setState({location: true})
        } else this.setState({location: false})

        console.log('location permissions check response: ', locationPermission)
    })
  }

  changeLocationPermission() {

    const {location} = this.state;
    Alert.alert(
     'Permissions',
     `We are going to open settings screen, Please ${location ? 'disable' : 'enable'} location setting manually`,
     [
       {text: 'Cancel', onPress: () => console.log('Cancel Pressed')},
       {text: 'Ok', onPress: () => {
         console.log('Ok Pressed')
         if(Platform.OS === 'ios') Permissions.openSettings()
         else ReactNativeAndroidSettings.accessAppSettings(true);
       }},
     ],
    );
  }

  changeNotificationPermission() {

    const {notification} = this.state;
    AlertIOS.alert(
     'Permissions',
     `We are going to open settings screen, Please ${notification ? 'disable' : 'enable'} notification setting manually`,
     [
       {text: 'Cancel', onPress: () => console.log('Cancel Pressed')},
       {text: 'Ok', onPress: () => {
         console.log('Ok Pressed')
         Permissions.openSettings()
       }},
     ],
    );
  }

  _handleAppStateChange(nextState) {
    console.log('App next state: ', nextState)
    if(nextState === 'active') this.loadPermissions()
  }

}

const styles = StyleSheet.create({
  container: {
    flex:1,
    flexDirection: 'column',
    backgroundColor: '#FFF',
    paddingHorizontal: 18,
    alignItems: 'center'
  },
  switchContainer: {
    width: 100,
    height: 30,
    paddingTop: Platform.OS === 'ios' ? 0 : 5
  },
  switchButton: {
    alignSelf: 'flex-end'
  }
});

export default PermissionsView;
