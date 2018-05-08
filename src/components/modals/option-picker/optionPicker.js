import React, {Component} from 'react';
import {
  Modal,
  Text,
  TouchableOpacity,
  View,
  Image,
  TextInput,
  StyleSheet,
  Keyboard
} from 'react-native';
import EvilIcon from 'react-native-vector-icons/EvilIcons';
import IconOption from '../../../../images/iconOption.png';
import IconOptionSelected from '../../../../images/iconOptionSelected.png';
import * as ViewUtils from '../../../utils/viewUtils';

const PICKER_WIDTH = ViewUtils.WINDOW_WIDTH;
const PICKER_HEIGHT = ViewUtils.WINDOW_HEIGHT * 0.3;

class DatePicker extends Component {

  constructor(props) {
    super(props);
    this.state = {
      keyboardVisible: false
    }

    this._keyboardDidShow = this._keyboardDidShow.bind(this);
    this._keyboardDidHide = this._keyboardDidHide.bind(this);
  }

  componentWillMount () {
    this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this._keyboardDidShow);
    this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide);
  }

  render() {

    const {options, onSelectOption, selectedOption, visibility, open, close, style, onChangeOptionInput, formatValue, optionInputs} = this.props;
    const {keyboardVisible, keyboardHeight} =  this.state;
    return (
      <Modal
        animationType={'slide'}
        transparent={true}
        visible={visibility}
        style={styles.pickerModal}
        onRequestClose={() => {}}>
          <View style={[styles.container, {paddingBottom: keyboardHeight ? keyboardHeight : 0}]}>
            <View style={styles.pickerContainer}>
              <View style={styles.optionsContainer}>
                {options && options.map((option, idx) => {

                  let isInputAndSelected = option.type === 'input' && selectedOption === option.key;
                  return (
                    <TouchableOpacity
                      key={idx}
                      style={[styles.optionRow, isInputAndSelected ? styles.optionTextInputRow: null]}
                      onPress={() => onSelectOption ? onSelectOption(option.key) : null}>
                      <View style={styles.optionIconContainer}>
                        <Image style={styles.optionIcon} source={IconOption} />
                        {selectedOption === option.key ? (
                          <Image style={styles.optionIconSelected} source={IconOptionSelected} />
                        ) : null}
                      </View>
                      <View style={[styles.optionContent, isInputAndSelected ? styles.optionTextInputContent: null]}>
                        {isInputAndSelected ? (
                          <TextInput
                            multiline={true}
                            style={styles.optionTextInput}
                            value={optionInputs ? optionInputs[option.key] : ''}
                            onChangeText={(text) => onChangeOptionInput(option.key, text)}
                            keyboardType={option.keyboardType ? option.keyboardType : 'default'}/>
                        ) : (
                          <Text style={styles.optionText}>{option.name ? option.name : ''}</Text>
                        )}
                      </View>
                    </TouchableOpacity>
                  )
                })}
              </View>
              <TouchableOpacity style={styles.closeButton} onPress={() => close()}>
                <EvilIcon name={'check'} style={styles.closeIcon}/>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
    );
  }

  _keyboardDidShow (e) {
    let height = e.endCoordinates.height ;
    this.setState({keyboardVisible: true, keyboardHeight: height})
  }

  _keyboardDidHide () {
    this.setState({keyboardVisible: false, keyboardHeight: 0})
  }

  componentWillUnmount () {
    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();
  }
}

const styles = StyleSheet.create({

  pickerModal: {
    backgroundColor: 'transparent'
  },
  container: {
    backgroundColor: 'transparent',
    flex: 1,
    alignSelf: 'center',
    height: window.height,
    width: window.width,
    alignItems: 'center',
    justifyContent: 'flex-end',
    flexDirection: 'column',
    borderRadius:4,
  },
  pickerContainer: {
    minHeight: PICKER_HEIGHT,
    width: PICKER_WIDTH,
    borderTopWidth:1,
    borderTopColor: '#DDD',
    backgroundColor: '#F8F8F8',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-start',
    paddingTop: 25,
    borderRadius:6
  },
  picker: {
    flex:1,
    padding:15
  },
  optionsContainer: {
    width: ViewUtils.WINDOW_WIDTH - 50,
    flexDirection: 'column',
    marginTop: 25
  },
  optionRow: {
    height: 30,
    paddingBottom: 7,
    marginBottom: 22,
    flexDirection: 'row',
    alignItems: 'flex-end',
    borderBottomWidth: 0.5,
    borderBottomColor: ViewUtils.COLOR_THEME_LIGHT_GRAY
  },
  optionIconContainer: {
    position: 'relative',
    width: 36,
    height: 18,
    flexDirection: 'row',
  },
  optionContent: {
    flex:1,
    height: 18,
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionText: {
    fontSize: 16,
    color: '#000',
    fontWeight: 'normal'
  },
  optionIcon: {
    position: 'absolute',
    top:0,
    left:0,
    width: 18,
    height: 18,
    zIndex:9
  },
  optionIconSelected: {
    position: 'absolute',
    top:4,
    left:4,
    width: 10,
    height: 10,
    zIndex: 10
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

  },
  closeButton: {
    position: 'absolute',
    top:0,
    right:0,
    padding:6,
    width:40,
    height:40,
    zIndex:9
  },
  closeIcon: {
    fontSize: 24
  }
});

export default DatePicker;
