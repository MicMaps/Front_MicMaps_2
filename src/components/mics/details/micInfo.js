import React, { Component } from 'react';
import Moment from 'moment';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import RNGooglePlaces from 'react-native-google-places';
import { getConfiguration } from '../../../utils/configuration';
import {
  Text,
  View,
  Image,
  StyleSheet,
  ScrollView,
  TextInput,
  Keyboard,
  TouchableOpacity,
  Platform,
  DatePickerAndroid,
  TimePickerAndroid,
  Alert
} from 'react-native';
import ReactNative from 'react-native';
import DatePicker from '../../../components/modals/date-picker/datePicker';
import OptionPicker from '../../../components/modals/option-picker/optionPicker';
import ImagePreviewModal from '../../modals/image-preview/imagePreviewModal';
import MicLogo from '../../../../images/micFlatLogo2x.png';
import GlobalStyles from '../../../styles/globalStyles';
import * as ViewUtils from '../../../utils/viewUtils';
import * as Utils from '../../../utils/utils';
import * as Cloudinary from '../../../services/cloudinary';
import EvilIcon from 'react-native-vector-icons/EvilIcons';
import NavigationService from '../../../services/navigationService';
import Ionicon from 'react-native-vector-icons/Ionicons';
import { ShareDialog } from 'react-native-fbsdk';

class MicInfo extends Component {

  constructor(props) {
    super(props);
    this.state = {
      eventDatePickerVisibility: false,
      startTimePickerVisibility: false,
      endTimePickerVisibility: false,
      costPickerVisibility: false,
      freePaidOptions: [
        { key: 'free', name: 'Free', type: 'select' },
        { key: 'oneMinimum', name: '1 Item Minimum', type: 'select' },
        { key: 'paid', name: 'Paid', type: 'input', keyboardType: 'numeric' },
        { key: 'costCustom', name: 'Custom', type: 'input' }
      ],
      optionInputs: {},
      keyboardVisible: false,
      imagePreviewModalVisibility: false
    }

    this.renderLeftContent = this.renderLeftContent.bind(this);
    this.renderRightContent = this.renderRightContent.bind(this);
    this.renderListItem = this.renderListItem.bind(this);
    this.renderLeftTopContent = this.renderLeftTopContent.bind(this);
    this.renderLeftBottomContent = this.renderLeftBottomContent.bind(this);
    this.groupedItemStyle = this.groupedItemStyle.bind(this);
    this.onChangeOptionInput = this.onChangeOptionInput.bind(this);
    this.getFormattedCost = this.getFormattedCost.bind(this);
    this.getFormattedMicType = this.getFormattedMicType.bind(this);
    this.getCustomMicDays = this.getCustomMicDays.bind(this);
    this.onSelectVenueAddressRequest = this.onSelectVenueAddressRequest.bind(this);
    this.openAndroidMicDatePicker = this.openAndroidMicDatePicker.bind(this);
    this.openAndroidMicStartTimePicker = this.openAndroidMicStartTimePicker.bind(this);
    this.openAndroidMicEndTimePicker = this.openAndroidMicEndTimePicker.bind(this);
    this.shareOnFB = this.shareOnFB.bind(this);
    this.getNextDay = this.getNextDay.bind(this);
    this.getNextDayToShare = this.getNextDayToShare.bind(this);
  }

  render() {

    const { style, viewMode } = this.props;
    return viewMode && viewMode === 'confirm' ? (
      <KeyboardAwareScrollView ref={ref => { this.scroll = ref }} extraHeight={200}>
        <View
          style={[styles.container, style]}>
          {this.renderLeftContent()}
          {this.renderRightContent()}
        </View>
      </KeyboardAwareScrollView>
    ) : (
        <View
          style={[styles.container, style]}>
          {this.renderLeftContent()}
          {this.renderRightContent()}
        </View>
      )
  }

