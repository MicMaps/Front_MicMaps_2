import React, {Component} from 'react';
import {
  Text,
  View,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator
} from 'react-native';

import GlobalStyles from '../../styles/globalStyles';
import ProfileViewHeader from '../../components/headers/profileViewHeader';
import PageHeader from '../../components/custom-views/pageHeader';
import AlertBar from '../../components/alert-bar/alertBar';
import Loader from '../../components/modals/loader/loader';
import MicsList from '../../components/mics/list/micsList';
import * as Utils from '../../utils/utils';
import * as ViewUtils from '../../utils/viewUtils';
import * as UserActions from '../../redux/user/UserActions';
import CustomTextInput from '../../components/custom-views/textInput';
import ProfileIconGreen from '../../../images/profilIconGreen2x.png';
import {NavigationActions} from 'react-navigation';
//import GATracker from '../../services/ga';

class ProfileView extends Component {
  static displayName = 'ProfileView';

  constructor(props) {
    super(props);
    this.state = {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      password:'',
      showSuccess: false
    }

    this.saveUserProfile = this.saveUserProfile.bind(this);
    this.deleteMicRequest = this.deleteMicRequest.bind(this);
    this.renderProfileImage = this.renderProfileImage.bind(this);
    this.pickProfileImage = this.pickProfileImage.bind(this);
    this.editMicRequest = this.editMicRequest.bind(this);
  }

  componentDidMount() {

    const user = Utils.toJS(this.props.user);
    if(!user) {
      this.props.navigation.navigate({routeName:'Begin'});
    } else {
      this.setState({
        firstName: user.name && user.name.first ? user.name.first : '',
        lastName: user.name && user.name.last ? user.name.last : '',
        phone: user.phone ? user.phone : '',
        email: user.email ? user.email : '',
        profileImage: user.profileImage ? user.profileImage: null
      })
      this.props.dispatch(UserActions.getUserMicsRequest(user._id))
    }
    //GATracker.trackScreenView('Current User Profile Screen')

  }

  render() {

    const {firstName, lastName, email, phone, password} = this.state;
    const {loading, userMics, mics} = this.props;

    //console.log('PROFILE_VIEW_STATE', this.state);
    //console.log('PROFILE_VIEW_PROPS', this.props);
    return (
      <View style={styles.container}>
        <ProfileViewHeader
          viewMode={'list'}
          onLeftButtonPress={() => Utils.resetNavigation(this.props.navigation, 0, [{routeName: 'Main', params: {viewMode: 'list'}}])}
          onRightButtonPress={() => this.props.navigation.navigate({routeName: 'Settings'})} />
        <ScrollView>
          <View style={styles.contentContainer}>
            <PageHeader title={'PROFILE'} blueLineFill={0}
              renderLogo={() => this.renderProfileImage()}/>
            <CustomTextInput
              label={"First Name"}
              textInputProps={{
                value: firstName,
                onChangeText: (text) => this.setState({firstName: text})
              }}
              noValidation={true}  />
            <CustomTextInput
              label={"Last Name"}
              textInputProps={{
                value: lastName,
                onChangeText: (text) => this.setState({lastName: text})
              }}
              noValidation={true} />
            <CustomTextInput
                label={"Email"}
                textInputProps={{
                  value: email,
                  onChangeText: (text) => this.setState({email: text})
                }}
                noValidation={true}  />
            <TouchableOpacity
              onPress={() => this.saveUserProfile()}
              style={[GlobalStyles.button, GlobalStyles.buttonGreenOutlined]}>
              <Text style={GlobalStyles.buttonGreenOutlinedText}>SAVE PROFILE</Text>
            </TouchableOpacity>
            <PageHeader title={'MY MICS'} style={{marginTop: 5}}/>
            {userMics && userMics.length > 0 ? (
              <MicsList mics={userMics}
                style={styles.micsListContainer}
                onSelectMic={(micId) => this.props.navigation.navigate({routeName:'MicInfo', params:{micId, isUserMic: true, onBackPress: () => this.props.navigation.dispatch(NavigationActions.back())}})}
                deleteMode={true}
                editMode={true}
                onEditMicRequest={this.editMicRequest}
                onDeleteMicRequest={this.deleteMicRequest}
                isUserMic={true} />
            ) : (
              <View style={styles.noMicsContainer}>
                <Text style={styles.noMicsText}>Submitted mics will appear here after they have been approved by MicMaps. You will be able to edit your mic from your profile at any time.</Text>
              </View>
            ) }
          </View>
        </ScrollView>
        {this.renderSuccess()}
        {this.renderLoader()}
      </View>
    );
  }

