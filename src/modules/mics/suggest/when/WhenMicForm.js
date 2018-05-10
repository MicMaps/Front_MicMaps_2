import React, {Component} from 'react';
import Moment from 'moment';
import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet
} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import * as Utils from '../../../../utils/utils';
import * as ViewUtils from '../../../../utils/viewUtils';
import EvilIcon from 'react-native-vector-icons/EvilIcons';
import CalendarPicker from 'react-native-calendar-picker';
import PageHeader from '../../../../components/custom-views/pageHeader';
import DateTimeSelectInput from '../../../../components/custom-views/dateTimeSelectInput';
import NumberSelectInput from '../../../../components/custom-views/numberSelectInput';
import OptionSelectInput from '../../../../components/custom-views/optionSelectInput';
import GATracker from '../../../../services/ga';

const repeatFrequencyMap = {
  weekly: 'Weekly',
  monthly: 'Monthly',
  custom: 'Custom'
}

class WhenMicForm extends Component {
  static displayName = 'WhenMicForm';

  constructor(props) {
    super(props);
    this.state = {
      date: new Date(),
      dates: [],
      repeatOptions: [
        {key: 'weekly', name: 'Weekly', type: 'select'},
        {key: 'monthly', name: 'Monthly', type: 'select'},
        {key: 'custom', name: 'Custom', type: 'select'},
      ]
    }

    this.getRepeatTimeRange = this.getRepeatTimeRange.bind(this);
    this.onSelectDate = this.onSelectDate.bind(this);
    this.removeDate = this.removeDate.bind(this);
    this._scrollToEnd = this._scrollToEnd.bind(this);
  }

  componentDidMount() {

    const {formData} = this.props;
    let micDates = formData && formData.micDays ? formData.micDays : [];
    this.setState({dates: micDates});
    GATracker.trackScreenView('Mics Suggest When Screen');
  }

  render() {

    const {datePickerVisibility, repeatOptions, dates, date} = this.state;
    const {formData, onChangeFieldValue, onRepeatFrequencyChangeRequest} = this.props;
    const {micDate, startTime, endTime, repeatTimes, repeatFrequency, micDays} = formData;

    //console.log("WHEN_MIC_FORM_STATE", this.state);
    //console.log("WHEN_MIC_FORM_PROPS", this.props);
    return (
      <View style={styles.container}>
        <PageHeader
          title={'ADD A MIC'}
          subtitle={'When is your mic?'} />
          <KeyboardAwareScrollView ref={ref => {this.scroll = ref}}>
            <View style={styles.contentContainer}>
              <DateTimeSelectInput
                style={{marginTop: -4}}
                label={'Date *'}
                datePickerProps={{
                  date: micDate,
                  mode: "date",
                  minuteInterval: 30,
                  minimumDate: new Date(),
                  onDateChange: (date) => onChangeFieldValue ? onChangeFieldValue('micDate', date) : null
                }} />
              <DateTimeSelectInput
                label={'Start *'}
                datePickerProps={{
                  date: startTime,
                  mode: "time",
                  minimumDate: Utils.isToday(micDate) ? micDate : null,
                  minuteInterval: 30,
                  onDateChange: (time) => onChangeFieldValue ? onChangeFieldValue('startTime', time) : null
                }}
                dropDownStyle={{height: 150}} />
              <DateTimeSelectInput
                label={'End *'}
                datePickerProps={{
                  date: endTime,
                  mode: "time",
                  minuteInterval: 30,
                  // minimumDate: Moment(startTime).add(1, 'hours').toDate(),
                  onDateChange: (time) => onChangeFieldValue ? onChangeFieldValue('endTime', time) : null
                }}
                dropDownStyle={{height: 150}} />
                <OptionSelectInput
                  label="Repeats *"
                  options={repeatOptions}
                  onSelectOption={(option) => {
                    onChangeFieldValue ? onChangeFieldValue('repeatFrequency', option) : null
                    this._scrollToEnd();
                  }}
                  selectedOption={repeatFrequency}
                formatValue={(val) => repeatFrequencyMap[val]} />
                {repeatFrequency && repeatFrequency !== 'custom' ? (
                <NumberSelectInput
                  label={'End Repeats *'}
                  numberPickerProps={{
                    onValueChange: (val) => onChangeFieldValue ? onChangeFieldValue('repeatTimes', val) : null,
                    selectedValue: repeatTimes
                  }}
                  numberArray={this.getRepeatTimeRange()}
                  dropDownStyle={{height: 150}}
                  formatValue={(val) => repeatTimes && repeatTimes > 0 ? `After ${val} ${ repeatFrequency === 'weekly' ? 'Weeks' : 'monthly' ? 'Months' : ''}` : 'Select a value'} />
              ) : null }
              {repeatFrequency === 'custom' ? (
                <View style={styles.dateSelectorContainer}>
                  <View style={styles.textContainer}>
                    <Text style={styles.labelText}>Select Custom Dates *</Text>
                  </View>
                  <View style={styles.dateTagsContainer}>
                    {dates.map((dt, idx) => {
                      return (
                        <View style={styles.dateTag} key={idx}>
                          <Text style={styles.dateText}>{Moment(dt).format('DD MMM')}</Text>
                          <TouchableOpacity onPress={() => this.removeDate(dt)}>
                            <EvilIcon style={styles.tagCloseIcon} name={'close'} />
                          </TouchableOpacity>
                        </View>
                      )
                    })}
                  </View>
                  {
                    dates.length === 24?
                      <View style={styles.textContainer}>
                        <Text style={styles.errorText}>You have selected maximum number of custom dates.</Text>
                      </View>
                    :null
                  }
                  <CalendarPicker
                    onDateChange={(dt) => this.onSelectDate(dt)}
                    selectedDayColor={ViewUtils.COLOR_THEME_GREEN}
                    selectedDayTextColor={'#FFF'}
                    initialDate={date}/>
                  </View>
              ) : null}
            </View>
          </KeyboardAwareScrollView>
      </View>
    );
  }

