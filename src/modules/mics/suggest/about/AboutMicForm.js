import React, {Component} from 'react';
import Moment from 'moment';
import {
  View,
  StyleSheet,
  Keyboard
} from 'react-native';
import ReactNative from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import Loader from '../../../../components/modals/loader/loader';
import RNGooglePlaces from 'react-native-google-places';
import * as ViewUtils from '../../../../utils/viewUtils';
import PageHeader from '../../../../components/custom-views/pageHeader';
import CustomTextInput from '../../../../components/custom-views/textInput';
import CustomSelectInput from '../../../../components/custom-views/selectInput';
import OptionSelectInput from '../../../../components/custom-views/optionSelectInput';
import {getPlaceDetailsFromGoogle} from '../../../../services/mics';
import DateTimeSelectInput from '../../../../components/custom-views/dateTimeSelectInput';
import GATracker from '../../../../services/ga';

class AboutMicForm extends Component {
  static displayName = 'AboutMicForm';

  constructor(props) {
    super(props);
    this.state = {
      freePaidOptions: [
        {key: 'free', name: 'Free', type: 'select'},
        {key: 'oneMinimum', name: '1 Item Minimum', type: 'select'},
        {key: 'paid', name: 'Paid', type: 'input', inputParams: {keyboardType: 'numeric'}},
        {key: 'costCustom', name: 'Custom', type: 'input', inputParams: {returnKeyType:'done', multiline: false}}
      ],
      micTypeOptions: [
        {key: 'lotto', name: 'Lotto', type: 'select'},
        {key: 'signup', name: 'Signup', type: 'select'},
        {key: 'booked', name: 'Booked', type: 'select'},
        {key: 'custom', name: 'Custom', type: 'input'}
      ],
      signupByOptions: [
        {key: 'onsite', name: 'On Site', type: 'select'},
        {key: 'advanced', name: 'Advanced', type: 'select'}
      ],
      loading: false
    };

    this.onSelectVenueAddressRequest = this.onSelectVenueAddressRequest.bind(this);
    this._scrollToInput = this._scrollToInput.bind(this);
  }

  componentDidMount() {
    GATracker.trackScreenView('Mics Suggest About Screen')
  }

