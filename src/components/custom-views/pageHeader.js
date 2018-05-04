import React, {PropTypes, Component} from 'react';
import {
  Text,
  View,
  Image,
  StyleSheet
} from 'react-native';
import Ionicon from 'react-native-vector-icons/Ionicons'
import * as ViewUtils from '../../utils/viewUtils'
import MicMapsLogo from '../../../images/MicMaps_ICON.png'

function PageHeader({style, title, subtitle, blueLineFill, renderLogo}) {

  return (
    <View style={[styles.container, style]}>
      <View style={styles.contentContainer}>
        <Text style={styles.titleText}>{title}</Text>
        {subtitle ? (
          <Text style={styles.subtitleText}>{subtitle}</Text>
        ) : null}
      </View>
      <View style={styles.greenLine}></View>
      <View style={[styles.blueLine, {right: blueLineRightPosition()}]}></View>
      <View style={styles.logo}>
        {renderLogo ? renderLogo() : (
          <Image source={MicMapsLogo} style={styles.logoImage} />
        )}
      </View>
    </View>
  )

  function blueLineRightPosition() {
    fillPercentage = subtitle ? 0 : blueLineFill ? blueLineFill : 100;
    //console.log('fillPercentage', fillPercentage)
    return ViewUtils.WINDOW_WIDTH * (1 - fillPercentage/100) + (fillPercentage === 100 ? 60 : 0);
  }
}

const styles = StyleSheet.create({
  container : {
    position: 'relative',
    width: ViewUtils.WINDOW_WIDTH,
    height: 90,
  },
  contentContainer: {
    position: 'absolute',
    left: 20,
    bottom: 31,
    right: 60,
    flexDirection: 'column',
    justifyContent: 'flex-end',
  },
  greenLine: {
    position: 'absolute',
    left:0,
    bottom: 19,
    right: 60,
    height: 2,
    backgroundColor: ViewUtils.COLOR_THEME_GREEN,
    zIndex: 0
  },
  blueLine: {
    position: 'absolute',
    left:0,
    bottom: 19,
    right: 60,
    height: 2,
    backgroundColor: ViewUtils.COLOR_THEME_BLUE,
    zIndex: 0
  },
  logo: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    width: 80,
    height: 80,
    zIndex: 0
  },
  logoImage: {
    width: 80,
    height: 80
  },
  titleText: {
    fontSize: 24,
    color: ViewUtils.COLOR_THEME_BLUE,
    fontFamily: ViewUtils.FONT_DOSIS_MEDIUM
  },
  subtitleText: {
    fontSize: 15,
    paddingTop: 4,
    lineHeight: 12,
    height:20,
    color: ViewUtils.COLOR_THEME_EXTRA_LIGHT_BLUE,
    fontFamily: ViewUtils.FONT_DOSIS_MEDIUM,
    marginBottom: -3
  }
});

export default PageHeader;
