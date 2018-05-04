import React, {Component} from 'react';
import {
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
} from 'react-native';
import EvilIcon from 'react-native-vector-icons/EvilIcons';
import * as ViewUtils from '../../utils/viewUtils';

class AlertBar extends Component {

  constructor(props) {
    super(props)
    this.state = {
      visibility: false
    }
  }

  render() {

    const {message, type, position, positionOffset} = this.props;
    return message ? (
      <View style={[styles.alertBar, getBarStyle(type), getPositionStyle(position, positionOffset)]}>
        <Text style={[styles.alertText, getTextStyle(type)]}>{message}</Text>
      </View>
    ) : null
  }
}

const getPositionStyle = (position, offset) => {

  offset = offset ? offset : 0;
  switch(position) {
    case 'top':
      return {
        top: ViewUtils.getHeaderHeight() + offset
      }
    case 'bottom':
    default:
      return {
        bottom: 20 + offset
      }
  }
}

const getTextStyle = (type) => {
  switch(type) {
    case 'error':
    default:
      return styles.errorText
    case 'success':
      return styles.successText
    case 'warning':
      return styles.warningText
  }
}

const getBarStyle = (type) => {
  switch(type) {
    case 'error':
    default:
      return styles.errorBar
    case 'success':
      return styles.successBar
    case 'warning':
      return styles.warningBar
  }
}

const styles = StyleSheet.create({
  alertBar: {
    width: ViewUtils.WINDOW_WIDTH - 40,
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    paddingVertical: 8,
    marginVertical: 15,
    position: 'absolute',
    left: 20
  },
  positionBottom: {
    bottom: 20,
  },
  positionTop: {
    top: ViewUtils.getHeaderHeight() + 20
  },
  alertText: {
    fontSize: 15,
    fontFamily: ViewUtils.FONT_DOSIS_REGULAR,
    color: "#444"
  },
  errorBar: {
    backgroundColor: '#FDD'
  },
  successBar: {
    backgroundColor: '#DFD'
  },
  warningBar: {
    backgroundColor: '#FFC'
  },
  errorText: {
    color: ViewUtils.COLOR_THEME_RED
  },
  successText: {
    color: '#009060'
  },
  warningText: {
    color: '#FA0'
  }
});

export default AlertBar;
