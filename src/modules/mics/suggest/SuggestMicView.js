import React, {Component} from 'react';
import Moment from 'moment';
import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  Alert
} from 'react-native';
import SuggestMicViewHeader from '../../../components/headers/suggestMicViewHeader';
import GlobalStyles from '../../../styles/globalStyles';
//import MicMapsViewHeader from '../../../components/headers/micMapsViewHeader'
import * as Utils from '../../../utils/utils';
import * as ViewUtils from '../../../utils/viewUtils';
import * as MicActions from '../../../redux/mics/MicActions';
import AboutMicForm from './about/AboutMicForm';
import WhenMicForm from './when/WhenMicForm';
import HostInfoForm from './host-info/HostInfoForm';
import RepeatFrequencyForm from './repeat-frequency/RepeatFrequencyForm';
import {NavigationActions} from 'react-navigation';

class SuggestMicView extends Component {
  static displayName = 'SuggestMicView';

  constructor(props) {
    super(props);
    this.state = {
      name: '',
      venueName: '',
      venueAddress: '',
      venueCity: '',
      cost: '',
      timeOnStage: '',
      parkingDetails: '',
      otherInfo: '',
      currentForm: 'aboutMic',
      micDate: new Date(),
      startTime: new Date(),
      endTime: Moment().add(1, 'hours').toDate(),
      repeatTimes: -1,
      repeatFrequency: '',
      hostName: '',
      hostEmail: '',
      hostPhone: '',
      free: true,
      micType: 'lotto',
      micTypeCustom: '',
      costType: 'free',
      location: '',
      micDays: [],
      signupBy: Moment().format('hh:mm a'),
      displayPhone: true,
      displayEmail: true
    };

    this.onChangeFieldValue = this.onChangeFieldValue.bind(this);
    this.isDataValid = this.isDataValid.bind(this);
    this.moveNext = this.moveNext.bind(this);
    this.onBackPressed = this.onBackPressed.bind(this);
    this.renderForm = this.renderForm.bind(this);
    this.suggestMic = this.suggestMic.bind(this);
    this.onSelectGooglePlace = this.onSelectGooglePlace.bind(this);
    this.loadMic = this.loadMic.bind(this);
  }

  componentDidMount() {

    const user = Utils.toJS(this.props.user);
    let editMic, micId;
    if (this.props.navigation.state.params) {
      editMic = this.props.navigation.state.params.editMic;  
      micId = this.props.navigation.state.params.micId;
    }
    console.log("USER_INFO", user);
    if (user) {
      this.setState({hostEmail: user.email, hostPhone: user.phone});
    }
    if (editMic && micId) {
      this.props.dispatch(MicActions.getMicDetails(micId, response => {
        if(response.status) {
            this.loadMic(response.data);
        }
        else {
            Alert.alert('Failed to load mic, please try again later!')
        }
      }));
    }
  }

