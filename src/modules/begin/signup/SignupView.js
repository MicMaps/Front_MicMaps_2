import React, {PropTypes, Component} from 'react';
import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Keyboard,
  TouchableWithoutFeedback
} from 'react-native';
import Ionicon from 'react-native-vector-icons/Ionicons'
import Loader from '../../../components/modals/loader/loader';
import AlertBar from '../../../components/alert-bar/alertBar';
import GlobalStyles from '../../../styles/globalStyles';
import * as ViewUtils from '../../../utils/viewUtils';
import * as UserActions from '../../../redux/user/UserActions';
import * as Utils from '../../../utils/utils';
import PageHeader from '../../../components/custom-views/pageHeader'
import CustomTextInput from '../../../components/custom-views/textInput'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import GATracker from '../../../services/ga'

class SignupView extends Component {
  static displayName = 'SignupView';

  constructor(props) {
    super(props);
    this.errorTimer = null;
    this.state = {
      phone: '',
      password1: '',
      password2: '',
      error: '',
      referral:'',
      isOtpVerified: false
    }
    this.isDataValid = this.isDataValid.bind(this);
    this.sendOtpRequest = this.sendOtpRequest.bind(this);
    this.renderError = this.renderError.bind(this);
  }

  componentDidMount() {
   GATracker.trackScreenView('Sign up Screen')
  }

  componentWillUnmount() {
    this.clearErrorTimer()
  }

  clearErrorTimer() {
    if(this.errorTimer) {
      clearTimeout(this.errorTimer)
      UserActions.resetError()    
    }
  }

  render() {
    const {phone, password1, password2, referral} = this.state;
    const {loading} = this.props;
    return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
    <KeyboardAwareScrollView>
      <View style={styles.container}>
        <PageHeader title={'SIGNUP'} blueLineFill={25} />
        <CustomTextInput style={{paddingTop:40}}
          label={"Phone number"}
          textInputProps={{
            value: phone,
            onChangeText: (text) => this.setState({phone: text}),
            keyboardType: 'phone-pad'
          }}
          validationStatus={Utils.isPhoneNumberValid(phone)}
          validationMessage={Utils.isPhoneNumberValid(phone) ? "" : "Please enter valid phone"} />
        <CustomTextInput
          label={"Password"}
          textInputProps={{
            value: password1,
            secureTextEntry: true,
            returnKeyType: 'next',
            onChangeText: (text) => this.setState({password1: text}),
            onSubmitEditing: (event) => { this._confirmPasswordTextInput.focus() }
          }}
          validationStatus={Utils.isPasswordValid(password1)}
          validationMessage={"Password must contain at least 6 characters."} />
        <CustomTextInput
          label={"Confirm password"}
          textInputProps={{
            ref:(el) => {this._confirmPasswordTextInput = el},
            value: password2,
            secureTextEntry: true,
            onChangeText: (text) => this.setState({password2: text}),
            returnKeyType: 'next',
            onSubmitEditing: (event) => { this._referralTextInput.focus() }
          }}
          validationStatus={Utils.isPasswordValid(password1) && password1 === password2}
          validationMessage={"These passwords don't match. Try again?"} />
        <CustomTextInput
          label={"Referral Code (Optional)"}
          textInputProps={{
            ref:(el) => {this._referralTextInput = el},
            value: referral,
            onChangeText: (text) => this.setState({referral: text}),
            returnKeyType: 'go',
            onSubmitEditing: () => this.isDataValid() && !loading ? this.sendOtpRequest() : null
          }}
          noValidation={true} />
        <TouchableOpacity
          style={[GlobalStyles.button, GlobalStyles.buttonGreenOutlined, {marginTop:55},
            this.isDataValid() && !loading ? null : GlobalStyles.buttonGreenOutlinedDisabled]}
          onPress={() => this.isDataValid() && !loading ? this.sendOtpRequest() : null}
          activeOpacity={ this.isDataValid() && !loading ? 0.2 : 1}>
          <Text style={[GlobalStyles.buttonGreenOutlinedText, this.isDataValid() &&
            !loading ? null : GlobalStyles.buttonGreenOutlinedDisabledText]}>SIGN UP</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[GlobalStyles.buttonTransparent, {marginTop: 8}]}
          onPress={() => this.props.navigation.navigate({routeName:'Login'})}>
          <Text style={GlobalStyles.buttonTransparentText}>Already have an account? Login</Text>
          <Ionicon style={GlobalStyles.buttonTransparentIcon} name='ios-arrow-forward'/>
        </TouchableOpacity>
        {this.renderError()}