  getRepeatTimeRange() {

    const repeatFrequency = this.props.formData.repeatFrequency;
    let repeatTimes = [{label: 'Select a value', value: -1}];
    if(repeatFrequency === 'weekly') for(let i=1;i<=52;i++)  {
      repeatTimes.push({label: i, value: i})
    }
    else if(repeatFrequency === 'custom') for(let i=1;i<=24;i++)  {
      repeatTimes.push({label: i, value: i})
    }
    else for(let i=1;i<=12;i++)  {
      repeatTimes.push({label: i, value: i})
    }

    return repeatTimes;
  }

  _scrollToEnd() {
    setTimeout(() => {this.scroll.scrollToEnd()}, 100);
  }

  onSelectDate(date) {

    const {dates} = this.state;
    const {onChangeFieldValue} = this.props;
    //console.log('CUSTOM_DAYS_LENGTH', dates.length)
    if(dates.length >= 24) return;
    let filteredDates = dates.filter(dt => Moment(dt).format('DD-MM-YYYY') !== Moment(date).format('DD-MM-YYYY'))
    filteredDates.push(date);
    this.setState({micDate: date, dates: filteredDates})
    if(onChangeFieldValue) onChangeFieldValue('micDays',filteredDates);
    console.log('CUSTOM_DAYS', filteredDates)
  }

  removeDate(date) {
    const {dates} = this.state;
    const {onChangeFieldValue} = this.props;
    let filteredDates = dates.filter(dt => Moment(dt).format('DD-MM-YYYY') !== Moment(date).format('DD-MM-YYYY'))
    this.setState({dates: filteredDates})
    if(onChangeFieldValue) onChangeFieldValue('micDays',filteredDates);
  }
}

const styles = StyleSheet.create({
  container: {
    flex:1,
    flexDirection: 'column',
    alignItems: 'center',
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
    fontWeight: 'bold',
    color: '#666',
  },
  dateTagsContainer: {
    width: ViewUtils.WINDOW_WIDTH,
    flexDirection: 'row',
    padding: 10,
    //marginVertical: 10,
    flexWrap: 'wrap'
  },
  dateTag: {
    height: 20,
    flexDirection: 'row',
    paddingHorizontal: 6,
    paddingVertical: 3,
    backgroundColor: ViewUtils.COLOR_THEME_GREEN,
    alignItems: 'center',
    borderRadius: 3,
    marginRight: 6,
    marginBottom: 4
  },
  dateText: {
    fontSize: 10,
    color: '#FFF',
    paddingHorizontal: 5,
    fontFamily: ViewUtils.FONT_DOSIS_BOLD
  },
  tagCloseIcon: {
    fontSize: 14,
    padding:3,
    color: '#FFF'
  },

  textContainer: {
      paddingLeft: 10
  },
  labelText: {
    fontSize: 14,
    fontFamily: ViewUtils.FONT_DOSIS_MEDIUM,
    color: ViewUtils.COLOR_THEME_GRAY,
   },
  errorText: {
    fontSize: 13,
    fontFamily: ViewUtils.FONT_DOSIS_MEDIUM,
    color: ViewUtils.COLOR_THEME_RED,
  }
});

export default WhenMicForm;
