import React, {Component} from 'react';
import {
  Text,
  View,
  Image,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Platform
} from 'react-native';
import * as ViewUtils from '../../utils/viewUtils';
import IconArrowRight from '../../../images/arrowRight.png';
import IconArrowDown from '../../../images/arrowDown.png';
import IconCheckWhite from '../../../images/iconCheckWhite.png';
import IconOption from '../../../images/iconOption.png';
import IconOptionSelected from '../../../images/iconOptionSelected.png';

class OptionSelectInput extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isExpanded: false,
      inputs: {}
    };

    //this.onChangeOptionInput  = this.onChangeOptionInput.bind(this);
  }

  render() {

    const {style, label, options, selectedOption, onSelectOption, onChangeOptionInputs, dropDownStyle, formatValue, optionInputs} = this.props;
    const {isExpanded} = this.state;
    //console.log("OPTIONS_INPUT_PROPS", this.props);
    //console.log("OPTIONS_INPUT_STATE", this.state);

    return (
      <View style={[styles.container, style]}>
        <TouchableOpacity style={styles.selectItemContainer}
          onPress={() => this.setState({isExpanded: !isExpanded})}>
          <View style={styles.textContainer}>
            <Text style={styles.labelText}>{label}</Text>
          </View>
          <View style={[styles.valueContainer, isExpanded ? {borderBottomColor: 'transparent'} : null]}>
            <Text style={styles.valueText} numberOfLines={1} ellipsizeMode={'tail'}>
              {!formatValue ? selectedOption : formatValue(selectedOption)}
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
            <View style={styles.optionsContainer}>
              {options && options.map((option, idx) => {

                let isInputAndSelected = option.type === 'input' && selectedOption === option.key;
                return (
                  <TouchableOpacity
                    key={idx}
                    style={[styles.optionRow, isInputAndSelected ? styles.optionTextInputRow: null]}
                    onPress={() => onSelectOption ? onSelectOption(option.key) : null}>
                    <View style={styles.optionIconContainer}>

                      {selectedOption === option.key ? (
                        <Image style={styles.optionIconSelected} source={IconOptionSelected} />
                      ) : (
                        <Image style={styles.optionIcon} source={IconOption} />
                      )}
                    </View>
                    <View style={[styles.optionContent, isInputAndSelected ? styles.optionTextInputContent: null]}>
                      {isInputAndSelected ? (
                        <TextInput
                          multiline={true}
                          style={[styles.optionTextInput, (option.inputParams && option.inputParams.multiline == false)?styles.singleLineTextInput:null]}
                          value={optionInputs && optionInputs[option.key] ? optionInputs[option.key] : ''}
                          onChangeText={(text) => onChangeOptionInputs ? onChangeOptionInputs(option.key, text) : null}
                          keyboardType={option.keyboardType ? option.keyboardType : 'default'}
                          {...option.inputParams} />
                          
                      ) : (
                        <View>
                        <Text style={styles.optionText}>{option.name ? option.name : ''}</Text>
                        </View>
                      )}
                      {option.helperText?
                        <View>
                          <Text style={styles.helperText}>{option.helperText}</Text>
                        </View>
                          :null
                      }
                    </View>
                  </TouchableOpacity>
                )
              })}
            </View>
            <TouchableOpacity style={styles.selectIconContainer}
              onPress={() => this.setState({isExpanded: !isExpanded})}>
              <Image style={{width: 20, height: 14}} source={IconCheckWhite} />
            </TouchableOpacity>
          </View>
        ) : null}
      </View>
    )
  }

  // onChangeOptionInput(key, text) {
  //
  //   const {onChangeOptionInputs, optionInputs} = this.props;
  //   optionInputs[key] = text;
  //   //this.setState({inputs});
  //   if(onChangeOptionInputs) onChangeOptionInputs(optionInputs);
  // }

}

const styles = StyleSheet.create({
  container : {
    width: ViewUtils.WINDOW_WIDTH,
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: 25
  },
  selectItemContainer: {
    position: 'relative',
    width: ViewUtils.WINDOW_WIDTH - 40,
    flexDirection: 'column'
  },
  selectDropdownContainer: {
    position: 'relative',
    width: ViewUtils.WINDOW_WIDTH,
    backgroundColor: '#F7F4F4',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    paddingTop: 36,
    paddingBottom: 11
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
    lineHeight: 16,
    paddingBottom: 14,
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
    top: 5,
    right: 20,
    width: 30,
    height: 30,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9,
    backgroundColor: ViewUtils.COLOR_THEME_GREEN
  },
  optionsContainer: {
    width: ViewUtils.WINDOW_WIDTH - 50,
    flexDirection: 'column',
  },
  optionRow: {
    minHeight: Platform.OS==='ios' ? 18: 30,
    paddingBottom: 10,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'flex-end',
    borderBottomWidth: 0.5,
    borderBottomColor: ViewUtils.COLOR_THEME_LIGHT_GRAY
  },
  optionIconContainer: {
    position: 'relative',
    width: 36,
    height: 18,
    flexDirection: 'row'
  },
  optionContent: {
    flex:1,
    minHeight: 18,
    flexDirection: 'column',
  },
  optionText: {
    fontSize: 16,
    color: '#000',
    fontWeight: 'normal'
  },
  optionIcon: {
    width: 18,
    height: 18
  },
  optionIconSelected: {
    width: 18,
    height: 18
  },
  optionTextInputRow: {
    alignItems: 'flex-start',
    height: 70
  },
  optionTextInputContent: {
    height: 60
  },
  optionTextInput: {
    flex:1,
    height: 60,
    fontFamily: ViewUtils.FONT_DOSIS_MEDIUM,
    fontSize: 16,
    backgroundColor: '#FFF',
    paddingHorizontal: 5

  },
  singleLineTextInput: {
    height: 40
  },
  helperText: {
    fontSize: 12
  }
});

export default OptionSelectInput;
