import React from 'react';
import {
  TouchableOpacity,
  Text,
  Image,
  View
} from 'react-native';
import MicMapsLogo from '../../../images/MicMaps_LOGO-white.png'
// import ProfileIconWhite from '../../../images/profilIconWhite2x.png'
// import ProfileIconBlue from '../../../images/profilIconBlue2x.png'
import SettingsIcon from '../../../images/settingsIcon2x.png';
import styles from './styles';

function ProfileViewHeader({viewMode, onLeftButtonPress, onRightButtonPress}) {

  return (
    <View style={[styles.header, {borderBottomWidth:0}]}>
      <View style={styles.headerLeftButtons}>
        <TouchableOpacity
          style={styles.headerLeftButton}
          onPress={onLeftButtonPress}>
          <Text style={styles.headerButtonText}>
            {viewMode === 'map' ? 'Map' : 'List'}
          </Text>
        </TouchableOpacity>
      </View>
      <View style={styles.logoContainer}>
        <Image style={styles.logoImage} source={MicMapsLogo} />
      </View>
      <View style={styles.headerRightButtons}>
        <TouchableOpacity
          style={styles.headerRightButton}
          onPress={onRightButtonPress}>
          <Image style={{width: 24, height: 26}} source={SettingsIcon} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default ProfileViewHeader;
