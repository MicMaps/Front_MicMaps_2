import React, {PropTypes, Component} from 'react';
import {
  Text,
  View,
  TextInput,
  Keyboard,
  TouchableOpacity,
  StyleSheet
} from 'react-native';
import GlobalStyles from '../../../styles/globalStyles';
import * as Utils from '../../../utils/utils';
import * as ViewUtils from '../../../utils/viewUtils';
import * as UserActions from '../../../redux/user/UserActions';
import ChildPageHeader from '../../../components/headers/childPageHeader';
import PageHeader from '../../../components/custom-views/pageHeader';
import CustomTextInput from '../../../components/custom-views/textInput';
import AlertBar from '../../../components/alert-bar/alertBar';
import Loader from '../../../components/modals/loader/loader';
import GATracker from '../../../services/ga'

class ForgotPasswordView extends Component {
  static displayName = 'ForgotPasswordView';

  constructor(props) {
    super(props);
    this.state = {
      userId: '',
      inputType: '',
      successMessage: '',
      errorMessage: ''
    }
    this.errorTimer = null;
    this.toasterTimer = undefined;
    this.onUserIdChanged = this.onUserIdChanged.bind(this);
    this.renderLoader = this.renderLoader.bind(this);
    this.renderError = this.renderError.bind(this);
    this.renderSuccess = this.renderSuccess.bind(this);
  }

  componentDidMount() {
   GATracker.trackScreenView('Forgot Password Screen')
  }
     


  render() {

    //console.log('FORGOT_PASSWORD_VIEW_STATE', this.state);
    const {loading, userId, inputType} = this.props;
    return (
      <View style={styles.container}>
        <ChildPageHeader navigation={this.props.navigation} />
        <PageHeader title={'FORGOT PASSWORD'} />
        <View style={styles.descriptionTextContainer}>
          <Text style={styles.descriptionText}>Please enter your registered email or phone number.</Text>
        </View>
        <CustomTextInput style={{paddingTop:40}}
          label={"Email/Phone Number"}
          textInputProps={{
            onChangeText: (text) => this.onUserIdChanged(text)
          }}
          validationStatus={this.isDataValid()}
          validationMessage={ this.isDataValid() ? '' : 'Please enter valid email / phone number' } />
        <TouchableOpacity
          style={[GlobalStyles.button, GlobalStyles.buttonGreenOutlined, {marginTop:25},
            this.isDataValid() && !loading ? null : GlobalStyles.buttonGreenOutlinedDisabled]}
          onPress={() => this.isDataValid() && !loading ? this.onContinue() : null}
          activeOpacity={ this.isDataValid() && !loading ? 0.2 : 1}>
          <Text style={[GlobalStyles.buttonGreenOutlinedText, this.isDataValid() &&
            !loading ? null : GlobalStyles.buttonGreenOutlinedDisabledText]}>CONTINUE</Text>
        </TouchableOpacity>
        {this.renderError()}
        {this.renderSuccess()}
        {this.renderLoader()}
      </View>
    );

  }

  renderError() {
    const {error} = this.props;
    let errorMessage = error ? (error.message ? JSON.parse(error.message).error : 'Something went wrong, try again') : '';
    if(errorMessage) {
      this.props.dispatch(UserActions.resetError())
    }
    return <AlertBar message={this.state.errorMessage} type='error' />
  }

  renderSuccess() {
    const {successMessage} = this.state;
    return <AlertBar message={successMessage} type='success' />
  }

  renderLoader() {
    const {loading} = this.props;
    return <Loader visibility={!!loading} />
  }

  onUserIdChanged(userId) {

    let inputType = ''
    if(Utils.isEmailValid(userId)) inputType = 'email'
    else if(Utils.isPhoneNumberValid(userId)) inputType = 'phone'
    else inputType = ''
    this.setState({userId, inputType})
  }

  isDataValid() {
    const {userId} = this.state;
    return Utils.isEmailValid(userId) || Utils.isPhoneNumberValid(userId);
  }

  onContinue() {

    const {inputType, userId} = this.state;

    Keyboard.dismiss();
    if(inputType) {
      let data = {}
      data[inputType] = userId;
      this.props.dispatch(UserActions.resetUserPasswordRequest(data, response => {
        //console.log('RESET_PASSWORD_RESPONSE', response);
        if(response.status) {
          let successMessage = `Reset password link has been sent to your ${inputType === 'email' ? 'email address' : 'phone number'}`
          this.setToasterMessageStates(successMessage, '')
        } else {
          let errorMessage = response.message?JSON.parse(response.message).error:'Something went wrong. Please try later.'
          this.setToasterMessageStates('', errorMessage)
        }
      }))
    }
  }

  setToasterMessageStates(successMessage, errorMessage) {
    this.setState({successMessage,errorMessage})
    if(this.toasterTimer) {
      clearTimeout(this.toasterTimer)
    }
    this.toasterTimer = setTimeout(() => this.setState({errorMessage: '', successMessage:''}), 8000)
  }

}

const styles = StyleSheet.create({
  container: {
    flex:1,
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
  descriptionTextContainer: {
    width: ViewUtils.WINDOW_WIDTH,
    paddingHorizontal: 20,
    flexDirection: 'row',
    marginTop: 15
  },
  descriptionText: {
    fontSize: 16,
    fontFamily: ViewUtils.FONT_DOSIS_MEDIUM,
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

export default ForgotPasswordView;
