import React, {Component} from 'react';
import Moment from 'moment';
import {
  Text,
  View,
  Image,
  Alert,
  ActivityIndicator,
  TouchableOpacity,
  StyleSheet
} from 'react-native';
import * as Utils from '../../../../utils/utils';
import * as ViewUtils from '../../../../utils/viewUtils';
import * as UserActions from '../../../../redux/user/UserActions';
import * as MicActions from '../../../../redux/mics/MicActions';
import * as Cloudinary from '../../../../services/cloudinary';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import MicLogo from '../../../../../images/micFlatLogo2x.png';
import GlobalStyles from '../../../../styles/globalStyles';
import MicMapsViewHeader from '../../../../components/headers/micMapsViewHeader';
import PageHeader from '../../../../components/custom-views/pageHeader';
import MicInfo from '../../../../components/mics/details/micInfo';
import Loader from '../../../../components/modals/loader/loader';
import AlertBar from '../../../../components/alert-bar/alertBar';
import GATracker from '../../../../services/ga';

class ConfirmMicView extends Component {
  static displayName = 'ConfirmMicView';

  constructor(props) {
    super(props)
    this.state = {}

    this.publishMic = this.publishMic.bind(this);
    this.renderError = this.renderError.bind(this);
    this.onChangeMicInfo = this.onChangeMicInfo.bind(this);
    this.pickMicImage = this.pickMicImage.bind(this);
    this.renderMicLogo = this.renderMicLogo.bind(this);
  }

  componentDidMount() {

    const micInfo = this.props.navigation.state.params.micInfo;
    if (micInfo) {
        this.setState(micInfo);
    }
    GATracker.trackScreenView('Mics Suggest Confirm Screen')
  }

  render() {

    const {name, venueName, venueAddress, micDate, startTime, endTime, timeOnStage, cost, parkingDetails, otherInfo, hostName, micEdit, imageStatus} = this.state;
    const loading = Utils.toJS(this.props.loading);
    const micInfo = this.props.navigation.state.params.micInfo;
    console.log('CONFIRM_MIC_VIEW_STATE', this.state);
    //alert(JSON.stringify(loading))
    return (
      <View style={styles.container}>
        <MicMapsViewHeader viewMode={'list'} 
        onLeftButtonPress={() => Utils.resetNavigation(this.props.navigation, 0, [{routeName: 'Main', params: {viewMode: 'list'}}])} 
        onRightButtonPress={() => this.props.navigation.navigate({routeName: 'Profile'})}
        isChildPage={true} 
        navigation = {this.props.navigation} />
        <View style={styles.topView}>
          <PageHeader title={'CONFIRM YOUR MIC?'} />
            <MicInfo mic={this.state} viewMode={'confirm'} onChangeMicInfo={this.onChangeMicInfo} editMode={true} renderMicLogo={this.renderMicLogo} scroll={this.scroll}/>
        </View>
        <View style={styles.bottomView}>
          <TouchableOpacity
            style={[GlobalStyles.button, GlobalStyles.buttonGreenSolid, {marginBottom: 0}, (imageStatus === 'uploading') ? GlobalStyles.buttonGreenSolidDisabled : null]}
            onPress={() => (imageStatus !== 'uploading') ? this.publishMic() : null}
            activeOpacity={0.5}>
            <Text style={GlobalStyles.buttonGreenSolidText}>{micEdit ? 'UPDATE' : 'SUBMIT'}</Text>
          </TouchableOpacity>
        </View>

        <Loader visibility={loading} />
        {this.renderError()}
      </View>
    );
  }

  renderError() {

    const {error} = this.props;
    let errorMessage = error ? (error.message ? JSON.parse(error.message).error : 'Something went wrong, try again') : '';
    if(errorMessage) setTimeout(() => this.props.dispatch(MicActions.resetError()), 3000)
    return <AlertBar message={errorMessage} type='error' position={'top'} />

  }

  onChangeMicInfo(key, value) {

    let data = {};

    if(key === 'costType') {
      if(value === 'free')  data['free'] = true;
      else data['free'] = false;
    }
    data[key] = value;


    console.log("ON_CHANGE_MIC_INFO", key, value);
    this.setState(data);
  }

  renderMicLogo() {
    const {micImage, imageStatus} = this.state;
    return (
      <TouchableOpacity
        style={styles.micImageContainer}
        onPress={() => (imageStatus !== 'uploading') ? this.pickMicImage() : null}>
        <View style={styles.micImageWrapper}>
        {micImage && imageStatus !== 'uploading' ? (
          <Image style={{width: 68, height: 68}} source={{uri: micImage}} />
        ) : null }
        {!micImage && imageStatus !== 'uploading' ? (
          <Image style={{width: 68, height: 68}} source={MicLogo} />
        ) : null }
      </View>
      {(imageStatus === 'uploading') ? (
        <View style={styles.imageUploadIndicatorWrapper}>
          <ActivityIndicator animating={true} style={styles.imageUploadIndicator} size={'large'} color={'#FFF'}/>
        </View>
      ) : null }
      {(imageStatus !== 'uploading') ? (
        <View style={styles.micImageEditIcon}>
          <MaterialIcon style={{fontSize: 16, color: ViewUtils.COLOR_THEME_BLUE}} name='create'/>
        </View>
      ) : null}

      </TouchableOpacity>
    )
  }

