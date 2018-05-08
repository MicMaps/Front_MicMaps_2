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
//import GATracker from '../../../services/ga'

class SignupProfileView extends Component {
  static displayName = 'SignupProfileView';

  constructor(props) {
    super(props);
    this.errorTimer = null;
    this.state = {
      firstName: '',
      lastName: '',
      emailAddress: ''
    }
    this.isDataValid = this.isDataValid.bind(this);
    this.renderError = this.renderError.bind(this);
    this.saveProfile = this.saveProfile.bind(this);
    this.moveNext = this.moveNext.bind(this);
    this.clearErrorTimer = this.clearErrorTimer.bind(this);
  }

  componentDidMount() {
    //GATracker.trackScreenView('Sign up Extra Profile Screen')
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
    const {firstName, lastName, emailAddress} = this.state;
    const {loading} = this.props;
    return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
    <KeyboardAwareScrollView>
      <View style={styles.container}>
        <Loader visibility={loading} />
        <PageHeader title={'PROFILE'} blueLineFill={25} />
        <CustomTextInput style={{paddingTop:40}}
          label={"First Name"}
          textInputProps={{
            value: firstName,
            onChangeText: (text) => this.setState({firstName: text}),
            onSubmitEditing: (event) => { this._lastNameTextInput.focus() },
            returnKeyType: 'next'
          }}
          validationStatus={!!firstName}
          validationMessage={!!firstName ? "" : "Please enter your first Name"} />
        <CustomTextInput style={{paddingTop:40}}
          label={"Last Name"}
          textInputProps={{
            ref:(el) => {this._lastNameTextInput = el},
            value: lastName,
            onChangeText: (text) => this.setState({lastName: text}),
            onSubmitEditing: (event) => { this._emailTextInput.focus() },
            returnKeyType: 'next'
          }}
          validationStatus={!!lastName}
          validationMessage={!!lastName ? "" : "Please enter your Last Name"} />
       
       <CustomTextInput style={{paddingTop:40}}
          label={"Email"}
          textInputProps={{
            ref:(el) => {this._emailTextInput = el},
            value: emailAddress,
            onChangeText: (text) => this.setState({emailAddress: text}),
            onSubmitEditing: (event) => {() => this.isDataValid() && !loading ? this.saveProfile() : null},
            returnKeyType: 'go'
          }}
          validationStatus={!!Utils.isEmailValid(emailAddress)}
          validationMessage={!Utils.isEmailValid(emailAddress) ? "" : "Please enter a valid Email Address"} />
        <TouchableOpacity
          style={[GlobalStyles.button, GlobalStyles.buttonGreenOutlined, {marginTop:55},
            this.isDataValid() && !loading ? null : GlobalStyles.buttonGreenOutlinedDisabled]}
          onPress={() => this.isDataValid() && !loading ? this.saveProfile() : null}
          activeOpacity={ this.isDataValid() && !loading ? 0.2 : 1}>
          <Text style={[GlobalStyles.buttonGreenOutlinedText, this.isDataValid() &&
            !loading ? null : GlobalStyles.buttonGreenOutlinedDisabledText]}>SAVE</Text>
        </TouchableOpacity>
        {this.renderError()}
      </View>
      </KeyboardAwareScrollView>
    </TouchableWithoutFeedback>
    );
  }

  renderError() {

    const {error} = this.props;
    let errorMessage = error ? 'Something went wrong, try again': '';
    console.log("Error Message...")
    console.log(errorMessage?"true":"false")
    if(errorMessage) this.errorTimer = setTimeout(() => this.props.dispatch(UserActions.resetError()), 8000)
    return <AlertBar message={errorMessage} type='error' />

  }


  isDataValid() {
    const {firstName, lastName, emailAddress} = this.state;
    return firstName && lastName && Utils.isEmailValid(emailAddress);
  }

 
  saveProfile() {

    const {firstName, lastName, emailAddress} = this.state;
    let user = {}
    if(firstName || lastName) user.name = {}
    if(firstName) user.name.first = firstName
    if(lastName) user.name.last = lastName
    if(emailAddress && Utils.isEmailValid(emailAddress)) user.email = emailAddress
    if(Object.keys(user).length > 0) {
      this.props.dispatch(UserActions.updateUserProfileRequest(user, (response) => {
        if(response.status) {
           this.moveNext()
        }
      }));
    } else console.log('No user data to update')
  }

  moveNext() {
      Permissions.check('location')
      .then(locationPermission => {
        if(locationPermission === 'authorized'){
            this.props.navigation.navigate({routeName:'Home'})
        } 
        else {
            this.props.navigation.navigate({routeName:'UseLocation'})
        }
      }) 
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

export default SignupProfileView;