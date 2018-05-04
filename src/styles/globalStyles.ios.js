import {
    StyleSheet,
  } from 'react-native';
  import * as ViewUtils from '../utils/viewUtils';
  
  export const TextProps = {
    style: {
      fontSize: 16,
      fontFamily: ViewUtils.FONT_DOSIS_SEMI_BOLD,
      color: ViewUtils.COLOR_THEME_GRAY
    }
  }
  
  const GlobalStyles = StyleSheet.create({
  
    // ~~~~~~~~ BUTTON STYLES ~~~~~~~~~~~~~ //
    button: {
      width: ViewUtils.WINDOW_WIDTH - 40,
      height: 40,
      borderRadius: 3,
      borderWidth: 1.5,
      borderColor: ViewUtils.COLOR_THEME_BLUE,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 15
    },
  
    // Button Blue Outlined styles
    buttonBlueOutlined: {
      borderColor: ViewUtils.COLOR_THEME_BLUE
    },
    buttonBlueOutlinedDisabled: {
      borderColor: ViewUtils.COLOR_THEME_EXTRA_LIGHT_BLUE
    },
    buttonBlueOutlinedText: {
      fontSize: 18,
      color: ViewUtils.COLOR_THEME_BLUE
    },
    buttonBlueOutlinedDisabledText: {
      color: ViewUtils.COLOR_THEME_EXTRA_LIGHT_BLUE
    },
  
    // Button Green Outlined styles
    buttonGreenSolid: {
      borderColor: ViewUtils.COLOR_THEME_GREEN,
      backgroundColor: ViewUtils.COLOR_THEME_GREEN
    },
    buttonGreenSolidDisabled: {
      borderColor: ViewUtils.COLOR_THEME_LIGHT_GREEN,
      backgroundColor: ViewUtils.COLOR_THEME_LIGHT_GREEN
    },
    buttonGreenSolidText: {
      fontSize: 18,
      color: '#FFF'
    },
    buttonGreenSolidDisabledText: {
      fontSize: 18,
      color: '#FFF'
    },
  
    // Button Green Solid styles
    buttonGreenOutlined: {
      borderColor: ViewUtils.COLOR_THEME_GREEN,
    },
    buttonGreenOutlinedDisabled: {
      borderColor: ViewUtils.COLOR_THEME_LIGHT_GREEN
    },
    buttonGreenOutlinedText: {
      fontSize: 18,
      color: ViewUtils.COLOR_THEME_GREEN
    },
    buttonGreenOutlinedDisabledText: {
      color: ViewUtils.COLOR_THEME_LIGHT_GREEN
    },
  
    // Button White Outlined styles
    buttonWhiteOutlined: {
      borderColor: '#FFF'
    },
    buttonWhiteOutlinedDisabled: {
      borderColor: ViewUtils.COLOR_THEME_OFF_WHITE
    },
    buttonWhiteOutlinedText: {
      fontSize: 18,
      color: '#FFF'
    },
    buttonWhiteOutlinedDisabledText: {
      color: ViewUtils.COLOR_THEME_OFF_WHITE
    },
  
    // Button White Solid styles
    buttonWhiteSolid: {
      backgroundColor: '#FFF',
      borderColor: '#FFF'
    },
    buttonWhiteSolidDisabled: {
      backgroundColor: ViewUtils.COLOR_THEME_OFF_WHITE,
      borderColor: ViewUtils.COLOR_THEME_OFF_WHITE
    },
    buttonWhiteSolidText: {
      fontSize: 18,
      color: ViewUtils.COLOR_THEME_BLUE
    },
    buttonWhiteSolidDisabledText: {
      color: ViewUtils.COLOR_THEME_EXTRA_LIGHT_BLUE
    },
  
    // Button Transparent styles
    buttonTransparent: {
      width: ViewUtils.WINDOW_WIDTH - 40,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'transparent',
      borderColor: 'transparent'
    },
    buttonTransparentText: {
      color: ViewUtils.COLOR_THEME_GRAY,
      fontSize: 18,
      fontFamily: ViewUtils.FONT_DOSIS_MEDIUM
    },
    buttonTransparentIcon: {
      fontSize: 18,
      color: ViewUtils.COLOR_THEME_GRAY,
      paddingLeft: 8,
      paddingTop:5
    },
  
    likeDislikeButton: {
      width: ViewUtils.WINDOW_WIDTH - 47,
      height: 50,
      borderRadius: 3,
      borderWidth: 1.5,
      borderColor: ViewUtils.COLOR_THEME_BLUE,
      flexDirection: 'row',
      marginBottom: 15
    },
    likeButton: {
      flex:1,
      height: 48,
      borderRightWidth: 1.5,
      borderRightColor: ViewUtils.COLOR_THEME_BLUE,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center'
    },
    dislikeButton: {
      flex:1,
      height: 50,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center'
    },
    likeDislikeButtonContent: {
      flexDirection: 'row',
      alignItems: 'center'
    },
    likeButtonText: {
      fontSize: 16,
      color: ViewUtils.COLOR_THEME_GREEN,
    },
    dislikeButtonText: {
      fontSize: 16,
      color: ViewUtils.COLOR_THEME_RED,
    },
    thumbsIcon: {
      width: 23,
      height: 23,
      marginLeft: 8
    },
  
    // ~~~~~~~~ LIST STYLES ~~~~~~~~~~~~~ //
  
    listItemContainer: {
      height: 34,
      width: ViewUtils.WINDOW_WIDTH * 0.6 - 25,
      flexDirection: 'column',
      marginVertical: 3,
      borderBottomWidth: 1,
      borderBottomColor: ViewUtils.COLOR_THEME_BORDER
    },
    listItemContainerAutoGrow: {
      flex:1,
      width: ViewUtils.WINDOW_WIDTH * 0.6 - 25,
      flexDirection: 'column',
      marginVertical: 3,
      borderBottomWidth: 1,
      borderBottomColor: ViewUtils.COLOR_THEME_BORDER
    },
    listItemLabel: {
      color: ViewUtils.COLOR_THEME_GRAY,
      fontSize: 12
    },
    listItemContent: {
      color: ViewUtils.COLOR_THEME_BLUE,
      fontSize: 14,
      lineHeight: 14,
      marginTop: 2,
      fontWeight: '500'
    }
  });
  
  export default GlobalStyles;
  