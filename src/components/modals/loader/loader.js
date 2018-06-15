import React from 'react';
import {
  Modal,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  Platform,
  ActivityIndicator
} from 'react-native';
import EvilIcon from 'react-native-vector-icons/EvilIcons';
import * as ViewUtils from '../../../utils/viewUtils';

function Loader({visibility}) {
  console.log(visibility)
  return (
    visibility?
        <View style={styles.container}>
          <View style={styles.loaderContainer}>
            <ActivityIndicator animating={true}
              style={styles.loader}
              size={'large'}
              color={ViewUtils.COLOR_THEME_GREEN}/>
          </View>
        </View>
        :null
    );
}



const styles = StyleSheet.create({

  modal: {
    flex:1
  },
  container: {
    position: 'absolute',
    flex: 1,
    height: ViewUtils.WINDOW_HEIGHT,
    width: ViewUtils.WINDOW_WIDTH,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    backgroundColor: 'rgba(0,0,0,0.1)'
  },
  loaderContainer: {
    height: 60,
    width: 60,
    backgroundColor: '#FFF',
    borderRadius: 5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  loader: {
    flex:1,
    alignSelf: 'center',
    paddingLeft: 2,
    paddingTop: 2
  }
});

export default Loader;