  pickMicImage() {
    this.props.dispatch(MicActions.pickMicImage(response => {
      if(response.status) {

        let newState = {imageStatus: response.data.status};
        if(response.data.status === 'uploaded') {
          let imageUri = Cloudinary.getResizedImageUrl(response.data.cloud, 'extra_small');
          console.log("MIC_IMAGE_URI", imageUri);
          newState.micImage = imageUri;
        }
        this.setState(newState);
      }
    }))
  }

  publishMic() {

    const {name, venueName, venueAddress, venueCity, parkingDetails, timeOnStage, otherInfo, cost,
      micDate, startTime, endTime, repeatTimes, repeatFrequency, micDays, hostName, hostPhone, hostEmail, 
      free, location, micType, micTypeCustom, signupBy, costType, costCustom, micEdit, micId, displayEmail, 
      displayPhone, micImage, signupType, noOfSignupSlots} = this.state;

    let suggestMicData = {
      name, venueName, venueAddress, venueCity, parkingDetails, otherInfo, repeatFrequency, hostName, hostPhone, hostEmail, free, micType, signupBy, displayEmail, displayPhone, signupType 
    }
    suggestMicData.timeOnStage = parseInt(timeOnStage)
    suggestMicData.repeatTimes = parseInt(repeatTimes)

    if(micType === 'custom') suggestMicData.micType = micTypeCustom;
    if(costType === 'free') {
      suggestMicData.costType = 'Free';
    }
    else if(costType === 'paid') {
      suggestMicData.costType = 'Paid';
      suggestMicData.cost = (cost ? cost.trim() : 0);
    } else if(costType === 'oneMinimum') {
      suggestMicData.costType = '1 item minimum';
    } else if(costType === 'costCustom') {
      suggestMicData.costType = 'Custom';
      suggestMicData.costCustom = (costCustom ? costCustom.trim() : '');
    }

    suggestMicData.days = micDays;
    if(repeatFrequency !== 'custom') {
      suggestMicData.days = [];
      for(let i=0; i < suggestMicData.repeatTimes; i++) {
        let dt = Moment([micDate.getFullYear(), micDate.getMonth(), micDate.getDate()]);
        let nextDate = repeatFrequency === 'weekly' ? dt.add(i*7, 'days').format() : dt.add(i, 'months').format();
        suggestMicData.days.push(nextDate);
      }
    }


    suggestMicData.startTime = parseInt(Utils.turnMilitary(startTime));
    suggestMicData.endTime = parseInt(Utils.turnMilitary(endTime));

    suggestMicData.location = location;

    if(micImage) suggestMicData.image = micImage;

    //alert(JSON.stringify(suggestMicData));
    // return;
    console.log('SUGGEST_MIC_DATA', suggestMicData);

    if(noOfSignupSlots) {
      suggestMicData.noOfSignupSlots = noOfSignupSlots;
    }

    if(micEdit) {
      const user = Utils.toJS(this.props.user);
      suggestMicData.id = this.state._id;
      this.props.dispatch(UserActions.updateUserMic(user._id, suggestMicData, (response) => {
      //console.log('UPDATE_MIC_RESPONSE', response, suggestMicData);
      //alert(JSON.stringify(response))
        if(response.status) {
          this.props.dispatch(MicActions.setLoadingStatus(false));
          response.data.micDate = micDate;
          setTimeout(() => this.props.navigation.navigate({routeName: 'SuggestMicSuccess', params: {micInfo: response.data, micEdit: true}}), 400);
        } else {
          Alert.alert('Something went wrong, please try again later!')
        }
      }))
    } else {
      this.props.dispatch(MicActions.suggestMicRequest(suggestMicData, (response) => {
        if(response.status) {
          console.log('SUGGEST_MIC_RESPONSE', response, suggestMicData);
          this.props.dispatch(MicActions.setLoadingStatus(false));
          response.data.micDate = micDate;
          setTimeout(() => this.props.navigation.navigate({routeName: 'SuggestMicSuccess', params: {micInfo: response.data}}), 400);
        } else {
          Alert.alert('Something went wrong, please try again later!')
        }
      }))
    }

  }

}

const styles = StyleSheet.create({
  container: {
    flex:1,
    flexDirection: 'column',
    backgroundColor: '#EEE'
  },
  titleTextContainer: {
    width: ViewUtils.WINDOW_WIDTH,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    marginBottom: 15
  },
  titleText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#666',
  },
  headerTitleText: {
    fontSize: 16,
    color: '#444'
  },
  topView: {
    flex:1,
    width: ViewUtils.WINDOW_WIDTH,
    alignItems: 'center'
  },
  bottomView: {
    height: 65,
    width: ViewUtils.WINDOW_WIDTH,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
  },
  micImageContainer: {
    position: 'relative',
    width: 68,
    height:68,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  micImageWrapper: {
    position: 'relative',
    borderRadius: 34,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    zIndex:9
  },
  imageUploadIndicatorWrapper: {
    position: 'absolute',
    top:6,
    left:6,
    right:6,
    bottom:6,
    borderRadius: 28,
    backgroundColor: ViewUtils.COLOR_THEME_BLUE,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',

  },
  imageUploadIndicator: {
    alignSelf: 'center',
    height:90,
    marginLeft:3,
    marginTop:3
  },
  micImageEditIcon: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    width: 26,
    height: 26,
    borderRadius: 14,
    backgroundColor: '#FFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 3,
    zIndex:9,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  }
});

export default ConfirmMicView;
