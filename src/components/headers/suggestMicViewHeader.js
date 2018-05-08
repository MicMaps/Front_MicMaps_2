import React from 'react';
import {
  TouchableOpacity,
  Image,
  View
} from 'react-native';
import Ionicon from 'react-native-vector-icons/Ionicons';
import MicMapsLogo from '../../../images/MicMaps_LOGO-white.png';
import ProfileIconWhite from '../../../images/profilIconWhite2x.png';
import styles from './styles';

function MicMapsViewHeader({onLeftButtonPress, onRightButtonPress}) {
  return (
    <View style={[styles.header, {borderBottomWidth: 0}]}>
      <View style={styles.headerLeftButtons}>
        <TouchableOpacity
          style={styles.headerLeftButton}
          onPress={onLeftButtonPress}>
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
          <Image style={{width: 26, height: 26}} source={ProfileIconWhite} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default MicMapsViewHeader;
