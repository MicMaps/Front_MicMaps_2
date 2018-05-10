import React, {Component} from 'react';
import {
  Text,
  View,
  StyleSheet,
  Keyboard,
  TouchableOpacity
} from 'react-native';
import ReactNative from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import IoniconsIcon from 'react-native-vector-icons/Ionicons';

import * as Utils from '../../../../utils/utils';
import * as ViewUtils from '../../../../utils/viewUtils';
import PageHeader from '../../../../components/custom-views/pageHeader';
import CustomTextInput from '../../../../components/custom-views/textInput';
import GATracker from '../../../../services/ga';

class AboutMicForm extends Component {
  static displayName = 'AboutMicForm';

  constructor(props) {
    super(props);
    this.state = {
    }

    this._scrollToInput = this._scrollToInput.bind(this);

  }

  componentDidMount() {
    GATracker.trackScreenView('Mics Suggest Host Info Screen')
  }

  render() {

    const {onChangeFieldValue, formData} = this.props;
    const {hostName, hostPhone, hostEmail, displayPhone, displayEmail} = formData;
    return (
      <View style={styles.container}>
        <PageHeader
          title={'ADD A MIC'}
          subtitle={'About mic host'} />
          <KeyboardAwareScrollView ref={ref => {this.scroll = ref}} extraHeight={220}>
            <View style={styles.contentContainer}>
              <CustomTextInput
                  label={"Host Name *"}
                  textInputProps={{
                    ref: (el) => {this._hostNameInput = el},
                    value: hostName,
                    onChangeText: (text) => onChangeFieldValue ? onChangeFieldValue('hostName', text) : '',
                    returnKeyType: 'next',
                    onSubmitEditing: () => this._hostPhoneInput.focus(),
                    onFocus: this._scrollToInput
                  }}
                  validationStatus={!!hostName}
                  validationMessage={!hostName ? 'Please select mic host name' : ''} />
              <CustomTextInput
                label={"Host Phone *"}
                textInputProps={{
                  ref: (el) => {this._hostPhoneInput = el},
                  value: hostPhone,
                  onChangeText: (text) => onChangeFieldValue ? onChangeFieldValue('hostPhone', text) : '',
                  keyboardType: 'phone-pad',
                  returnKeyType: 'next',
                  onSubmitEditing: () => this._hostEmailInput.focus(),
                  onFocus: this._scrollToInput
                }}
                validationStatus={Utils.isPhoneNumberValid(hostPhone)}
                validationMessage={!Utils.isPhoneNumberValid(hostPhone) ? 'Please enter valid phone number' : ''} />
                <View style={styles.optionsContainer}>
                  <View style={styles.optionsLeftContainer}>
                    <TouchableOpacity onPress={() => onChangeFieldValue ? onChangeFieldValue('displayPhone', !displayPhone) : null}>
                      <IoniconsIcon style={[styles.checkbox, {paddingRight:10}]} name={displayPhone ? 'ios-checkbox-outline' : 'ios-square-outline'}/>
                    </TouchableOpacity>
                    <Text style={styles.checkboxText}>Display host phone number?</Text>
                  </View>
                </View>
              <CustomTextInput
                label={"Host Email *"}
                textInputProps={{
                  ref: (el) => {this._hostEmailInput = el},
                  value: hostEmail,
                  onChangeText: (text) => onChangeFieldValue ? onChangeFieldValue('hostEmail', text) : '',
                  keyboardType: 'email-address',
                  returnKeyType: 'next',
                  onSubmitEditing: () => Keyboard.dismiss(),
                  onFocus: this._scrollToInput
                }}
                validationStatus={Utils.isEmailValid(hostEmail)}
                validationMessage={!Utils.isEmailValid(hostEmail) ? 'Please enter valid email' : ''} />
                <View style={styles.optionsContainer}>
                  <View style={styles.optionsLeftContainer}>
                    <TouchableOpacity onPress={() => onChangeFieldValue ? onChangeFieldValue('displayEmail', !displayEmail) : null}>
                      <IoniconsIcon style={[styles.checkbox, {paddingRight:10}]} name={displayEmail ? 'ios-checkbox-outline' : 'ios-square-outline'}/>
                    </TouchableOpacity>
                    <Text style={styles.checkboxText}>Display host email?</Text>
                  </View>
                </View>
              </View>
            </KeyboardAwareScrollView>
      </View>
    );
  }

  _scrollToInput (event) {
    this.scroll.scrollToFocusedInput(ReactNative.findNodeHandle(event.target));
  }

}

const styles = StyleSheet.create({
  container: {
    flex:1,
    flexDirection: 'column',
    alignItems: 'center',
    paddingTop: 4,
    backgroundColor: '#FFF'
  },
  contentContainer: {
    flex:1,
    flexDirection: 'column',
    alignItems: 'center',
  },
  titleTextContainer: {
    width: ViewUtils.WINDOW_WIDTH,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    marginBottom: 20
  },
  titleText: {
    fontSize: 16,
    color: ViewUtils.COLOR_THEME_GREEN,
  },
  optionsContainer: {
    width: ViewUtils.WINDOW_WIDTH - 40,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  optionsLeftContainer: {
    flex:1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start'
  },
  optionsRightContainer: {
    flex:1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end'
  },
  checkbox: {
    color: ViewUtils.COLOR_THEME_GREEN,
    fontSize:20,
  },
  checkboxText: {
    color: ViewUtils.COLOR_THEME_GRAY,
    fontSize: 14,
    paddingBottom: 3,
    fontFamily: ViewUtils.THEME_DEFAULT_FONT,
    fontWeight: '400'
  }
});

export default AboutMicForm;