  render() {

    const {currentForm} = this.state;
    //console.log('SUGGEST_MIC_VIEW_PROPS', this.props);
    console.log('SUGGEST_MIC_VIEW_STATE', this.state);
    return (
      <View style={styles.container}>
        <View style={styles.topView}>
          <SuggestMicViewHeader
            viewMode={'list'}
            currentForm={currentForm}
            onLeftButtonPress={() => this.onBackPressed()}
            onRightButtonPress={() => this.props.navigation.navigate({routeName: 'Profile'})} />
            {this.renderForm()}
        </View>
        <View style={styles.bottomView}>
          {currentForm === 'repeatFrequency' ? null : (
            <View>
            {this.isDataValid()?null:<Text style={styles.indicatorText}>'*' indicates mandatory fields. </Text>}
            <TouchableOpacity
              style={[GlobalStyles.button, GlobalStyles.buttonGreenSolid, {marginBottom: 0},
                this.isDataValid() ? null : GlobalStyles.buttonGreenSolidDisabled]}
              onPress={() => this.isDataValid() ? this.moveNext() : null}
              activeOpacity={this.isDataValid() ? 0.2 : 1}>
              <Text style={GlobalStyles.buttonGreenSolidText}>NEXT</Text>
            </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    );
  }

  renderForm() {

    const {currentForm} = this.state;
    switch (currentForm) {
      case 'aboutMic':
      default:
        return <AboutMicForm
          onChangeFieldValue={this.onChangeFieldValue}
          formData={this.state}
          onSelectAddressRequest={this.onSelectGooglePlace}/>

      case 'hostInfo':
          return <HostInfoForm
            onChangeFieldValue={this.onChangeFieldValue}
            formData={this.state}/>
      case 'whenMic':
        return <WhenMicForm
          onChangeFieldValue={this.onChangeFieldValue}
          formData={this.state}
          onRepeatFrequencyChangeRequest={() => this.setState({currentForm: 'repeatFrequency'})}/>
      case 'repeatFrequency':
        return <RepeatFrequencyForm
          onChangeFieldValue={this.onChangeFieldValue}
          formData={this.state} />
    }
  }

  isDataValid() {

    const {name, venueName, venueAddress, parkingDetails, timeOnStage, otherInfo, currentForm, micDate, micType, micTypeCustom, signupBy, signupType, noOfSignupSlots, startTime, endTime, repeatTimes, repeatFrequency, hostName, hostPhone, hostEmail, free, cost, costType, costCustom, location, micDays } = this.state;
    if(currentForm === 'aboutMic') return name && venueName && venueAddress && location && timeOnStage && micType && (micType === 'custom' ? micTypeCustom : true) && (micType === 'signup' ? signupType === 'onsite'? signupBy : noOfSignupSlots && noOfSignupSlots > 0 : true) && costType && (costType === 'paid' ? cost : true) && (costType === 'costCustom' ? costCustom : true);
    else if(currentForm === 'hostInfo') return hostPhone && hostEmail && hostName && Utils.isEmailValid(hostEmail) && Utils.isPhoneNumberValid(hostPhone);
    else if(currentForm === 'whenMic') return micDate && startTime && endTime && repeatFrequency 
      && (repeatFrequency === 'custom' ? micDays.length > 0 : (repeatTimes > 0 )) ;
  }

  onChangeFieldValue(key, val) {

    let field = {};

    if(key === 'repeatFrequency') {
      field['repeatTimes'] = -1
    }
    if(key === 'micDate')  {
      this.setState({
        startTime: this.state.micDate,
        endTime: Moment(this.state.micDate).add(1, 'hours').toDate()})
    }
    if(key === 'costType') {
      if(val === 'free')  field['free'] = true;
      else field['free'] = false;
    }

    if(key==='signupBy') {
      console.log("SIGNUP_BY_CHANGED", val);
    }

    field[key] = val;
    this.setState(field)
  }

  onSelectGooglePlace(place) {
    console.log('GOOGLE_PLACE_SELECTED', place)
    const address = place ? (place.name && !place.address.includes(place.name) ? place.name+', ' : '') + place.address : '';
    const location = place ? [place.longitude, place.latitude] : null;
    const venueCity = place? place.addressComponents? (place.addressComponents.locality || place.addressComponents.sublocality || place.addressComponents.sublocality_level_1):'':'';
    console.log(venueCity)
    this.setState({venueAddress: address, location: location, currentForm: 'aboutMic', venueCity:venueCity})
  }

  moveNext() {
    const {currentForm} = this.state;
    if(currentForm === 'aboutMic') this.setState({currentForm: 'hostInfo'})
    else if(currentForm === 'hostInfo') this.setState({currentForm: 'whenMic'})
    else if(currentForm === 'whenMic') this.suggestMic()
  }

  onBackPressed() {

    const {currentForm} = this.state;

    if (currentForm === 'hostInfo') {
        this.setState({currentForm: 'aboutMic'})
    }
    else if (currentForm === 'whenMic') {
        this.setState({currentForm: 'hostInfo'})
    }
    else if (currentForm === 'repeatFrequency') {
        this.setState({currentForm: 'whenMic'})
    }
    else {
        this.props.navigation.dispatch(NavigationActions.back())
    }
  }

  suggestMic() {
    this.props.navigation.navigate({routeName: 'ConfirmMic', params: {micInfo: this.state}});
  }

  loadMic(micData) {

    console.log("MIC_TO_LOAD", micData);
    if(micData) {

      micData.micDate = micData.days.length > 0 ? Moment(micData.days[0]).toDate() : null;
      micData.startTime = Moment(Utils.padZeros(micData.startTime), 'hmm').toDate();
      micData.endTime = Moment(Utils.padZeros(micData.endTime), 'hmm').toDate();
      if(micData.repeatFrequency === 'custom') {
        micData.micDays = micData.days;
      }

      micData.costType = micData.costType ? micData.costType.toLowerCase() : (micData.free ? 'free' : 'paid');
      if(micData.costType === '1 item minimum') micData.costType = 'oneMinimum';
      if(micData.costType === 'custom') micData.costType = 'costCustom';

      micData.timeOnStage = micData.timeOnStage ? micData.timeOnStage.toString() : '';
      micData.repeatTimes = micData.repeatTimes ? micData.repeatTimes.toString(): '';

      if((micData.micType !== 'signup') &&  (micData.micType !== 'lotto') && (micData.micType !== 'booked')) {
        micData.micTypeCustom = micData.micType;
        micData.micType = 'custom';
      }
      if(micData.micType === 'signup') {
        micData.signupBy = micData.signupBy ? micData.signupBy.toString() : '';
        micData.signupType = micData.signupType?micData.signupType: 'onsite';
      }
        

      micData.micEdit = true;
      micData.micId = micData._id;
      micData.micImage = micData.image;
      micData.noOfSignupSlots = micData.noOfSignupSlots? micData.noOfSignupSlots.toString():'';
      this.setState(micData);

    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex:1,
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: '#FFF'
  },
  topView: {
    flex:1,
    flexDirection: 'column',
    alignItems: 'center',
  },
  bottomView: {
    height: 75,
    width: ViewUtils.WINDOW_WIDTH,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
  },
  titleText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#666',
  },
  googlePlacePicker: {
    flex:1,
    width: ViewUtils.WINDOW_WIDTH,
    height: ViewUtils.getContentHeight() - 80
  },
  indicatorText: {
    fontSize:13,
    color:ViewUtils.COLOR_THEME_RED
  }
});

export default SuggestMicView;
