import React, {PropTypes, Component} from 'react';
import {
  Text,
  View,
  Image,
  TextInput,
  StyleSheet,
  Platform
} from 'react-native';
import Ionicon from 'react-native-vector-icons/Ionicons'
import * as ViewUtils from '../../utils/viewUtils'
import MicMapsLogo from '../../../images/MicMaps_ICON.png'
import IconCheck from '../../../images/iconCheck.png'
import IconWrong from '../../../images/iconWrong.png'

class CustomTextInput extends Component {

  constructor(props) {
    super(props)
    this.state = {
      onFocused: false,
      onTouched: false
    }
  }

  render() {

    const {style, textInputProps, label, noValidation, validationStatus, validationMessage} = this.props;
    const {onTouched, onFocused} = this.state;

    let textInputContainerStyles = [styles.textInputContainer];
    if(!noValidation && onTouched && !validationStatus && !!(textInputProps.value)) textInputContainerStyles.push(styles.textInputError);

    let validationMessageStyles = [styles.validationMessageText];
    if(!noValidation && onTouched && !validationStatus && !!(textInputProps.value)) validationMessageStyles.push(styles.errorText);
    if(!noValidation && onTouched && !!validationStatus && !(textInputProps.value)) validationMessageStyles.push(styles.successText);

    //console.log("TEXT_INPUT_VIEW_STATE", this.state);
    //console.log("TEXT_INPUT_VIEW_PROPS", this.props);

    let {onFocus, ...inputProps} = textInputProps ? textInputProps : {};
    //console.log("TEXT_INPUT_VIEW: onfocus", onFocus);

    return (
      <View style={[styles.container, style]}>
        <View style={styles.textContainer}>
          <Text style={styles.labelText}>{label}</Text>
        </View>
        <View style={textInputContainerStyles}>
          <TextInput
            style={styles.textInput}
            onFocus={(e) => {
              this.setState({onFocused: true, onTouched: true});
              if(onFocus) onFocus(e);
            }}
            onBlur={() => this.setState({onFocused: false})}
            underlineColorAndroid={'transparent'}
            {...inputProps} />
          <View style={styles.validationIconContainer}>
            {!noValidation && onTouched && !validationStatus && !!(textInputProps.value)? (
              <Image style={{width: 0, height: 0}} source={IconWrong} />
            ) : null }
            {!noValidation && onTouched && !!validationStatus? (
              <Image style={{width: 23, height: 17}} source={IconCheck} />
            ) : null}
          </View>
        </View>
        {!noValidation && onTouched && validationMessage && !validationStatus && !!(textInputProps.value)? (
          <View style={styles.validationMessageContainer}>
            <Text style={validationMessageStyles}>{validationMessage}</Text>
          </View>
        ) : null}
      </View>
    )
  }



}

const styles = StyleSheet.create({
  container : {
    position: 'relative',
    width: ViewUtils.WINDOW_WIDTH - 40,
    flexDirection: 'column',
  },
  textContainer: {
    marginBottom:4
  },
  labelText: {
    fontSize: 14,
    fontFamily: ViewUtils.FONT_DOSIS_MEDIUM,
    color: ViewUtils.COLOR_THEME_GRAY,
  },
  textInputContainer: {
    position: 'relative',
    width: ViewUtils.WINDOW_WIDTH - 40,
    height: 42,
    flexDirection: 'column',
    borderColor: ViewUtils.COLOR_THEME_LIGHT_GRAY,
    borderBottomWidth: 0.5,
    marginBottom: 15
  },
  textInput: {
    height: 46,
    fontSize: 16,
    color: ViewUtils.COLOR_THEME_BLUE,
    marginTop: Platform.OS==='ios' ? 2: 0,
    marginLeft: Platform.OS==='ios' ? 0: -4,
    paddingBottom:Platform.OS==='ios' ? 2 : 10,
    paddingRight: 30,
    fontFamily: ViewUtils.FONT_DOSIS_MEDIUM,
    fontWeight: 'normal'
  },
  textInputError: {
    borderColor: ViewUtils.COLOR_THEME_RED,
  },
  validationIconContainer: {
    position: 'absolute',
    right: 0,
    top: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  validationMessageText: {
    marginBottom: 15,
    flexDirection: 'row',
    alignItems: 'center',
    fontFamily: ViewUtils.FONT_DOSIS_MEDIUM,
    lineHeight: 15
  },
  errorText: {
    fontSize: 14,
    color: ViewUtils.COLOR_THEME_RED
  },
  successText: {
    fontSize: 14,
    color: ViewUtils.COLOR_THEME_GREEN
  }
});

export default CustomTextInput;
