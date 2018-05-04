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
import IoniconsIcon from 'react-native-vector-icons/Ionicons'
import PageHeader from '../../../components/custom-views/pageHeader'
import AlertBar from '../../../components/alert-bar/alertBar'
import Loader from '../../../components/modals/loader/loader'
import * as Utils from '../../../utils/utils'
import * as ViewUtils from '../../../utils/viewUtils'
import * as UserActions from '../../../redux/user/UserActions'
import GlobalStyles from '../../.././styles/globalStyles'
import CustomTextInput from '../../../components/custom-views/textInput'
// import GATracker from '../../../services/ga'


class LoginView extends Component {
  static displayName = 'LoginView';

  constructor(props) {
    super(props);
    this.state = {
      phone: '',
      password: '',
      error: '',
      isLoading: false,
      isRemembered: true
    }
    this.errorTimer = null;
    this.renderLoader = this.renderLoader.bind(this);
    this.renderValidationError = this.renderValidationError.bind(this);
    this.loginRequest = this.loginRequest.bind(this);
    this.facebookLogin = this.facebookLogin.bind(this);
    this.facebookUserLogin = this.facebookUserLogin.bind(this);
    this.moveNext = this.moveNext.bind(this);
  }

  componentDidMount() {
    // GATracker.trackScreenView('Login Screen')
    this.props.dispatch(UserActions.setLoadingStatus(false))
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
    const {loading} = this.props;
    const {phone, password, isRemembered} = this.state;
    return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={styles.container}>
        <PageHeader title={'LOGIN'} blueLineFill={42}/>
        <CustomTextInput style={{paddingTop:42}}
          label={"Phone number"}
          textInputProps= {{
            value: phone,
            onChangeText: (text) => this.setState({phone: text}),
            keyboardType: 'phone-pad'
          }}
          validationStatus={Utils.isPhoneNumberValid(phone)}
          validationMessage={"Please enter valid phone number"} />
        <CustomTextInput
          label={"Password"}
          textInputProps={{
            value: password,
            secureTextEntry: true,
            returnKeyType: 'go',
            onChangeText: (text) => this.setState({password: text}),
            onSubmitEditing: () => this.isDataValid() && !loading ? this.loginRequest() : null
          }}
          validationStatus={Utils.isPasswordValid(password)}
          validationMessage={"Password must contain at least 6 characters."} />
        <View style={styles.optionsContainer}>
          <View style={styles.optionsRightContainer}>
            <Text style={styles.rememberText}>Remember</Text>
            <TouchableOpacity onPress={() => this.setState({isRemembered: !isRemembered})}>
              <IoniconsIcon style={styles.rememberCheckbox} name={isRemembered ? 'ios-checkbox-outline' : 'ios-square-outline'}/>
            </TouchableOpacity>
          </View>
        </View>
        <TouchableOpacity
          style={[GlobalStyles.button, GlobalStyles.buttonGreenOutlined, {marginTop: 20},
            this.isDataValid() && !loading ? null : GlobalStyles.buttonGreenOutlinedDisabled]}
          onPress={() => this.isDataValid() && !loading ? this.loginRequest() : null}
          activeOpacity={ this.isDataValid() && !loading ? 0.2 : 1}>
          <Text style={[GlobalStyles.buttonGreenOutlinedText,
            this.isDataValid() && !loading ? null : GlobalStyles.buttonGreenOutlinedDisabledText]}>LOG IN</Text>
        </TouchableOpacity>
        <TouchableOpacity style={GlobalStyles.buttonTransparent} onPress={() => this.props.navigate({routeName:'ForgotPassword'})}>
          <Text style={[GlobalStyles.buttonTransparentText, {marginTop:5, marginBottom: 10}]}>Forgot your password?</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[GlobalStyles.button, GlobalStyles.buttonBlueOutlined, {marginTop: 44}]}
          onPress={() => this.facebookLogin()}>
          <Text style={GlobalStyles.buttonBlueOutlinedText}>FACEBOOK</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => this.props.navigate({routeName:'Signup'})}
          style={[GlobalStyles.buttonTransparent, {marginTop:10}]}>
          <Text style={GlobalStyles.buttonTransparentText}>Don't have an account yet? Signup</Text>
          <IoniconsIcon style={GlobalStyles.buttonTransparentIcon} name='ios-arrow-forward' />
        </TouchableOpacity>
        {this.renderLoader()}
        {this.renderError()}
        {this.renderValidationError()}
      </View>
    </TouchableWithoutFeedback>
    );
  }

  renderLoader() {

    //const {loading} = this.props;
    return (
      <Loader visibility={(!!this.props.loading) || (!!this.state.isLoading)} />
    )
  }

  renderError() {

    const {error} = this.props;
    let errorMessage = error ? (error.message ? JSON.parse(error.message).error : 'Something went wrong, try again') : '';
    if(errorMessage) this.errorTimer = setTimeout(() => this.props.dispatch(UserActions.resetError()), 6000)
    return <AlertBar message={errorMessage} type='error' />

  }

  renderValidationError() {
    const {error} = this.state;
    return (error) ? (
      <View style={styles.errorMessageContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    ) : null;
  }

  isDataValid() {
    const {phone, password} = this.state;
    return phone && Utils.isPhoneNumberValid(phone) && password && Utils.isPasswordValid(password);
  }


  loginRequest() {

    const {phone, password, isRemembered} = this.state;
    let tempUser = { phone, password }

    //console.log('USER_LOGIN_PAYLOAD', tempUser)
    this.props.dispatch(UserActions.loginRequest(tempUser, (response) => {
      //console.log('USER_LOGIN_RESPONSE', response)
      if(response.status) {
        this.props.dispatch(UserActions.saveRememberMeStatus(isRemembered));
        this.moveNext()
      }
    }))
  }

  facebookLogin() {
    this.props.dispatch(UserActions.facebookLoginRequest(response => {
      if(response.status) {
        //console.log('FACEBOOK_LOGIN_RESPONSE', response)
        let fbUser = {
          fbToken: response.data.token
        }
        this.facebookUserLogin(fbUser);

      }
    }))
  }

  facebookUserLogin(fbUser) {
    //console.log('FACEBOOK_USER', fbUser)
    const {isRemembered} = this.state;
    this.setState({isLoading: true})
    this.props.dispatch(UserActions.facebookUserLoginRequest(
      fbUser, (response) => {
      //console.log('FACEBOOK_USER_LOGIN_RESPONSE', response);
      if(response.status) {
        this.props.dispatch(UserActions.saveRememberMeStatus(isRemembered));
        this.moveNext()
      }
      this.setState({isLoading: false})
    }))
  }

  moveNext() {
    Permissions.check('location')
      .then(locationPermission => {
        if(locationPermission === 'authorized'){
            this.props.navigate({routeName:'UseLocation'})
        } 
        else {
            this.props.navigate({routeName:'UseLocation'})
        }
        //console.log('location permissions check response: ', locationPermission)
    })
  }

}

const styles = StyleSheet.create({
  container: {
    flex:1,
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
  optionsContainer: {
    width: ViewUtils.WINDOW_WIDTH - 40,
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionsRightContainer: {
    flex:1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end'
  },
  rememberCheckbox: {
    color: ViewUtils.COLOR_THEME_GREEN,
    fontSize:20,
    marginLeft:6
  },
  rememberText: {
    color: ViewUtils.COLOR_THEME_GREEN,
    fontSize: 15,
    paddingBottom: 3,
    fontFamily: ViewUtils.THEME_DEFAULT_FONT,
    fontWeight: '400'
  }
});

export default LoginView;
