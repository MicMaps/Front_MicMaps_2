import React, {Component} from 'react';
import Moment from 'moment';
import {
  Text,
  View,
  Image,
  TouchableOpacity,
  DatePickerAndroid,
  TimePickerAndroid,
  StyleSheet
} from 'react-native';
import * as ViewUtils from '../../utils/viewUtils';
import IconArrowRight from '../../../images/arrowRight.png';
import IconArrowDown from '../../../images/arrowDown.png';

class DateTimeSelectInput extends Component {

  constructor(props) {
    super(props)
    this.state = {
      isExpanded: false
    }

    this.openDatePicker = this.openDatePicker.bind(this);
  }

  render() {

    const {style, label, datePickerProps, dropDownStyle} = this.props;
    const {isExpanded} = this.state;

    let dateFormat = datePickerProps.format ?
      datePickerProps.format : datePickerProps.mode === 'time' ? 'hh:mm a' : 'dddd, MMM DD, YYYY';

    return (
      <View style={[styles.container, style]}>
        <TouchableOpacity style={styles.selectItemContainer}
          onPress={() => this.openDatePicker()}>
          <View style={styles.textContainer}>
            <Text style={styles.labelText}>{label}</Text>
          </View>
          <View style={[styles.valueContainer, isExpanded ? {borderBottomColor: 'transparent'} : null]}>
            <Text style={styles.valueText}>{Moment(datePickerProps.date).format(dateFormat)}</Text>
            <View style={styles.arrowIconContainer}>
              {!isExpanded ? (
                <Image style={{width: 11.5, height: 21}} source={IconArrowRight} />
              ) : (
                <Image style={{width: 21, height: 11.5}} source={IconArrowDown} />
              )}
            </View>
          </View>
        </TouchableOpacity>
      </View>
    )
  }

  openDatePicker() {

    const {date, mode, minimumDate, maximumDate, onDateChange} = this.props.datePickerProps;

    let options = { date, mode: 'calendar' };
    if(minimumDate) options.minDate = minimumDate;
    if(maximumDate) options.maxDate = maximumDate;

    try {

      if(mode === 'time') {
        options.hour = Number.parseInt(Moment(date).format('HH'));
        options.minute = Number.parseInt(Moment(date).format('mm'));
        console.log(options)
        TimePickerAndroid.open(options).then((res) => {
          if (res.action !== TimePickerAndroid.dismissedAction) {
            let time = Moment().set({'hour': res.hour, 'minute': res.minute}).toDate();
            if(onDateChange) onDateChange(time)
          }
        }).catch(() => {
          console.warn('Cannot open time picker');
        });
      } else {
        DatePickerAndroid.open(options).then((res) => {
          if (res.action !== DatePickerAndroid.dismissedAction) {
            if(onDateChange) onDateChange(new Date(res.year, res.month, res.day))
          }
        }).catch(() => {
          console.warn('Cannot open date picker');
        });
      }

    } catch ({code, message}) {
      console.warn('Cannot open date picker', message);
    }
  }

}

const styles = StyleSheet.create({
  container : {
    width: ViewUtils.WINDOW_WIDTH,
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: 15
  },
  selectItemContainer: {
    position: 'relative',
    width: ViewUtils.WINDOW_WIDTH - 40,
    flexDirection: 'column'
  },
  selectDropdownContainer: {
    position: 'relative',
    width: ViewUtils.WINDOW_WIDTH,
    height: 190,
    backgroundColor: '#F7F4F4',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden'
  },
  textContainer: {
    marginBottom:4
  },
  labelText: {
    fontSize: 14,
    fontFamily: ViewUtils.FONT_DOSIS_MEDIUM,
    color: ViewUtils.COLOR_THEME_GRAY,
  },
  valueContainer: {
    position: 'relative',
    width: ViewUtils.WINDOW_WIDTH - 40,
    flexDirection: 'column',
    borderColor: ViewUtils.COLOR_THEME_LIGHT_GRAY,
    borderBottomWidth: 0.5
  },
  valueText: {
    height: 32,
    fontSize: 16,
    color: ViewUtils.COLOR_THEME_BLUE,
    lineHeight: 16,
    paddingBottom: 14,
    paddingRight: 30,
    fontFamily: ViewUtils.FONT_DOSIS_MEDIUM,
    fontWeight: 'normal'
  },
  arrowIconContainer: {
    position: 'absolute',
    width: 22,
    height: 22,
    right: 0,
    top: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  selectIconContainer: {
    position: 'absolute',
    top: 0,
    right: 20,
    width: 30,
    height: 30,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9
  }
});

export default DateTimeSelectInput;
