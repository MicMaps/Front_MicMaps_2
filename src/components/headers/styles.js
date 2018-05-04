import {
    StyleSheet,
  } from 'react-native';
  import * as ViewUtils from '../../utils/viewUtils'
  
  const styles = StyleSheet.create({
    header: {
      backgroundColor: ViewUtils.COLOR_THEME_GREEN,
      flexDirection: 'row',
      paddingTop: ViewUtils.STATUSBAR_HEIGHT,
      height: ViewUtils.APPBAR_HEIGHT + ViewUtils.STATUSBAR_HEIGHT,
      width: ViewUtils.WINDOW_WIDTH,
      paddingLeft: 12,
      paddingRight: 12,
      borderBottomColor: '#DDD',
      borderBottomWidth: 1,
      alignItems: 'center'
    },
    headerLeftButtons: {
      width: 50,
      justifyContent:'flex-start',
    },
    headerLeftButton: {
      alignSelf: 'flex-start'
    },
    headerRightButton: {
      alignSelf: 'flex-end',
      flexDirection: 'row',
      justifyContent: 'flex-end',
      alignItems: 'center'
    },
    headerRightButtons: {
      width: 50,
      paddingLeft: 15,
      justifyContent:'flex-end',
    },
    titleContainer: {
      flex:1,
      flexDirection:'row',
      justifyContent: 'center'
    },
    titleText: {
      color: '#FFF',
      fontSize: 14,
      fontFamily: ViewUtils.THEME_DEFAULT_FONT
    },
    logoContainer: {
      flex:1,
      flexDirection:'row',
      alignItems: 'center',
      justifyContent: 'center'
    },
    logoImage: {
      height: 39,
      width: 120
    },
    headerButtonText: {
      color: '#FFF',
      fontSize: 18,
      padding: 5,
      fontFamily: ViewUtils.FONT_DOSIS_SEMI_BOLD
    },
    headerButtonIcon: {
      width: 32,
      fontSize: 30,
      color: '#FFF',
      textAlign: 'center'
    },
    headerButtonImage: {
      margin: 4,
      padding: 4,
      width: 24,
      height: 24,
      resizeMode: 'contain',
      justifyContent: 'center',
    }
  });
  
  export default styles;
  