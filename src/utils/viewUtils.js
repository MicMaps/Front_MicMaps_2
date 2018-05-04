import {
    StyleSheet,
    Platform,
    Dimensions
  } from 'react-native';
  
  var {
    height: deviceHeight,
    width: deviceWidth
  } = Dimensions.get('window');
  
  export const WINDOW_WIDTH = deviceWidth;
  export const WINDOW_HEIGHT = deviceHeight;
  //export const APPBAR_HEIGHT = Platform.OS === 'ios' ? 44 : 56;
  export const APPBAR_HEIGHT = 62;
  export const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? 20 : 0;
  export const TABBAR_HEIGHT = 38;
  
  // Theme Colors
  export const COLOR_THEME_GREEN = '#0FE1B3'
  export const COLOR_THEME_LIGHT_GREEN = '#99FFCC'
  export const COLOR_THEME_DARK_BLUE = '#008'
  export const COLOR_THEME_BLUE = '#1F3880'
  export const COLOR_THEME_LIGHT_BLUE = '#2F4C96'
  export const COLOR_THEME_EXTRA_LIGHT_BLUE = '#5584C9'
  export const COLOR_THEME_GRAY = '#ADADAD'
  export const COLOR_THEME_LIGHT_GRAY = '#C2C2C2'
  export const COLOR_THEME_BORDER = '#D8D8D8'
  export const COLOR_THEME_OFF_WHITE = '#E6E6E6'
  export const COLOR_THEME_RED = '#E30E1F'
  
  // Theme fonts
  export const FONT_DOSIS_REGULAR = 'Dosis-Regular'
  export const FONT_DOSIS_LIGHT = 'Dosis-Light'
  export const FONT_DOSIS_MEDIUM = 'Dosis-Medium'
  export const FONT_DOSIS_SEMI_BOLD = 'Dosis-SemiBold'
  export const FONT_DOSIS_BOLD = 'Dosis-Bold'
  
  export const THEME_DEFAULT_FONT = 'Dosis-Regular'
  export function getContentHeight(hasHeader, hasFooter) {
    let height = deviceHeight;
    if(hasHeader) deviceHeight - (APPBAR_HEIGHT + STATUSBAR_HEIGHT);
    return height;
  }
  
  export function getHeaderHeight() {
    return (APPBAR_HEIGHT + STATUSBAR_HEIGHT);
  }
  