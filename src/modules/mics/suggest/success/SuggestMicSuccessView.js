import React, {Component} from 'react';
import Moment from 'moment';
import {
  Text,
  View,
  Image,
  Share,
  TouchableOpacity,
  StyleSheet
} from 'react-native';
import * as Utils from '../../../../utils/utils';
import * as ViewUtils from '../../../../utils/viewUtils';
import GlobalStyles from '../../../../styles/globalStyles';
import IconClose from '../../../.././../images/closeIcon2x.png';
import IconSuccess from '../../../../../images/iconSuccess2x.png';
import GATracker from '../../../../services/ga';
import {getConfiguration} from '../../../../utils/configuration';

class SuggestMicSuccessView extends Component {
  static displayName = 'SuggestMicSuccessView';

  constructor(props) {
    super(props)
    this.state = {}

    this.shareMic = this.shareMic.bind(this);
    this.getNextDayToShare = this.getNextDayToShare.bind(this);
  }

  componentDidMount() {
    GATracker.trackScreenView('Mics Suggest Success Screen')
  }

  render() {

      //console.log('SUGGEST_MIC_SUCCESS_VIEW_PROPS', this.props)
    let micDate = this.props.navigation.state.params.micInfo ? this.props.navigation.state.params.micInfo.micDate : null;
    const micEdit = this.props.navigation.state.params.micEdit;
    const successMessage = micEdit?'Your updates have been saved!':'Thanks for submitting your mic! Your mic will be live as soon as it is approved. You can edit or delete it from your profile as soon as it becomes live.';
    return (
      <View style={styles.container}>
        <TouchableOpacity
          onPress={() => Utils.resetNavigation(this.props.navigation, 0, [{routeName: 'Main', params: {viewMode: 'map'}}])}
          style={styles.closeButton}>
          {/* <EvilIcon style={styles.closeIcon} name={'close'} /> */}
          <Image style={{width:16, height:16}} source={IconClose} />
        </TouchableOpacity>
        <View style={styles.contentContainer}>
          <View style={styles.successIconContainer}>
            <Image style={{width: 86, height: 61}} source={IconSuccess} />
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.titleText} >SUCCESS!</Text>
            <Text style={styles.subtitleText} >{successMessage}</Text>
          </View>
          <TouchableOpacity
            onPress={() => this.shareMic()}
            style={[GlobalStyles.button, GlobalStyles.buttonGreenOutlined, {marginTop: 52}]}>
            <Text style={GlobalStyles.buttonGreenOutlinedText}>SHARE</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => Utils.resetNavigation(this.props.navigation, 0, [{routeName: 'MicInfo', params: {viewMode: 'view', micDate: micDate}}])}
            style={[GlobalStyles.button, GlobalStyles.buttonGreenOutlined]}>
            <Text style={GlobalStyles.buttonGreenOutlinedText}>VIEW THIS MIC</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  shareMic() {

    const {micInfo} = this.props.navigation.state.params;

    let message = 'MicMaps is a mobile app that helps comedians find open mics near them';
    if(micInfo) {
      let startTime = Utils.turnMilitaryToDate(micInfo.startTime);
      let endTime = Utils.turnMilitaryToDate(micInfo.endTime);
      message = `Mic name - ${micInfo.name} \nVenue Name: ${micInfo.venueName} \nVenue Address: ${micInfo.venueAddress}`;
      message += `\n Timings: ${Moment(startTime).format('hh:mm a')} - ${Moment(endTime).format('hh:mm a')}`;
    }

    let shareUrl = 'http://www.micmaps.com' ;
    const API_ROOT = getConfiguration('API_ROOT');
    const micDate = this.getNextDayToShare(micInfo);
    if(micInfo && micInfo._id) shareUrl = `${API_ROOT}/mic-static/${micInfo._id}/${micDate}`;
    message += `\n ${shareUrl}`

    Share.share(
      {
        message: message,
        title: micInfo ? micInfo.name: "MicMaps",
        url: shareUrl
      },
      {
        dialogTitle: "Share Mic"
      }
    );
  }

  getNextDayToShare(mic) {
    const micDays = mic.days;
    if(micDays && micDays.length) {
      const nextDay = micDays.find((day) => {
        return Moment(day).diff(Moment(), 'days') >= 0
      })
      if(nextDay) {
        return Moment(nextDay).format('MM-DD-YYYY')
      }
    }
    return Moment().format('MM-DD-YYYY')
  }

  // FacebookService.shareLinkWithShareDialog({
  //   contentType: 'link',
  //   contentUrl: 'https://www.micmaps.me/',
  //   contentDescription: 'Facebook sharing is easy!'
  // }).then(fbSuccess => {
  //
  // }).catch(fbError => {
  //   console.log(fbError);
  // })

}

const styles = StyleSheet.create({
  container: {
    flex:1,
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EEE',
  },
  contentContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
  },
  textContainer: {
    paddingTop: 15,
    flexDirection: 'column',
  },
  successIconContainer: {
    width: 90,
    height: 62,
    marginTop: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleText: {
    fontSize: 24,
    color: ViewUtils.COLOR_THEME_BLUE,
    textAlign: 'center'
  },
  subtitleText: {
    fontSize: 15,
    color: ViewUtils.COLOR_THEME_EXTRA_LIGHT_BLUE,
    fontFamily: ViewUtils.FONT_DOSIS_MEDIUM,
    textAlign: 'center',
    paddingTop: 6,
    paddingHorizontal: 30
  },
  closeButton: {
    position: 'absolute',
    top: 15 + ViewUtils.STATUSBAR_HEIGHT,
    right: 20,
    width:30,
    height: 30,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9
  },
  closeIcon: {
    fontSize: 24,
    color: '#666'
  }

});

export default SuggestMicSuccessView;