  renderLeftContent() {

    const { viewMode, mic, deleteMode, editMode, onDeleteMicRequest, onEditMicRequest, renderMicLogo } = this.props;

    return (
      <View style={styles.leftContentContainer}>
        {!viewMode || viewMode === 'list' ? (
          <View style={styles.leftContent}>
            <View style={styles.logoContainer}>
              <Image style={styles.logoImage} source={mic && mic.image ? { uri: mic.image } : MicLogo} />
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.titleText}>{mic ? mic.name : ''}</Text>
            </View>
            {deleteMode ? (
              <TouchableOpacity
                style={styles.smallButtonContainer}
                onPress={() => mic && onDeleteMicRequest ? onDeleteMicRequest(mic._id) : null}>
                {/* <Image style={{width: 11, height: 15}} source={DeleteIcon} /> */}
                <EvilIcon style={{ width: 18, height: 15, fontSize: 20, color: ViewUtils.COLOR_THEME_BLUE }} name={'trash'} />
                <Text style={styles.smallButtonText}>Delete</Text>
              </TouchableOpacity>
            ) : null}
            {editMode ? (
              <View>
                <TouchableOpacity
                  style={styles.smallButtonContainer}
                  onPress={() => mic && onEditMicRequest ? onEditMicRequest(mic._id) : null}>
                  <EvilIcon style={{ width: 18, height: 15, fontSize: 20, color: ViewUtils.COLOR_THEME_BLUE }} name={'pencil'} />
                  <Text style={styles.smallButtonText}>Edit</Text>
                </TouchableOpacity>
              </View>
            ) : null}
          </View>
        ) : (
            <View style={{ flex: 1 }}>
              {this.renderLeftTopContent()}
              {this.renderLeftBottomContent()}
            </View>
          )}

      </View>
    )
  }

  renderRightContent() {

    const { mic, viewMode, deleteMode, onChangeMicInfo, isUserMic, isSearchResult } = this.props;
    const { eventDatePickerVisibility, startTimePickerVisibility, endTimePickerVisibility, costPickerVisibility, freePaidOptions, optionInputs, imagePreviewModalVisibility } = this.state;

    console.log("MIC_INFO", this.props, this.state);
    let editMode = !!this.props.editMode;

    let micDate = mic && mic.micDate ? mic.micDate : this.props.micDate;
    let startTime = mic && (mic.startTime || mic.startTime == 0) ? mic.startTime : null;
    let endTime = mic && (mic.endTime || mic.endTime == 0) ? mic.endTime : null;
    if (mic && mic._id && !(mic.micEdit)) {
      startTime = Moment(Utils.padZeros(startTime), 'hmm').toDate()
      endTime = Moment(Utils.padZeros(endTime), 'hmm').toDate()
    }
    let micType = mic && mic.micType ? mic.micType.charAt(0).toUpperCase() + mic.micType.slice(1) : '';

    let showHostPhone = isUserMic ? true : !!mic.displayPhone;
    let imageUri = mic && mic.image ? Cloudinary.getOriginalSizeUri(mic.image) : '';

    let repeatFrequency = mic && mic.repeatFrequency ? mic.repeatFrequency : null;
    let repeatTimes = mic && mic.repeatTimes ? mic.repeatTimes : null;
    const futureMicDays = mic && mic.days ? mic.days.filter((day, i) => {
      const showDay = Moment(day).diff(Moment(), 'days') > -1
      if (showDay) {
        return day;
      }
    }) : []

    return (
      <View style={styles.rightContentContainer}>
        {!viewMode || viewMode === 'list' ? (
          <View>
            {this.renderListItem('Location', (mic && mic.venueAddress ? mic.venueAddress : ''))}
            {isSearchResult ?
              this.renderListItem('Next Event Day', this.getNextDay(mic.days))
              : null
            }
            {this.renderListItem('Time', (startTime ? Moment(startTime).format('hh:mma') : ''))}
            {this.renderListItem('Stage Time', (mic && mic.timeOnStage ? Utils.formatMinutes(mic.timeOnStage) : ''))}
            {this.renderListItem('', `${this.getFormattedMicType()} $${mic && mic.cost ? mic.cost : 0}`)}
          </View>
        ) : null}
        {viewMode === 'details' || viewMode === 'confirm' ? (
          <ScrollView>
            <View>
              <View style={GlobalStyles.listItemContainer}>
                <Text style={GlobalStyles.listItemLabel}>{'Venue Name'}</Text>
                <TextInput
                  ref={(el) => { this._venueNameInput = el }}
                  style={styles.textInput}
                  value={mic && mic.venueName ? mic.venueName : ''}
                  onChangeText={(text) => onChangeMicInfo ? onChangeMicInfo('venueName', text) : null}
                  returnKeyType={'next'}
                  onSubmitEditing={() => this.onSelectVenueAddressRequest()}
                  editable={editMode} />
              </View>
              {viewMode && viewMode === 'confirm' ? (
                <TouchableOpacity style={GlobalStyles.listItemContainerAutoGrow}
                  onPress={() => editMode ? this.onSelectVenueAddressRequest() : null}>
                  <Text style={GlobalStyles.listItemLabel}>{'Location'}</Text>
                  <Text style={GlobalStyles.listItemContent}>
                    {mic && mic.venueAddress ? mic.venueAddress : ''}
                  </Text>
                </TouchableOpacity>
              ) : (
                  <View style={GlobalStyles.listItemContainerAutoGrow}>
                    <Text style={GlobalStyles.listItemLabel}>{'Location'}</Text>
                    <Text style={GlobalStyles.listItemContent} selectable={true}>
                      {mic && mic.venueAddress ? mic.venueAddress : ''}
                    </Text>
                  </View>
                )}
              {!isUserMic && micDate ? (
                <TouchableOpacity style={GlobalStyles.listItemContainer}
                  onPress={() => editMode ? (Platform.OS === 'ios' ? this.setState({ eventDatePickerVisibility: true }) : this.openAndroidMicDatePicker(micDate)) : null}>
                  <Text style={GlobalStyles.listItemLabel}>{'Event Day'}</Text>
                  <Text style={GlobalStyles.listItemContent} ellipsizeMode={'tail'} numberOfLines={1}>
                    {micDate ? Moment(micDate).format('dddd, MMM DD, YYYY') : ''}
                  </Text>
                </TouchableOpacity>
              ) : null}
              {!isUserMic && !micDate ? (
                <View style={[GlobalStyles.listItemContainerAutoGrow]}>
                  <Text style={GlobalStyles.listItemLabel}>{'Event Days'}</Text>
                  {mic && futureMicDays && futureMicDays.length ? (
                    futureMicDays.map((day, i) => {
                      return (
                        <Text style={GlobalStyles.listItemContent} ellipsizeMode={'tail'} key={i} numberOfLines={1}>
                          {Moment(day).format('dddd, MMM DD, YYYY')}
                        </Text>
                      )
                    })
                  ) : <Text style={GlobalStyles.listItemContent} ellipsizeMode={'tail'} numberOfLines={1}>
                      {'This mic is over.'}
                    </Text>
                  }
                </View>
              ) : null}
              {isUserMic && repeatFrequency && repeatFrequency !== 'custom' ? (
                <View style={GlobalStyles.listItemContainer}
                  onPress={() => editMode ? (Platform.OS === 'ios' ? this.setState({ eventDatePickerVisibility: true }) : this.openAndroidMicDatePicker(micDate)) : null}>
                  <Text style={GlobalStyles.listItemLabel}>{'Event Day'}</Text>
                  <Text style={GlobalStyles.listItemContent} ellipsizeMode={'tail'} numberOfLines={1}>
                    {mic && mic.days ? Moment(mic.days[0]).format('dddd, MMM DD, YYYY') : ''}
                  </Text>
                </View>
              ) : null}
              {isUserMic && viewMode === 'details' && repeatFrequency && repeatFrequency !== 'custom' && repeatTimes ? (
                <View style={GlobalStyles.listItemContainer}>
                  <Text style={GlobalStyles.listItemLabel}>{'Repeat Fequency'}</Text>
                  <Text style={GlobalStyles.listItemContent} ellipsizeMode={'tail'} numberOfLines={1}>
                    {`${repeatFrequency.charAt(0).toUpperCase() + repeatFrequency.slice(1)} - ${repeatTimes} Times`}
                  </Text>
                </View>
              ) : null}
              {isUserMic && viewMode === 'details' && repeatFrequency && repeatFrequency === 'custom' ? (
                <View style={[GlobalStyles.listItemContainerAutoGrow, { minHeight: 30 }]}>
                  <Text style={GlobalStyles.listItemLabel}>{'Event Days'}</Text>
                  {mic && futureMicDays && futureMicDays.length ? (
                    futureMicDays.map(day => {
                      return (
                        <Text style={GlobalStyles.listItemContent} ellipsizeMode={'tail'} key={`day ${day}`} numberOfLines={1}>
                          {Moment(day).format('dddd, MMM DD, YYYY')}
                        </Text>
                      )
                    })
                  ) : <Text style={GlobalStyles.listItemContent} ellipsizeMode={'tail'} numberOfLines={1}>
                      {'This mic is over.'}
                    </Text>
                  }

                </View>
              ) : null}
              <View style={{ width: 300, flexDirection: 'row' }}>
                <TouchableOpacity style={[GlobalStyles.listItemContainer, this.groupedItemStyle(0, 2)]}
                  onPress={() => editMode ? (Platform.OS === 'ios' ? this.setState({ startTimePickerVisibility: true }) : this.openAndroidMicStartTimePicker(micDate, startTime, endTime)) : null}>
                  <Text style={GlobalStyles.listItemLabel}>{'Start Time'}</Text>
                  <Text style={GlobalStyles.listItemContent} ellipsizeMode={'tail'} numberOfLines={1}>
                    {startTime ? Moment(startTime).format('hh:mm a') : ''}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity style={[GlobalStyles.listItemContainer, this.groupedItemStyle(1, 2)]}
                  onPress={() => editMode ? (Platform.OS === 'ios' ? this.setState({ startTimePickerVisibility: true }) : this.openAndroidMicEndTimePicker(micDate, startTime, endTime)) : null}>
                  <Text style={GlobalStyles.listItemLabel}>{'End Time'}</Text>
                  <Text style={GlobalStyles.listItemContent} ellipsizeMode={'tail'} numberOfLines={1}>
                    {endTime ? Moment(endTime).format('hh:mm a') : ''}
                  </Text>
                </TouchableOpacity>
              </View>
              <View style={GlobalStyles.listItemContainer}>
                <Text style={GlobalStyles.listItemLabel}>{'Time on Stage (Minutes)'}</Text>
                <TextInput
                  ref={(el) => { this._timeOnStageInput = el }}
                  style={styles.textInput}
                  value={mic && mic.timeOnStage ? mic.timeOnStage + '' : ''}
                  onChangeText={(text) => onChangeMicInfo ? onChangeMicInfo('timeOnStage', text) : null}
                  returnKeyType={'next'}
                  keyboardType={'numeric'}
                  onSubmitEditing={() => Keyboard.dismiss()}
                  editable={editMode} />
              </View>
              <TouchableOpacity style={GlobalStyles.listItemContainer}
                onPress={() => editMode ? this.setState({ costPickerVisibility: true }) : null}>
                <Text style={GlobalStyles.listItemLabel}>{'Cost'}</Text>
                <Text style={GlobalStyles.listItemContent} ellipsizeMode={'tail'} numberOfLines={1}>
                  {this.getFormattedCost()}
                </Text>
              </TouchableOpacity>
              {
                viewMode === 'details' ? (
                  <TouchableOpacity style={GlobalStyles.listItemContainer}>
                    <Text style={GlobalStyles.listItemLabel}>{'Mic Type'}</Text>
                    <Text style={GlobalStyles.listItemContent} ellipsizeMode={'tail'} numberOfLines={1}>
                      {this.getFormattedMicType()}
                    </Text>
                  </TouchableOpacity>
                ) : null
              }
              {
                viewMode === 'details' && mic.micType === 'signup' && mic.signupType === 'advanced' ? (
                  <TouchableOpacity style={styles.smallButtonContainer}
                    onPress={() => NavigationService.navigate('MicSignup', { micId: mic._id, isUserMic: isUserMic })}>
                    <EvilIcon style={{ width: 18, height: 15, fontSize: 20, color: ViewUtils.COLOR_THEME_BLUE }} name={'user'} />
                    <Text style={styles.smallButtonText}>

                      Sign up
                  </Text>
                  </TouchableOpacity>
                ) : null
              }
              {showHostPhone && viewMode === 'confirm' ? (
                <View style={GlobalStyles.listItemContainer}>
                  <Text style={GlobalStyles.listItemLabel}>{'Contact Info'}</Text>
                  <TextInput
                    ref={(el) => { this._hostPhoneInput = el }}
                    style={styles.textInput}
                    value={mic && mic.hostPhone ? mic.hostPhone : ''}
                    onChangeText={(text) => onChangeMicInfo ? onChangeMicInfo('hostPhone', text) : null}
                    returnKeyType={'next'}
                    keyboardType={'numeric'}
                    onSubmitEditing={() => this._parkingDetailsInput.focus()}
                    editable={editMode}
                    selectable={true} />
                </View>
              ) : null}
              {showHostPhone && viewMode === 'details' ? (
                <View style={GlobalStyles.listItemContainerAutoGrow}>
                  <Text style={GlobalStyles.listItemLabel}>{'Contact Info'}</Text>
                  <Text
                    ref={(el) => { this._hostPhoneInput = el }}
                    style={GlobalStyles.listItemContent}
                    selectable={true}>
                    {mic && mic.hostPhone ? mic.hostPhone : ''}
                  </Text>

                </View>
              ) : null}
              <View style={GlobalStyles.listItemContainerAutoGrow}>
                <Text style={GlobalStyles.listItemLabel}>{'Parking Details'}</Text>
                {editMode ?
                  <TextInput
                    ref={(el) => { this._parkingDetailsInput = el }}
                    style={[styles.textInput, styles.autoGrowInput]}
                    value={mic && mic.parkingDetails ? mic.parkingDetails : ''}
                    onChangeText={(text) => onChangeMicInfo ? onChangeMicInfo('parkingDetails', text) : null}
                    editable={editMode}
                    returnKeyType={'next'}
                    multiline={true}
                    onSubmitEditing={() => this._otherInfoInput.focus()}
                    placeholder={editMode ? 'Optional' : ''} />
                  : (
                    <Text
                      style={GlobalStyles.listItemContent}>
                      {mic && mic.parkingDetails ? mic.parkingDetails : ''}
                    </Text>
                  )}
              </View>
              <View style={GlobalStyles.listItemContainerAutoGrow}>
                <Text style={GlobalStyles.listItemLabel}>{'Other Notes'}</Text>
                {editMode ?
                  <TextInput
                    ref={(el) => { this._otherInfoInput = el }}
                    style={[styles.textInput, styles.autoGrowInput]}
                    multiline={true}
                    value={mic && mic.otherInfo ? mic.otherInfo : ''}
                    onChangeText={(text) => onChangeMicInfo ? onChangeMicInfo('otherInfo', text) : null}
                    editable={editMode}
                    returnKeyType={'next'}
                    onSubmitEditing={() => Keyboard.dismiss()}
                    placeholder={editMode ? 'Optional' : ''} />
                  : (
                    <Text
                      style={GlobalStyles.listItemContent}>
                      {mic && mic.otherInfo ? mic.otherInfo : ''}
                    </Text>
                  )}
              </View>
            </View>
          </ScrollView>
        ) : null}
        {Platform.os === 'ios' ? (
          <DatePicker
            visibility={eventDatePickerVisibility}
            selectedDate={isUserMic ? (mic && mic.days ? mic.days[0] : new Date()) : (micDate ? micDate : new Date())}
            mode={'date'}
            minimumDate={new Date()}
            onChangeDate={(date) => onChangeMicInfo ? onChangeMicInfo('micDate', date) : null}
            close={() => this.setState({ eventDatePickerVisibility: false })} />
        ) : null}
        {Platform.os === 'ios' ? (
          <DatePicker
            visibility={startTimePickerVisibility}
            selectedDate={startTime}
            mode={'time'}
            minimumDate={Utils.isToday(micDate) ? micDate : null}
            onChangeDate={(time) => onChangeMicInfo ? onChangeMicInfo('startTime', time) : null}
            close={() => this.setState({ startTimePickerVisibility: false })}
            minuteInterval={30} />
        ) : null}
        {Platform.os === 'ios' ? (
          <DatePicker
            visibility={endTimePickerVisibility}
            selectedDate={endTime}
            mode={'time'}
            minimumDate={Moment(startTime).add(1, 'hours').toDate()}
            onChangeDate={(time) => onChangeMicInfo ? onChangeMicInfo('endTime', time) : null}
            close={() => this.setState({ endTimePickerVisibility: false })}
            minuteInterval={30} />
        ) : null}
        <OptionPicker
          visibility={costPickerVisibility}
          options={freePaidOptions}
          onSelectOption={(option) => onChangeMicInfo ? onChangeMicInfo('costType', option) : null}
          selectedOption={mic.costType}
          onChangeOptionInput={this.onChangeOptionInput}
          optionInputs={{ paid: mic.cost, costCustom: mic.costCustom }}
          close={() => this.setState({ costPickerVisibility: false })} />
        <ImagePreviewModal visibility={imagePreviewModalVisibility} imageUri={imageUri} onClose={() => this.setState({ imagePreviewModalVisibility: false })} />
      </View>
    )
  }

  getFormattedCost() {

    const { mic } = this.props;
    const { free, cost, costType, costCustom } = mic ? mic : {};
    let type = costType ? costType.toLowerCase() : '';
    if (type === 'free') return 'Free';
    else if (type === 'paid') return 'Paid/$' + cost;
    else if (type === 'costcustom' || type === 'custom') return costCustom ? costCustom : '';
    else if (type === 'oneminimum' || type === '1 item minimum') return '1 Item Minimum';
    else return '';
  }

  getFormattedMicType() {

    const { mic } = this.props;
    let micTypeInfo = mic && mic.micType ? mic.micType : '';
    return micTypeInfo.charAt(0).toUpperCase() + micTypeInfo.slice(1);
  }

  onSelectVenueAddressRequest() {

    const { onChangeMicInfo } = this.props;
    RNGooglePlaces.openAutocompleteModal()
      .then((place) => {
        let address = place ? (place.name && !place.address.includes(place.name) ? place.name + ', ' : '') + place.address : '';
        let location = place ? [place.longitude, place.latitude] : null;
        if (onChangeMicInfo) {
          onChangeMicInfo('venueAddress', address);
          onChangeMicInfo('location', location);
        }
      })
      .catch(error => console.log(error.message));
  }

  getCustomMicDays() {

    const { mic } = this.props;
    let micDays = [];
    if (mic && mic.days) {
      mic.days.map(day => {
        micDays.push(Moment(day).format('dddd, MMM DD, YYYY'));
      })
    }
    return micDays.join(",\n");
  }

  onChangeOptionInput(key, value) {

    const { onChangeMicInfo } = this.props;
    if (onChangeMicInfo) {
      if (key === 'paid') onChangeMicInfo('cost', value)
      else if (key === 'costCustom') onChangeMicInfo('costCustom', value)
    }

  }

  renderGroupedListItem(items) {
    //console.log('GROUPED_LIST_ITEMS', items)
    return (
      <View style={{ width: 300, flexDirection: 'row' }}>
        {items.map((item, idx) => {
          return (
            <View style={[GlobalStyles.listItemContainer, groupedItemStyle(idx, items.length)]} key={idx}>
              <Text style={GlobalStyles.listItemLabel}>{item.name}</Text>
              <Text style={GlobalStyles.listItemContent} ellipsizeMode={'tail'} numberOfLines={1}>
                {item.value}
              </Text>
            </View>
          )
        })}
      </View>
    )
  }

  renderListItem(name, value) {
    return (
      <View style={GlobalStyles.listItemContainer}>
        <Text style={GlobalStyles.listItemLabel}>{name}</Text>
        <Text style={GlobalStyles.listItemContent} ellipsizeMode={'tail'} numberOfLines={1}>
          {value}
        </Text>
      </View>
    )
  }

  renderLeftTopContent() {

    const { mic, renderMicLogo, viewMode, showHostInfo } = this.props;
    return (
      <View style={styles.leftTopContainer}>
        <View style={styles.leftContent}>
          <View style={styles.logoContainer}>
            {renderMicLogo && viewMode === 'confirm' ? renderMicLogo() : (
              <TouchableOpacity onPress={() => this.setState({ imagePreviewModalVisibility: true })}>
                <Image style={styles.logoImage}
                  source={mic && mic.image ? { uri: mic.image } : MicLogo}
                />
              </TouchableOpacity>

            )}
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.titleText}>{mic ? mic.name : ''}</Text>
          </View>
          {}
          <TouchableOpacity
            style={[styles.profileButton]}
            activeOpacity={0.5}
            onPress={() => showHostInfo()}>
            <Text style={styles.labelText}>Host:</Text>

            <Text style={styles.subtitleText}>{mic ? mic.hostName : ''}</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  renderLeftBottomContent() {

    const { mic, viewMode } = this.props;
    console.log(mic)
    const likesCount = mic ? mic.noOfThumbsUp : 0;
    const dislikesCount = mic ? mic.noOfThumbsDown : 0;
    return (
      <View style={styles.leftBottomContainer}>
        {viewMode === 'details' ? (
          <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center' }}>
            <TouchableOpacity
              activeOpacity={0.5}
              style={[GlobalStyles.buttonBlueOutlined, styles.fbButton, { marginBottom: 0 }]}
              onPress={() => { this.shareOnFB(mic._id) }}>
              <Text style={[GlobalStyles.buttonBlueOutlinedText, { fontSize: 18 }]}>
                <Ionicon name="logo-facebook" style={{ fontSize: 20 }}></Ionicon>  SHARE </Text>
            </TouchableOpacity>
            <View style={styles.dislikesCountContainer}>
              <View style={styles.likesDislikesContent}>
                <Text style={styles.labelText}>Dislikes</Text>
                <Text style={styles.dislikesCountText}>{dislikesCount}</Text>
              </View>
            </View>
            <View style={styles.likesCountContainer}>
              <View style={styles.likesDislikesContent}>
                <Text style={styles.labelText}>Likes</Text>
                <Text style={styles.likesCountText}>{likesCount}</Text>
              </View>
            </View>


          </View>
        ) : null}
      </View>
    )
  }


  openAndroidMicDatePicker(micDate) {

    const { mic, onChangeMicInfo, isUserMic } = this.props;
    let options = { mode: 'calendar' };
    options.date = isUserMic ? (mic && mic.days ? mic.days[0] : new Date()) : (micDate ? micDate : new Date())
    options.minDate = new Date();

    DatePickerAndroid.open(options).then((res) => {
      if (res.action !== DatePickerAndroid.dismissedAction) {
        if (onChangeMicInfo) onChangeMicInfo('micDate', new Date(res.year, res.month, res.day));
      }
    }).catch(() => {
      console.warn('Cannot open date picker');
    });
  }

  openAndroidMicStartTimePicker(micDate, startTime, endTime) {

    const { mic, onChangeMicInfo } = this.props;
    let options = { mode: 'calendar' };
    options.date = startTime;
    options.minDate = Utils.isToday(micDate) ? micDate : null;

    TimePickerAndroid.open(options).then((res) => {
      if (res.action !== TimePickerAndroid.dismissedAction) {
        let time = Moment().set({ 'hour': res.hour, 'minute': res.minute }).toDate();
        if (onChangeMicInfo) onChangeMicInfo('startTime', time)
      }
    }).catch(() => {
      console.warn('Cannot open time picker');
    });
  }

  openAndroidMicEndTimePicker(micDate, startTime, endTime) {

    const { mic, onChangeMicInfo } = this.props;
    let options = { mode: 'calendar' };
    options.date = endTime;
    options.minDate = Moment(startTime).add(1, 'hours').toDate();

    TimePickerAndroid.open(options).then((res) => {
      if (res.action !== TimePickerAndroid.dismissedAction) {
        let time = Moment().set({ 'hour': res.hour, 'minute': res.minute }).toDate();
        if (onChangeMicInfo) onChangeMicInfo('endTime', time)
      }
    }).catch(() => {
      console.warn('Cannot open time picker');
    });
  }

  groupedItemStyle(index, itemsCount) {
    return {
      marginLeft: index == 0 ? 0 : 10,
      width: ((ViewUtils.WINDOW_WIDTH * 0.6) - (itemsCount * 10) - 10) / itemsCount
    }
  }

  getNextDay(days) {
    if (days && days.length) {
      const nextDay = days.find((day) => {
        return Moment(day).diff(Moment(), 'days') >= 0
      })
      if (!nextDay) {
        return 'The mic is over.'
      } else {
        return Moment(nextDay).format('dddd, MMM DD, YYYY')
      }
    } else {
      return 'The mic is over.'
    }
  }

  getNextDayToShare() {
    const mic = this.props.mic;
    const micDate = mic && mic.micDate ? mic.micDate : this.props.micDate;
    const micDays = mic.days;
    if(micDate) {
      return Moment(micDate).format('MM-DD-YYYY')
    }
    if(micDays && micDays.length) {
      const nextDay = days.find((day) => {
        return Moment(day).diff(Moment(), 'days') >= 0
      })
      if(nextDay) {
        return Moment(nextDay).format('MM-DD-YYYY')
      }
    }
    return Moment().format('MM-DD-YYYY')
  }

  shareOnFB(micId) {
    const API_ROOT = getConfiguration('API_ROOT');
    const shareLinkContent = {
      contentType: 'link',
      contentUrl: API_ROOT + "/mic-static/"+ micId + "/" + this.getNextDayToShare()
    };
    ShareDialog.canShow(shareLinkContent).then(
      function (canShow) {
        if (canShow) {
          return ShareDialog.show(shareLinkContent);
        }
      }
    ).then(
      function (result) {
        if (result.isCancelled) {
          console.log(result)
          Alert.alert('', 'Facebook Share was cancelled.', [{ text: 'OK', onPress: () => console.log('OK Pressed') }]);
        } else {
          Alert.alert('', 'Facebook Share was successful.', [{ text: 'OK', onPress: () => console.log('OK Pressed') }]);
        }
      },
      function (error) {
        Alert.alert('', 'Facebook Share failed with error: ' + error.message, [{ text: 'OK', onPress: () => console.log('OK Pressed') }]);
      }
    );
  }

}

