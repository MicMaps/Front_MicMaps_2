import React, {Component} from 'react';
import {
  Text,
  View,
  Image,
  TouchableOpacity,
  Picker,
  StyleSheet,
  Platform
} from 'react-native';
import * as ViewUtils from '../../utils/viewUtils'
import IconArrowRight from '../../../images/arrowRight.png'
import IconArrowDown from '../../../images/arrowDown.png'
import IconCheck from '../../../images/iconCheck.png'

class NumberSelectInput extends Component {

  constructor(props) {
    super(props)
    this.state = {
      isExpanded: false
    }
  }

  render() {

    const {style, label, numberPickerProps, numberArray, dropDownStyle, formatValue} = this.props;
    const {isExpanded} = this.state;

    //console.log("NUMBER_PICKER_PROPS", numberPickerProps);
    numberPickerProps.selectedValue = parseInt(numberPickerProps.selectedValue);

    return (
      <View style={[styles.container, style]}>
        <TouchableOpacity style={styles.selectItemContainer}
          onPress={() => this.setState({isExpanded: !isExpanded})}>
          <View style={styles.textContainer}>
            <Text style={styles.labelText}>{label}</Text>
          </View>
          <View style={[styles.valueContainer, isExpanded ? {borderBottomColor: 'transparent'} : null]}>
            <Text style={styles.valueText}>
              {!formatValue ? numberPickerProps.selectedValue : formatValue(numberPickerProps.selectedValue)}
            </Text>
            <View style={styles.arrowIconContainer}>
              {!isExpanded ? (
                <Image style={{width: 11.5, height: 21}} source={IconArrowRight} />
              ) : (
                <Image style={{width: 21, height: 11.5}} source={IconArrowDown} />
              )}
            </View>
          </View>
        </TouchableOpacity>
        {isExpanded ? (
          <View style={[styles.selectDropdownContainer, dropDownStyle]}>
            <Picker {...numberPickerProps}
              style={[{width: Platform.OS==="ios" ? ViewUtils.WINDOW_WIDTH : ViewUtils.WINDOW_WIDTH-80, borderWidth: 1, borderColor: '#000'}, numberPickerProps.style]}>
              {/* <Picker.Item label='Select a value' value='' /> */}
              {numberArray.map((elm, idx) => {
                  return (<Picker.Item label={`${elm.label}`} value={elm.value} key={idx} />)
              })}
            </Picker>
            <TouchableOpacity style={styles.selectIconContainer}
              onPress={() => this.setState({isExpanded: !isExpanded})}>
              <Image style={{width: 20, height: 14}} source={IconCheck} />
            </TouchableOpacity>
          </View>
        ) : null}
      </View>
    )
  }

}

const styles = StyleSheet.create({
  container : {
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
    marginBottom:4
  },
  labelText: {
    fontSize: 14,
    fontFamily: ViewUtils.FONT_DOSIS_MEDIUM,
    color: ViewUtils.COLOR_THEME_GRAY,
  },
  valueContainer: {
    position: 'relative',
    width: ViewUtils.WINDOW_WIDTH - 40,
    flexDirection: 'column',
    borderColor: ViewUtils.COLOR_THEME_LIGHT_GRAY,
    borderBottomWidth: 0.5
  },
  valueText: {
    height: 30,
    fontSize: 16,
    color: ViewUtils.COLOR_THEME_BLUE,
    lineHeight: 18,
    paddingBottom: 10,
    paddingRight: 30,
    fontFamily: ViewUtils.FONT_DOSIS_MEDIUM,
    fontWeight: 'normal'
  },
  arrowIconContainer: {
    position: 'absolute',
    width: 22,
    height: Platform.OS === 'ios' ? 22 : 36,
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
