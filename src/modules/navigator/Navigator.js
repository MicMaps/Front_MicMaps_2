import React from 'react';
import {SwitchNavigator, StackNavigator} from 'react-navigation';
import getSlideFromRightTransitionConfig from '../../utils/navigatorTranslation';

import IntroViewContainer from '../begin/Intro/IntroViewContainer';
import LandingViewContainer from '../begin/landing/LandingViewContainer';
import LoginViewContainer from '../begin/login/LoginViewContainer';
import SignupViewContainer from '../begin/signup/SignupViewContainer';
import ForgotPasswordView from '../begin/forgot-password/ForgotPasswordView';
import SignupProfileViewContainer from '../begin/profile/SignupProfileViewContainer';
import VerifyOtpViewContainer from '../begin/common/VerifyOtpViewContainer';
import UseLocationViewContainer from '../begin/permissions/UseLocationViewContainer';
import MainViewContainer from '../main/MainViewContainer';
import MicInfoViewContainer from '../mics/info/MicInfoViewContainer';
import ProfileViewContainer from '../profile/ProfileViewContainer';
import UserProfileViewContainer from '../profile/UserProfileViewContainer';
import SettingsViewContainer from '../settings/SettingsViewContainer';
import PermissionsViewContainer from '../settings/permissions/PermissionsViewContainer';
import HowItWorksView from '../settings/how-it-works/HowItWorksView';
import TermsAndConditionsView from '../settings/tos/TermsAndConditionsView';
import SuggestMicViewContainer from '../mics/suggest/SuggestMicViewContainer';
import ConfirmMicViewContainer from '../mics/suggest/confirm/ConfirmMicViewContainer';
import SuggestMicSuccessViewContainer from '../mics/suggest/success/SuggestMicSuccessViewContainer';
import MicSignupView from '../mics/info/MicSignupView';

const BeginStackNavigator = StackNavigator({
  Intro: {screen: IntroViewContainer},
  Landing: {screen: LandingViewContainer},
  Login: {screen: LoginViewContainer},
  Signup: {screen: SignupViewContainer},
  ForgotPassword: {screen: ForgotPasswordView},
  SignupProfile: {screen: SignupProfileViewContainer},
  VerifyOTP: {screen: VerifyOtpViewContainer},
  UseLocation: {screen: UseLocationViewContainer}
}, {
  headerMode: 'none',
  cardStyle: {
    backgroundColor: '#FFF'
  },
  transitionConfig: getSlideFromRightTransitionConfig
});

const MainStackNavigator = StackNavigator({
  Main: {screen: MainViewContainer},
  MicInfo: {screen: MicInfoViewContainer},
  SuggestMic: {screen: SuggestMicViewContainer},
  ConfirmMic: {screen: ConfirmMicViewContainer},
  SuggestMicSuccess: {screen: SuggestMicSuccessViewContainer},
  Profile: {screen: ProfileViewContainer},
  UserProfile: {screen: UserProfileViewContainer},
  Settings: {screen: SettingsViewContainer},
  Permissions: {screen: PermissionsViewContainer},
  HowItWorks: {screen: HowItWorksView},
  TOS: {screen: TermsAndConditionsView},
  MicSignup: {screen: MicSignupView}
}, {
  headerMode: 'none',
  cardStyle: {
    backgroundColor: '#FFF'
  },
  transitionConfig: getSlideFromRightTransitionConfig
});

const AppNavigator = SwitchNavigator(
  {
    Begin: BeginStackNavigator,
    Home: MainStackNavigator
  }, {
    initialRouteName: 'Begin'
  });

export default AppNavigator;
