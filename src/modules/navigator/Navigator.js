import {Platform} from 'react-native';
import {TabNavigator, StackNavigator} from 'react-navigation';
import getSlideFromRightTransitionConfig from '../../utils/navigatorTranslation'

import IntroViewContainer from '../begin/Intro/IntroViewContainer';
import LandingViewContainer from '../begin/landing/LandingViewContainer';
import LoginViewContainer from '../begin/login/LoginViewContainer';
import SignupViewContainer from '../begin/signup/SignupViewContainer';
import ForgotPasswordView from '../begin/forgot-password/ForgotPasswordView';
import SignupProfileViewContainer from '../begin/signup/SignupViewContainer';
import VerifyOtpViewContainer from '../begin/common/VerifyOtpViewContainer';
import UseLocationViewContainer from '../begin/permissions/UseLocationViewContainer'

const headerColor = '#39babd';
const activeColor = 'white';

const BeginStackNavigator = StackNavigator({
  Intro: {screen: IntroViewContainer},
  Landing: {screen: LandingViewContainer},
  Login: {screen: LoginViewContainer},
  Signup: {screen: SignupViewContainer},
  ForgotPassword: {screen:ForgotPasswordView},
  SignupProfile: {screen: SignupProfileViewContainer},
  VerifyOTP: {screen: VerifyOtpViewContainer},
  UseLocation: {screen: UseLocationViewContainer}
}, {
  headerMode:'none',
  cardStyle: {
    backgroundColor:'#FFF'
  },
  transitionConfig: getSlideFromRightTransitionConfig
})

// Root navigator is a StackNavigator
const AppNavigator = StackNavigator({
  Begin: {screen: BeginStackNavigator},
}, {
  headerMode: 'none',
  cardStyle: {
    backgroundColor:'#FFF'
  }
});

export default AppNavigator;
