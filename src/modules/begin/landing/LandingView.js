import React, {PropTypes, Component} from 'react';
import {
  Text,
  View,
  Image,
  TouchableOpacity,
  StyleSheet,
  Alert
} from 'react-native';
import Ionicon from 'react-native-vector-icons/Ionicons';
import AlertBar from '../../../components/alert-bar/alertBar';
import * as UserActions from '../../../redux/user/UserActions';
import * as ViewUtils from '../../../utils/viewUtils';
import globalStyles from '../../../styles/globalStyles';
import MicMapsLogo from '../../../../images/MicMaps_ICON.png';
//import GATracker from '../../../services/ga'

class LandingView extends Component {
  static displayName = 'LandingView';

  constructor(props) {
    super(props);
    this.state = {
      phone: '',
      password: '',
      error: ''
    }
    this.errorTimer = null;
    this.facebookLogin = this.facebookLogin.bind(this)
    this.facebookUserSignup = this.facebookUserSignup.bind(this)
    this.renderError = this.renderError.bind(this)
  }

  componentDidMount() {
    // GATracker.trackScreenView('Landing Screen')
    this.props.dispatch(UserActions.resetError())
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

    return (
      <View style={styles.container}>
        <View style={styles.topView}>
          <View style={styles.logo}>
            {/* <Text style={styles.logoText}>MicMacs</Text> */}
            <Image source={MicMapsLogo} style={styles.logoImage} />
          </View>
        </View>
        <View style={styles.bottomView}>
          <TouchableOpacity
            style={[globalStyles.button, globalStyles.buttonWhiteOutlined]}
            activeOpacity={0.5}
            onPress={() => this.facebookLogin()}>
            <Text style={globalStyles.buttonWhiteOutlinedText}>SIGNUP WITH FACEBOOK</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[globalStyles.button, globalStyles.buttonWhiteSolid]}
            activeOpacity={0.5}
            onPress={() => this.props.navigation.navigate({routeName:'Signup'})}>
            <Text style={globalStyles.buttonWhiteSolidText}>SIGNUP WITH PHONE NUMBER</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[globalStyles.button, globalStyles.buttonTransparent]}
            activeOpacity={0.5}
            onPress={() => this.props.navigation.navigate({routeName:'Login'})}>
            <Text style={styles.linkText}>I already have an account</Text>
            <Ionicon style={styles.linkIcon} name='ios-arrow-forward'/>
          </TouchableOpacity>
        </View>
        {this.renderError()}
      </View>
    );
  }

  renderError() {

    const {error} = this.props;
    let errorMessage = error ? (error.message ? JSON.parse(error.message).error == 'Error Already Exists'?'An account already exists with this facebook account. Try logging in.': JSON.parse(error.message).error : 'Something went wrong, try again') : '';
    this.errorTimer = setTimeout(() => this.props.dispatch(UserActions.resetError()), 10000)
    return <AlertBar message={errorMessage} type='error' />

  }

  facebookLogin() {
    this.props.dispatch(UserActions.facebookLoginRequest(response => {
      if(response.status) {
        //console.log('FACEBOOK_LOGIN_RESPONSE', response)
        let fbUser = {
          user: {
            email: response.data.profile.email,
            password: response.data.profile.id
          },
          fbToken: response.data.token
        }
        this.facebookUserSignup(fbUser);
      }
    }))
  }

  facebookUserSignup(fbUser) {
    //console.log('FACEBOOK_USER', fbUser)
    this.props.dispatch(UserActions.facebookUserSignupRequest(
      fbUser, (response) => {
      //console.log('FACEBOOK_USER_SIGNUP_RESPONSE', response);
      if(response.status) {
        this.props.navigation.navigate({routeName:'Home'})
      }
      else {
        let error = response.data.message ? JSON.parse(response.data.message).error == 'Error Already Exists'?'An account already exists with this facebook account. Try logging in.': JSON.parse(response.data.message).error: 'Something went wrong, try again later!';
        // Alert.alert('Facebook Login', error)
      }
    }))
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: ViewUtils.COLOR_THEME_GREEN
  },
  topView: {
    height: ViewUtils.WINDOW_HEIGHT * 0.63,
    alignItems: 'center',
    justifyContent: 'center'
  },
  logo: {
    width: 208,
    height: 208,
    borderRadius: 85,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8
  },
  logoText: {
    fontSize: 22,
    color: ViewUtils.COLOR_THEME_BLUE
  },
  logoImage: {
    width: 208,
    height: 208,
  },
  bottomView: {
    height: ViewUtils.WINDOW_HEIGHT * 0.37,
    flexDirection: 'column',
    alignItems: 'center',
  },
  linkText: {
    fontSize: 15,
    color: ViewUtils.COLOR_THEME_BLUE,
    fontFamily: ViewUtils.FONT_DOSIS_MEDIUM
  },
  linkIcon: {
    fontSize: 16,
    color: ViewUtils.COLOR_THEME_BLUE,
    marginLeft: 5,
    paddingTop:3
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

});

export default LandingView;