  render() {

     const {onChangeFieldValue, formData, onSelectAddressRequest} = this.props;
    const {name, venueName, venueAddress, cost, costType, costCustom, timeOnStage, parkingDetails, otherInfo,
      hostName, hostPhone, hostEmail, free, micType, signupType, noOfSignupSlots, micTypeCustom, signupBy} = formData;
    const {freePaidOptions, micTypeOptions, signupByOptions, loading} = this.state;
    console.log("ABOUT_MIC_FORM_DATA", formData);
    return (
      <View style={styles.container}>
        <PageHeader
          title={'ADD A MIC'}
          subtitle={'Tell us about your mic'} />
          <KeyboardAwareScrollView ref={ref => {this.scroll = ref}} extraHeight={220}>
            <View style={styles.contentContainer}>
              <CustomTextInput
                label={"Mic Name *"}
                textInputProps={{
                  value: name,
                  ref: (el) => {this._micNameInput = el},
                  onChangeText: (text) => onChangeFieldValue ? onChangeFieldValue('name', text) : '',
                  returnKeyType: 'next',
                  onSubmitEditing: () => this._venueNameInput.focus(),
                  onFocus: this._scrollToInput
                }}
                validationStatus={!!name}
                validationMessage={!name ? 'Please enter mic name' : ''} />
              <CustomTextInput
                label={"Venue Name *"}
                textInputProps={{
                  value: venueName,
                  ref: (el) => {this._venueNameInput = el},
                  returnKeyType: 'next',
                  onChangeText: (text) => onChangeFieldValue ? onChangeFieldValue('venueName', text) : '',
                  onSubmitEditing: () => this.onSelectVenueAddressRequest(),
                  onFocus: this._scrollToInput
                }}
                validationStatus={!!venueName}
                validationMessage={!venueName ? 'Please enter venue name' : ''} />
              <CustomSelectInput
                label={"Venue Address *"}
                textProps={{
                  numberOfLines: 2,
                  ellipsizeMode: 'tail'
                }}
                inputValue={venueAddress}
                onSelectInput={() => this.onSelectVenueAddressRequest()} />

              <OptionSelectInput
                label="Cost *"
                options={freePaidOptions}
                onSelectOption={(option) => onChangeFieldValue ? onChangeFieldValue('costType', option) : null}
                selectedOption={costType}
                formatValue={(val) => {
                  if(val === 'free') return 'Free';
                  else if(val === 'paid') return cost ? 'Paid / $'+cost : '';
                  else if(val === 'costCustom') return costCustom ? costCustom : '';
                  else if(val === 'oneMinimum') return '1 Item Minimum';
                }}
                optionInputs={{
                  paid: cost ? cost : '',
                  costCustom: costCustom ? costCustom : ''
                }}
                onChangeOptionInputs={(key, value) => {
                  if(onChangeFieldValue) {
                    if(key === 'paid') onChangeFieldValue('cost', value)
                    if(key === 'costCustom') onChangeFieldValue('costCustom', value)
                  }
                }} />
              <CustomTextInput
                label={"Time on stage (minutes) *"}
                textInputProps={{
                  value: timeOnStage,
                  ref: (el) => {this._timeOnStageInput = el},
                  onChangeText: (text) => onChangeFieldValue ? onChangeFieldValue('timeOnStage', text) : '',
                  keyboardType: 'numeric',
                  returnKeyType: 'next',
                  onSubmitEditing: () => Keyboard.dismiss(),
                  onFocus: this._scrollToInput
                }}
                validationStatus={!!timeOnStage}
                validationMessage={!timeOnStage ? 'Please enter stage time duration' : ''} />
              <OptionSelectInput
                label="Type *"
                options={micTypeOptions}
                onSelectOption={(option) => onChangeFieldValue ? onChangeFieldValue('micType', option) : null}
                selectedOption={micType}
                formatValue={(val) => {
                  if(val && val === 'custom') return micTypeCustom ? `Custom / ${micTypeCustom}` : '';
                  else {
                    return val ? val.charAt(0).toUpperCase() + val.slice(1) : ''
                  }
                }}
                optionInputs={{
                  custom: micTypeCustom ? micTypeCustom : ''
                }}
                onChangeOptionInputs={(key, value) => {
                  if(onChangeFieldValue) {
                    if(key === 'custom') onChangeFieldValue('micTypeCustom', value);
                  }
                }} />
              {micType === 'signup' ? (
                <OptionSelectInput
                  label={'Sign up type'}
                  options={signupByOptions}
                  onSelectOption={(option) => onChangeFieldValue ? onChangeFieldValue('signupType', option): null}
                  selectedOption={signupType}
                  formatValue={(val) => {
                    return val ? val.charAt(0).toUpperCase() + val.slice(1) : '';
                  }}
                  />

              ) : null}
              {signupType === 'onsite' ? (
                <CustomTextInput
                    label={'Sign up on site by *'}
                    textInputProps={{
                      placeholder: 'What time is sign up?',
                      value: signupBy,
                      ref: (el) => {this._signupBy = el},
                      onChangeText: (text) => onChangeFieldValue ? onChangeFieldValue('signupBy', text) : '',
                      returnKeyType: 'next',
                      onSubmitEditing: () => this._parkingDetailsInput.focus(),
                      onFocus: this._scrollToInput
                    }}
                     />
              ) : null}
              {signupType === 'advanced' ? (
                <CustomTextInput
                    label={'No. of sign up slots *'}
                    textInputProps={{
                      placeholder: 'How many sign ups?',
                      value: noOfSignupSlots,
                      ref: (el) => {this._noOfSignupSlots = el},
                      onChangeText: (text) => onChangeFieldValue ? onChangeFieldValue('noOfSignupSlots', text) : '',
                      keyboardType: 'numeric',
                      returnKeyType: 'next',
                      onSubmitEditing: () => this._parkingDetailsInput.focus(),
                      onFocus: this._scrollToInput
                    }}
                     />
              ) : null}

            <CustomTextInput
                label={"Parking"}
                textInputProps={{
                  placeholder: 'Optional',
                  value: parkingDetails,
                  ref: (el) => {this._parkingDetailsInput = el},
                  onChangeText: (text) => onChangeFieldValue ? onChangeFieldValue('parkingDetails', text) : '',
                  returnKeyType: 'next',
                  onSubmitEditing: () => this._descriptionInput.focus(),
                  onFocus: this._scrollToInput
                }}
                noValidation={true}/>
              <CustomTextInput
                label={"Additional  Information"}
                textInputProps={{
                  value: otherInfo,
                  ref: (el) => {this._descriptionInput = el},
                  onChangeText: (text) => onChangeFieldValue ? onChangeFieldValue('otherInfo', text) : '',
                  placeholder: 'Optional',
                  onFocus: this._scrollToInput,
                  returnKeyType: 'next',
                  onSubmitEditing: () => Keyboard.dismiss(),
                }}
                noValidation={true} />
            </View>
            <Loader visibility={loading} />
          </KeyboardAwareScrollView>
      </View>
    );
  }

  _scrollToInput (event) {
    this.scroll.scrollToFocusedInput(ReactNative.findNodeHandle(event.target));
  }

  onSelectVenueAddressRequest() {

    const {onSelectAddressRequest} = this.props;
    
    RNGooglePlaces.openAutocompleteModal()
    .then((place) => {
      this.setState({loading:true})
      getPlaceDetailsFromGoogle(place.placeID)
      .then((placeDetails)=> {
        if(onSelectAddressRequest) {
          onSelectAddressRequest(mapAddressComponents(place, placeDetails.result))
          this.setState({loading:false})
        }
      })
        
    })
    .catch(error => console.log(error.message));
  }
}

function mapAddressComponents(place, detailedPlace) {
  const addressComponentsConfig = {
    locality:'long_name',
    sublocality:'long_name',
    sublocality_level_1:'long_name',
    neighborhood:'long_name'
  }
  let addressComponents = {
    locality:'',
    sublocality:'',
    sublocality_level_1:'',
    neighborhood:''
  }
  for (let i = 0; i < detailedPlace.address_components.length; i++) {
    let addressType = detailedPlace.address_components[i].types[0];
    if (addressComponentsConfig[addressType]) {
      let val = detailedPlace.address_components[i][addressComponentsConfig[addressType]];
      addressComponents[addressType] = val;
    }
  }
  place['addressComponents'] = addressComponents
  return place;
}

const styles = StyleSheet.create({
  container: {
    flex:1,
    flexDirection: 'column',
    alignItems: 'center',
    paddingTop: 4,
    backgroundColor: '#FFF'
  },
  contentContainer: {
    flex:1,
    flexDirection: 'column',
    alignItems: 'center',
  },
  titleTextContainer: {
    width: ViewUtils.WINDOW_WIDTH,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    marginBottom: 20
  },
  titleText: {
    fontSize: 16,
    color: ViewUtils.COLOR_THEME_GREEN,
  }
});

export default AboutMicForm;
