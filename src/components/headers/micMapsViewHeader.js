import React from 'react';
import {
  TouchableOpacity,
  Text,
  Image,
  View
} from 'react-native';
import Ionicon from 'react-native-vector-icons/Ionicons';
import MicMapsLogo from '../../../images/MicMaps_LOGO-white.png';
import ProfileIconWhite from '../../../images/profilIconWhite2x.png';
import ProfileIconBlue from '../../../images/profilIconBlue2x.png';
import * as ViewUtils from '../../utils/viewUtils';
import styles from './styles';
import {NavigationActions} from 'react-navigation';

function MicMapsViewHeader({viewMode, navigation, onLeftButtonPress, onRightButtonPress, isChildPage = false,
  leftButtonSelect = false, rightButtonSelected = false}) {

  return (
    <View style={[styles.header, {borderBottomWidth:0}]}>
      <View style={styles.headerLeftButtons}>
        <TouchableOpacity
          style={styles.headerLeftButton}
          onPress={isChildPage ? () => navigation.dispatch(NavigationActions.back()) : onLeftButtonPress}>
          {isChildPage ? (
            <Ionicon style={styles.headerButtonIcon} name='ios-arrow-back'/>
          ) : (
            <Text style={[styles.headerButtonText, leftButtonSelect ? {color: ViewUtils.COLOR_THEME_BLUE} : null]}>
              {viewMode === 'map' ? 'Map' : 'List'}
            </Text>
          )}
        </TouchableOpacity>
      </View>
      <View style={styles.logoContainer}>
        <Image style={styles.logoImage} source={MicMapsLogo} />
      </View>
      <View style={styles.headerRightButtons}>
        <TouchableOpacity
          style={styles.headerRightButton}
          onPress={onRightButtonPress}>
          {/* <Ionicon style={styles.headerButtonIcon} name='ios-contact-outline'/> */}
          {rightButtonSelected ? (
            <Image style={{width: 26, height: 26}} source={ProfileIconBlue} />
          ) : (
            <Image style={{width: 26, height: 26}} source={ProfileIconWhite} />
          )}
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default MicMapsViewHeader;