  renderLoader() {

    const {loading} = this.props;
    return (
      <Loader visibility={loading} />
    )
  }

  renderSuccess() {
    if(this.state.showSuccess) {
      let successMessage = 'Your profile has been saved!';
      if(successMessage) this.successTimer = setTimeout(() => this.setState({showSuccess:false}), 4000);
      return <AlertBar message={successMessage} type='success' />
    } else {
      return null;
    }
  }
  renderProfileImage() {

    const {profileImage, imageStatus} = this.state;
    return (
      <TouchableOpacity
        style={styles.profileImageContainer}
        onPress={() => this.pickProfileImage()}>
        {profileImage && imageStatus !== 'uploading' ? (
          <Image style={{width: 80, height: 80, borderRadius: 40}} source={{uri: profileImage}} />
        ) : null }
        {!profileImage && imageStatus !== 'uploading' ? (
          <Image style={{width: 25, height: 25}} source={ProfileIconGreen} />
        ) : null }
        {(imageStatus === 'uploading') ? (
          <View style={styles.imageUploadIndicatorWrapper}>
            <ActivityIndicator animating={true} style={styles.imageUploadIndicator} size={'large'} />
          </View>
        ) : null }
      </TouchableOpacity>
    )
  }

  pickProfileImage() {
    this.props.dispatch(UserActions.pickProfileImage(response => {
      if(response.status) {
        this.setState({
          imageStatus: response.data.status,
          profileImage: response.data.image
        });
      }
    }))
  }

  saveUserProfile() {

    const {firstName, lastName, email, profileImage} = this.state;
    if(!firstName && !lastName && email ? !Utils.isEmailValid(email) : false) return;
    let user = {}
    if(firstName || lastName) user.name = {}
    if(firstName) user.name.first = firstName
    if(lastName) user.name.last = lastName
    if(email && Utils.isEmailValid(email)) user.email = email
    if(profileImage) user.profileImage = profileImage
    if(Object.keys(user).length > 0) {
      this.props.dispatch(UserActions.updateUserProfileRequest(user, (response) => {
        this.setState({showSuccess:true})
        console.log("Saved..")
      }));
    } else console.log('No user data to update')
  }

  deleteMicRequest(micId) {

    const user = Utils.toJS(this.props.user);
    if(!!user)  {
      this.props.dispatch(UserActions.deleteUserMicRequest(user._id, micId))
    }
  }

  editMicRequest(micId) {
    const user = Utils.toJS(this.props.user);
    if (!!user) {
        this.props.navigation.navigate({routeName:'SuggestMic', params: {editMic: true, micId: micId}});
    }
  }

}

const styles = StyleSheet.create({
  container: {
    flex:1,
    flexDirection: 'column',
    backgroundColor: '#FFF'
  },
  contentContainer: {
    flex:1,
    width: ViewUtils.WINDOW_WIDTH,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#666',
  },
  noMicsContainer: {
    width: ViewUtils.WINDOW_WIDTH,
    height: 80,
    alignItems: 'center',
    justifyContent: 'center',
  },
  micsListContainer: {
    width: ViewUtils.WINDOW_WIDTH,
    flexDirection: 'column',
    alignItems: 'center'
  },
  noMicsText: {
    fontSize: 16,
    fontFamily: ViewUtils.FONT_DOSIS_LIGHT,
    color: ViewUtils.COLOR_THEME_GREEN,
    marginHorizontal:20
  },
  profileImageContainer: {
    position: 'relative',
    width: 80,
    height:80,
    borderRadius: 40,
    backgroundColor: ViewUtils.COLOR_THEME_BLUE,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageUploadIndicatorWrapper: {
    position: 'absolute',
    top:0,
    left:0,
    right:0,
    bottom:0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9,
  },
  imageUploadIndicator: {
    alignSelf: 'center',
    height:90
  },
});

export default ProfileView;