const styles = StyleSheet.create({
  container: {
    minHeight: 160,
    width: ViewUtils.WINDOW_WIDTH,
    flexDirection: 'row',
    paddingHorizontal: 25,
  },
  leftContentContainer: {
    width: ViewUtils.WINDOW_WIDTH * 0.4 - 28,
    flexDirection: 'column',
    justifyContent: 'center',
  },
  leftContent: {
    width: ViewUtils.WINDOW_WIDTH * 0.4 - 28,
    flexDirection: 'column',
    alignItems: 'center',
  },
  leftTopContainer: {
    flex: 0.4,
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  leftBottomContainer: {
    flex: 0.6,
    position: 'relative',
    flexDirection: 'column',
    alignItems: 'center'
  },
  likesCountContainer: {
    position: 'absolute',
    bottom: 90,
    width: 82,
    height: 82,
    borderRadius: 41,
    borderWidth: 3,
    borderColor: ViewUtils.COLOR_THEME_GREEN,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF'
  },
  dislikesCountContainer: {
    position: 'absolute',
    bottom: 40,
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 1.5,
    borderColor: ViewUtils.COLOR_THEME_RED,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF'
  },
  likesDislikesContent: {
    flexDirection: 'column'
  },
  fbButton: {
    position: 'absolute',
    bottom: 0,
    borderRadius: 2,
    borderWidth: 1,
    borderColor: ViewUtils.COLOR_THEME_DARK_BLUE,
    paddingHorizontal: 10,
    paddingVertical: 2,
    alignItems: 'center',
    justifyContent: 'center'
  },
  rightContentContainer: {
    width: ViewUtils.WINDOW_WIDTH * 0.6 - 28,
    flexDirection: 'column',
    marginLeft: 15
  },
  likesCountText: {
    fontSize: 26,
    fontFamily: ViewUtils.FONT_DOSIS_BOLD,
    color: ViewUtils.COLOR_THEME_GREEN,
    lineHeight: 26,
    textAlign: 'center'
  },
  dislikesCountText: {
    fontSize: 26,
    fontFamily: ViewUtils.FONT_DOSIS_BOLD,
    color: ViewUtils.COLOR_THEME_RED,
    lineHeight: 26,
    textAlign: 'center'
  },
  logoContainer: {
    width: 68,
    height: 68
  },
  logoImage: {
    width: 68,
    height: 68,
    borderRadius: 34,
    overflow: 'hidden'
  },
  textContainer: {
    marginTop: 4,
    flexDirection: 'row',
    justifyContent: 'center'
  },
  titleText: {
    fontSize: 16,
    color: ViewUtils.COLOR_THEME_BLUE,
    flexWrap: 'wrap',
    textAlign: 'center',
    fontWeight: 'normal'
  },
  labelText: {
    fontSize: 13,
    color: ViewUtils.COLOR_THEME_BLUE,
    textAlign: 'center',
    fontWeight: 'normal'
  },
  subtitleText: {
    fontSize: 13,
    color: ViewUtils.COLOR_THEME_BLUE,
    flexWrap: 'wrap',
    textAlign: 'center',
    fontWeight: '600'
  },
  smallButtonContainer: {
    height: 23,
    width: 75,
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: ViewUtils.COLOR_THEME_GREEN,
    borderRadius: 3,
    marginTop: 8
  },
  smallButtonText: {
    color: ViewUtils.COLOR_THEME_BLUE,
    fontSize: 12,
    fontFamily: ViewUtils.FONT_DOSIS_MEDIUM,
    paddingLeft: 5
  },
  textInput: {
    color: ViewUtils.COLOR_THEME_BLUE,
    fontSize: 14,
    height: 40,
    paddingTop: Platform.OS === 'ios' ? 0 : 10,
    paddingBottom: Platform.OS === 'ios' ? 0 : 10,
    marginTop: Platform.OS === 'ios' ? -11 : -11,
    marginLeft: Platform.OS === 'ios' ? 0 : -4,
    fontFamily: ViewUtils.FONT_DOSIS_MEDIUM,
  },
  profileButton: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
    borderColor: 'transparent',
    marginTop: 15
  },
  autoGrowInput: {
    marginTop: Platform.OS === 'ios' ? 0 : -11
  }
});

export default MicInfo;
