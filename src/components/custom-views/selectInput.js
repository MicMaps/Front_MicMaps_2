import React, {Component} from 'react';
import {
  Text,
  View,
  Image,
  TouchableOpacity,
  StyleSheet
} from 'react-native';
import * as ViewUtils from '../../utils/viewUtils';
import IconArrowRight from '../../../images/arrowRight.png';
class NumberSelectInput extends Component {

  constructor(props) {
    super(props)
    this.state = {
    }
  }

  render() {

    const {style, label, inputValue, textProps, onSelectInput, renderRightContainer} = this.props;

    return (
      <View style={[styles.container, style]}>
        <TouchableOpacity style={styles.selectItemContainer}
          onPress={() => onSelectInput ? onSelectInput() : null}>
          <View style={styles.textContainer}>
            <Text style={styles.labelText}>{label}</Text>
          </View>
          <View style={styles.valueContainer}>
            <Text style={styles.valueText} {...textProps}>{inputValue}</Text>
            {renderRightContainer ? (
              <View style={styles.customRightContainer}>
                {renderRightContainer()}
              </View>
            ) : (
              <View style={styles.arrowIconContainer}>
                <Image style={{width: 11.5, height: 21}} source={IconArrowRight} />
              </View>
            )}
          </View>
        </TouchableOpacity>
      </View>
    )
  }

}

const styles = StyleSheet.create({
  container: {
    width: ViewUtils.WINDOW_WIDTH,
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: 15
  },
  selectItemContainer: {
    position: 'relative',
    width: ViewUtils.WINDOW_WIDTH - 40,
    flexDirection: 'column'
  },
  selectDropdownContainer: {
    position: 'relative',
    width: ViewUtils.WINDOW_WIDTH,
    height: 190,
    backgroundColor: '#F7F4F4',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden'
  },
  textContainer: {
    marginBottom: 4
  },
  labelText: {
    fontSize: 14,
    fontFamily: ViewUtils.FONT_DOSIS_MEDIUM,
    color: ViewUtils.COLOR_THEME_GRAY
  },
  valueContainer: {
    position: 'relative',
    width: ViewUtils.WINDOW_WIDTH - 40,
    flexDirection: 'column',
    borderColor: ViewUtils.COLOR_THEME_LIGHT_GRAY,
    borderBottomWidth: 0.5
  },
  valueText: {
    minHeight: 30,
    fontSize: 16,
    color: ViewUtils.COLOR_THEME_BLUE,
    lineHeight: 18,
    paddingBottom: 14,
    paddingRight: 30,
    fontFamily: ViewUtils.FONT_DOSIS_MEDIUM,
    fontWeight: 'normal'
  },
  arrowIconContainer: {
    position: 'absolute',
    width: 22,
    height: 36,
    right: 0,
    top: -7,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  customRightContainer: {
    position: 'absolute',
    right: 0,
    top: -7,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  selectIconContainer: {
    position: 'absolute',
    top: 0,
    right: 20,
    width: 30,
    height: 30,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9
  }
});

export default NumberSelectInput;
