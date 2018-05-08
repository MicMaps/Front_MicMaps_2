import React from 'react';
import {
  TouchableOpacity,
  Image,
  View
} from 'react-native';
import Ionicon from 'react-native-vector-icons/Ionicons';
import MicMapsLogo from '../../../images/MicMaps_LOGO-white.png';
import SettingsIcon from '../../../images/settingsIcon2x.png';
import {NavigationActions} from 'react-navigation';
import styles from './styles';

function PermissionsViewHeader({onRightButtonPress, navigation}) {

  return (
    <View style={[styles.header, {borderBottomWidth:0}]}>
      <View style={styles.headerLeftButtons}>
        <TouchableOpacity
          style={styles.headerLeftButton}
          onPress={() => navigation.dispatch(NavigationActions.back())}>
          <Ionicon style={styles.headerButtonIcon} name='ios-arrow-back'/>
        </TouchableOpacity>
      </View>
      <View style={styles.logoContainer}>
        <Image style={styles.logoImage} source={MicMapsLogo} />
      </View>
      <View style={styles.headerRightButtons}>
        <TouchableOpacity
          style={styles.headerRightButton}
          onPress={onRightButtonPress}>
          {/* <Ionicon style={styles.headerButtonIcon} name='ios-cog'/> */}
          <Image style={{width: 24, height: 26}} source={SettingsIcon} />
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default PermissionsViewHeader;
