import React from 'react';
import {
  TouchableOpacity,
  View
} from 'react-native';
import Ionicon from 'react-native-vector-icons/Ionicons';
import * as ViewUtils from '../../utils/viewUtils';
import {NavigationActions} from 'react-navigation';

import styles from './styles';

function VerifyOtpViewHeader({navigation}) {
  return (
    <View style={[styles.header, {backgroundColor: 'rgba(0,0,0,0)', borderBottomWidth: 0}]}>
      <View style={styles.headerLeftButtons}>
        <TouchableOpacity onPress={() => navigation.dispatch(NavigationActions.back())}>
          <Ionicon style={[styles.headerButtonIcon, {color: ViewUtils.COLOR_THEME_GREEN}]} name='ios-arrow-back'/>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default VerifyOtpViewHeader;
