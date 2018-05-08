import React, {Component} from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet
} from 'react-native';
import * as ViewUtils from '../../../../utils/viewUtils';
import Ionicon from 'react-native-vector-icons/Ionicons';
import EvilIcon from 'react-native-vector-icons/EvilIcons';
import CalendarPicker from 'react-native-calendar-picker';
import Moment from 'moment';

class RepeatFrequencyForm extends Component {
  static displayName = 'RepeatFrequencyForm';

  constructor(props) {
    super(props);
    this.state = {
      micDate: new Date(),
      micDates: []
    }

    this.selectOption = this.selectOption.bind(this);
    this.onSelectDate = this.onSelectDate.bind(this);
    this.removeDate = this.removeDate.bind(this);
  }

  render() {

    const {onChangeFieldValue, formData} = this.props;
    const {repeatFrequency} = formData;
    const {micDates, micDate} = this.state;
    return (
      <View style={styles.container}>
        <View style={styles.titleTextContainer}>
          <Text style={styles.titleText}>Repeat</Text>
        </View>
        <TouchableOpacity style={styles.row} onPress={() => this.selectOption('weekly')}>
          <View style={styles.rowIconContainer}>
            <Ionicon style={styles.rowIcon} name={repeatFrequency === 'weekly' ? 'ios-radio-button-on' :
'ios-radio-button-off'} />
          </View>
          <View style={styles.rowLabelContainer}>
            <Text style={styles.rowLabel}>Every Week</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.row} onPress={() => this.selectOption('monthly')}>
          <View style={styles.rowIconContainer}>
            <Ionicon style={styles.rowIcon} name={repeatFrequency === 'monthly' ? 'ios-radio-button-on' :
'ios-radio-button-off'} />
          </View>
          <View style={styles.rowLabelContainer}>
            <Text style={styles.rowLabel}>Every Month</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.row} onPress={() => this.selectOption('custom')}>
          <View style={styles.rowIconContainer}>
            <Ionicon style={styles.rowIcon} name={repeatFrequency === 'custom' ? 'ios-radio-button-on' :
'ios-radio-button-off'} />
          </View>
          <View style={styles.rowLabelContainer}>
            <Text style={styles.rowLabel}>Custom</Text>
          </View>
        </TouchableOpacity>
        {repeatFrequency === 'custom' ? (
          <View style={styles.dateSelectorContainer}>
            <View style={styles.dateTagsContainer}>
              {micDates.map((date, idx) => {
                return (
                  <View style={styles.dateTag} key={idx}>
                    <Text style={styles.dateText}>{Moment(date).format('DD MMM')}</Text>
                    <TouchableOpacity onPress={() => this.removeDate(date)}>
                      <EvilIcon style={styles.tagCloseIcon} name={'close'} />
                    </TouchableOpacity>
                  </View>
                )
              })}
            </View>
            <CalendarPicker
              onDateChange={(date) => this.onSelectDate(date)}
              selectedDayColor={'#444'}
              selectedDayTextColor={'#FFF'}
              initialDate={micDate}/>
          </View>
        ) : null}
      </View>
    );
  }

  onSelectDate(date) {

    const {micDates} = this.state;
    const {onChangeFieldValue} = this.props;
    if(micDates.length > 12) return;
    let dates = micDates.filter(dt => Moment(dt).format('DD-MM-YYYY') !== Moment(date).format('DD-MM-YYYY'))
    dates.push(date);
    this.setState({micDate: date, micDates: dates})
    if(onChangeFieldValue) onChangeFieldValue('micDays',dates);
    console.log('CUSTOM_DAYS', dates)
  }

  removeDate(date) {
    const {micDates} = this.state;
    const {onChangeFieldValue} = this.props;
    let dates = micDates.filter(dt => Moment(dt).format('DD-MM-YYYY') !== Moment(date).format('DD-MM-YYYY'))
    this.setState({micDates: dates})
    if(onChangeFieldValue) onChangeFieldValue('micDays',dates);
  }

  selectOption(option) {
    const {onChangeFieldValue} = this.props;
    if(onChangeFieldValue) onChangeFieldValue('repeatFrequency',option);
  }
}


const styles = StyleSheet.create({
  container: {
    flex:1,
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: '#EEE'
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
  row: {
    width: ViewUtils.WINDOW_WIDTH,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#CCC'
  },
  rowLabelContainer: {
    flex: 1,
    height: 16,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15
  },
  rowLabel: {
    fontSize: 14,
    color: '#888'
  },
  rowInputContainer: {
    flex: 1,
    height: 16,
    flexDirection: 'row',
    alignItems: 'center'
  },
  rowIconContainer: {
    width: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop:3
  },
  rowIcon: {
    fontSize: 20,
    color: '#888',
  },
  textInput: {
    flex: 1,
    fontSize: 14,
    color: '#444'
  },
  dateSelectorContainer: {
    flex: 1,
    width: ViewUtils.WINDOW_WIDTH,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dateSelector: {
    width: ViewUtils.WINDOW_WIDTH - 40,
    marginLeft: 20,
  },
  dateTagsContainer: {
    width: ViewUtils.WINDOW_WIDTH,
    flexDirection: 'row',
    padding: 10,
    marginVertical: 10,
    flexWrap: 'wrap'
  },
  dateTag: {
    height: 20,
    flexDirection: 'row',
    paddingHorizontal: 6,
    paddingVertical: 3,
    backgroundColor: '#444',
    alignItems: 'center',
    borderRadius: 10,
    marginRight: 6,
    marginBottom: 4
  },
  dateText: {
    fontSize: 10,
    color: '#EEE',
    paddingHorizontal: 5
  },
  tagCloseIcon: {
    fontSize: 14,
    padding:3,
    color: '#FFF'
  }
});

export default RepeatFrequencyForm;