        <Loader visibility={!!loading} />
      </View>
      </KeyboardAwareScrollView>
    </TouchableWithoutFeedback>
    );
  }

  renderError() {

    const {error} = this.props;
    let errorMessage = error ? (error.message ? JSON.parse(error.message).error == 'Error Already Exists'?'Looks like this account already exists. Please Login.': JSON.parse(error.message).error : 'Something went wrong, try again') : '';
    console.log("Error Message...")
    console.log(errorMessage?"true":"false")
    if(errorMessage) this.errorTimer = setTimeout(() => this.props.dispatch(UserActions.resetError()), 8000)
    return <AlertBar message={errorMessage} type='error' />

  }


  isDataValid() {
    const {phone, password1, password2, isOtpVerified} = this.state;
    return phone && password1 && password2 && Utils.isPhoneNumberValid(phone) && Utils.isPasswordValid(password1) && (password1 === password2);
  }

  isPhoneNumberValid(phone) {
    return /^(\+\d{1,3}[- ]?)?\d{10}$/.test(phone)
  }

  sendOtpRequest() {

    const {phone, password1, referral} = this.state;
    if(!this.state.phone) {
      alert('phone number required');
      return;
    }

    let  tempUser = { phone: this.state.phone }
    //console.log('OTP_REQUEST_PAYLOAD', tempUser)
    this.props.dispatch(UserActions.sendOtpRequest(tempUser, 'register', (response) => {
        //console.log('OTP_REQUEST_RESPONSE', response)
        if(response.status) {
          tempUser.password = password1;
          tempUser.referral = referral;
          this.props.navigation.navigate({routeName:'VerifyOTP', params:{tempUser: tempUser}});
        }
    }))
  }
}

const styles = StyleSheet.create({
  container: {
    flex:1,
    position: 'relative',
    paddingTop: 46,
    flexDirection: 'column',
    backgroundColor: '#FFF',
    paddingHorizontal:18,
    alignItems: 'center'
  },
  titleTextContainer: {
    width: ViewUtils.WINDOW_WIDTH,
    height:60,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center'
  },
  titleText: {
    fontSize: 38,
    color: '#999'
  },
  textInput: {
    width: ViewUtils.WINDOW_WIDTH - 88,
    height: 36,
    alignSelf: 'center',
    fontSize: 15,
  },
  descriptionTextContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingHorizontal: 25,
    marginTop: 15
  },
  descriptionText: {
    textAlign: 'center',
    fontSize: 12,
    color: '#AAA'
  },
  errorMessageContainer: {
    position: 'absolute',
    left:0,
    bottom:0,
    width: ViewUtils.WINDOW_WIDTH,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical:10,
    backgroundColor: '#FCC',
    zIndex: 9
  },
  errorText: {
    fontSize: 12,
    color: '#C00',
    fontFamily: ViewUtils.THEME_DEFAULT_FONT
  },
  linkText: {
    fontSize: 14,
    color: ViewUtils.COLOR_THEME_GRAY
  },
  linkIcon: {
    fontSize: 11,
    color: ViewUtils.COLOR_THEME_GRAY,
    marginLeft: 5,
    paddingTop:2
  },
});

export default SignupView;
