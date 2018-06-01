import React from 'react';
import {
  TouchableOpacity,
  View,
  Text,
  Image
} from 'react-native';
import Ionicon from 'react-native-vector-icons/Ionicons';
import MicMapsLogo from '../../../images/MicMaps_LOGO-white.png';
import styles from './styles';
import NavigationService from '../../services/navigationService';

function GeneralBackHeader({title}) {

  return (
    <View style={[styles.header, {borderBottomWidth: 0}]}>
      <View style={styles.headerLeftButtons}>
        <TouchableOpacity onPress={() => NavigationService.back()}>
          <Ionicon style={[styles.headerButtonIcon]} name='ios-arrow-back' />
        </TouchableOpacity>
      </View>
      <View style={styles.logoContainer}>
        {title ?
          <Text style={[styles.titleText, {fontSize: 20}]}>{title}</Text>
          : <Image style={styles.logoImage} source={MicMapsLogo} />
        }
      </View>
      <View style={styles.headerRightButtons}>
      </View>
    </View>
  );
}

export default GeneralBackHeader;