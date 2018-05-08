import React, {Component} from 'react';
import {
  Text,
  View,
  Image,
  StyleSheet,
  ScrollView
} from 'react-native';

import GeneralBackHeader from '../../components/headers/generalBackHeader';
import PageHeader from '../../components/custom-views/pageHeader';
import Loader from '../../components/modals/loader/loader';
import MicsList from '../../components/mics/list/micsList';
import * as ViewUtils from '../../utils/viewUtils';
import * as UserActions from '../../redux/user/UserActions';
import MicMapsLogo from '../../../images/MicMaps_ICON.png';
import {NavigationActions} from 'react-navigation';
// import GATracker from '../../services/ga';

class UserProfileView extends Component {
  static displayName = 'UserProfileView';

  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      userMics: []
    };

    this.renderProfileImage = this.renderProfileImage.bind(this);
  }

  componentDidMount() {

    const {micOwner} = this.props.navigation.state.params;
    this.props.dispatch(UserActions.getOtherUserMicsRequest(micOwner._id));
    //GATracker.trackScreenView('Other User Profile Screen')
  }

  render() {

    const {userMics} = this.props;
    const {hostName} = this.props.navigation.state.params;

    //console.log('PROFILE_VIEW_STATE', this.state);
    //console.log('PROFILE_VIEW_PROPS', this.props);
    return (
      <View style={styles.container}>
        <GeneralBackHeader 
        navigation={this.props.navigation} />
        <ScrollView>
          <View style={styles.contentContainer}>
           <PageHeader title={`${hostName} Mics`} blueLineFill={0}
              renderLogo={() => this.renderProfileImage()}/> 
            {userMics && userMics.length > 0 ? (
              <MicsList mics={userMics}
              style={styles.micsListContainer}
              onSelectMic={(micId) => this.props.navigation.navigate({routeName: 'MicInfo', params: {micId, isUserMic: false, viewMode: 'details', onBackPress: () => this.props.navigation.dispatch(NavigationActions.back())}})}
               />
            ) : (
              <View style={styles.noMicsContainer}>
                <Text style={styles.noMicsText}>User's Mics.</Text>
              </View>
            ) }
          </View>
        </ScrollView>
        {this.renderLoader()}
      </View>
    );
  }
  renderLoader() {
    const {loading} = this.props;
    console.log(loading)
    return (
      <Loader visibility={loading} />
    )
  }
  renderProfileImage() {
    const {micOwner} = this.props;
    return (
      micOwner && micOwner.profileImage? (
          <Image style={{width: 80, height: 80, borderRadius: 40}} source={{uri: micOwner.profileImage}} />
        ) : (
          <Image style={{width: 80, height: 80}} source={MicMapsLogo} />
        ))
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  micsListContainer: {
    width: ViewUtils.WINDOW_WIDTH,
    flexDirection: 'column',
    alignItems: 'center'
  },
  noMicsText: {
    fontSize: 20,
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
  }
});
export default UserProfileView;