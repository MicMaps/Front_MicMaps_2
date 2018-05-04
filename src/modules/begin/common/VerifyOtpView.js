import React, {PropTypes, Component} from 'react';
import Permissions from 'react-native-permissions'
import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Keyboard,
  TouchableWithoutFeedback
} from 'react-native';
import GlobalStyles from '../../../styles/globalStyles';
import * as Utils from '../../../utils/utils'
import * as ViewUtils from '../../../utils/viewUtils';
import * as UserActions from '../../../redux/user/UserActions';
import ChildPageHeader from '../../../components/headers/childPageHeader';
import PageHeader from '../../../components/custom-views/pageHeader';
import CustomTextInput from '../../../components/custom-views/textInput';
import AlertBar from '../../../components/alert-bar/alertBar';
import Loader from '../../../components/modals/loader/loader';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
// import GATracker from '../../../services/ga'

class VerifyOtpView extends Component {
  static displayName = 'VerifyOtpView';

  constructor(props) {
    super(props);
    this.state = {
      otp: ''
    }
    this.errorTimer = null;
    this.isDataValid = this.isDataValid.bind(this);
    this.registerUser = this.registerUser.bind(this);
    this.moveNext = this.moveNext.bind(this);
    this.renderLoader = this.renderLoader.bind(this);
    this.renderError = this.renderError.bind(this);
    this.clearErrorTimer = this.clearErrorTimer.bind(this);
  }

  componentDidMount() {
    //console.log('VERIFY_OTP_VIEW_PROPS', this.props);
    // GATracker.trackScreenView('Verify OTP Screen')
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
    //console.log('VERIFY_OTP_VIEW_PROPS', this.props);
    const {loading, action} = this.props;
    return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
    <KeyboardAwareScrollView>
      <View style={styles.container}>
        <ChildPageHeader />
        <PageHeader title={'VERIFY OTP'} />
        <View style={styles.descriptionTextContainer}>
          <Text style={styles.descriptionText}>Please enter the one time password (OTP) that was received on your mobile number.</Text>
        </View>
        <CustomTextInput style={{paddingTop:40}}
          label={"One Time Password"}
          textInputProps={{
            onChangeText: (text) => this.setState({otp: text}),
            keyboardType: 'phone-pad'
          }}
          noValidation={true} />
        <TouchableOpacity
          style={[GlobalStyles.button, GlobalStyles.buttonGreenOutlined, {marginTop:25},
            this.isDataValid() && !loading ? null : GlobalStyles.buttonGreenOutlinedDisabled]}
          onPress={() => this.isDataValid() && !loading ? ((action === 'login') ? this.loginRequest() : this.registerUser()) : null}
          activeOpacity={ this.isDataValid() && !loading ? 0.2 : 1}>
          <Text style={[GlobalStyles.buttonGreenOutlinedText, this.isDataValid() &&
            !loading ? null : GlobalStyles.buttonGreenOutlinedDisabledText]}>CONTINUE</Text>
        </TouchableOpacity>
        {this.renderError()}
        {this.renderLoader()}
      </View>
      </KeyboardAwareScrollView>
    </TouchableWithoutFeedback>
    );
  }

  renderError() {
    const {error} = this.props;
    let errorMessage = error ? (error.message ? JSON.parse(error.message).error == 'Error Already Exists'?'Looks like this account already exists. Please Login.': JSON.parse(error.message).error : 'Something went wrong, try again') : '';
    if(errorMessage) this.errorTimer = setTimeout(() => this.props.dispatch(UserActions.resetError()), 8000)
    return <AlertBar message={errorMessage} type='error' />
  }

  renderLoader() {
    const {loading} = this.props;
    return <Loader visibility={loading} />
  }

  isDataValid() {
    return !!this.state.otp;
  }

  registerUser() {
    const { params } = this.props.navigation.state  
    console.log(this.props.navigation)
    const tempUser = params.tempUser;
    let registerData = {
      user: tempUser,
      otp: this.state.otp
    }
    this.clearErrorTimer()
    //console.log('REGISTER_USER_PAYLOAD', registerData)
    this.props.dispatch(UserActions.registerUser(registerData, (response) => {
      console.log('REGISTER_USER_RESPONSE', response);
      if(response.status) {
        this.props.dispatch(UserActions.saveRememberMeStatus(true));
        this.moveNext()
      }
      else {
        Keyboard.dismiss()
      }
    }))
  }

  loginRequest() {
    const {tempUser} = this.props;
    let loginData = {
      phone: tempUser.phone,
      otp: this.state.otp
    }
    this.clearErrorTimer()
    this.props.dispatch(UserActions.loginRequest(loginData, (response) => {
      if(response.status) this.moveNext()
    }))
  }

  moveNext() {

    const {action} = this.props;

    if(action == 'login') {
      Permissions.check('location')
      .then(locationPermission => {
        if(locationPermission === 'authorized') Actions.main()
        else Actions.useLocation()
      }) 
    } else {
      Actions.signupProfile()
    }
  }

}

const styles = StyleSheet.create({
  container: {
    flex:1,
    flexDirection: 'column',
    backgroundColor: '#FFF',
    paddingHorizontal:18,
    alignItems: 'center',
    height: ViewUtils.WINDOW_HEIGHT
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
  roundedBackground: {
    width: ViewUtils.WINDOW_WIDTH - 36,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFF',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 15
  },
  textInput: {
    width: ViewUtils.WINDOW_WIDTH - 88,
    height: 36,
    alignSelf: 'center',
    fontSize: 15
  },
  buttonTransparent: {
    backgroundColor: 'rgba(0,0,0,0)'
  },
  buttonText: {
    fontSize: 13,
    color: '#888'
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
    color: ViewUtils.COLOR_THEME_BLUE
  },
  textContainer: {
    flexDirection: 'row',
    width: ViewUtils.WINDOW_WIDTH,
    alignItems: 'center',
    justifyContent: 'center',
  },
  hinText: {
    color: ViewUtils.COLOR_THEME_EXTRA_LIGHT_BLUE,
    color: 12,
    textAlign: 'center'
  }
});

export default VerifyOtpView;
