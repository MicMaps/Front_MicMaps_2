import React, {Component} from 'react';
import {
  Text,
  View,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet
} from 'react-native';
import Moment from 'moment';
import * as ViewUtils from '../../utils/viewUtils';
import ArrowPointerIcon from '../../../images/arrowPointer2x.png';

class DayPickerSignup extends Component {
  static displayName = 'DayPickerSignup';

  constructor(props) {
    super(props);
    this.state = {

    };

    this.isSelected = this.isSelected.bind(this);
  }

  

  render() {

    const {days, onSelectDay} = this.props;

    return (
      <View style={styles.container}>
        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
          {days.map((day, idx) => {
            return (
              <TouchableOpacity
                key={idx}
                style={[styles.dayTextContainer, {width: ViewUtils.WINDOW_WIDTH / (days.length > 7 ? 7 : days.length)}, this.isSelected(day) ? styles.selectedBox : null]}
                onPress={() => onSelectDay(day)}>
                <Text style={styles.dayText}>
                  {this.isToday(day) ? 'TODAY' : Moment(day).format('MMM').toUpperCase()}
                </Text>
                <Text style={[styles.dateText, this.isToday(day) ? styles.todayDateText : null]}>
                  {Moment(day).format('D')}
                </Text>
                {this.isSelected(day) ? (
                  <Image style={styles.selectedDayIcon} source={ArrowPointerIcon} />
                ) : null}
              </TouchableOpacity>
            )
          })}
        </ScrollView>
      </View>
    )
  }

  isSelected(date) {

    const {selectedDay} = this.props;
    if (!selectedDay) {
        return false;
    }
    let d1 = Moment(date).format('MM-DD-YYYY')
    let d2 = Moment(selectedDay).format('MM-DD-YYYY');
    return d1 === d2;
  }

  isToday(date) {
    return Moment(date).format('MM-DD-YYYY') === Moment().format('MM-DD-YYYY')
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: ViewUtils.WINDOW_WIDTH,
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: ViewUtils.COLOR_THEME_BLUE
  },
  dayTextContainer: {
    position: 'relative',
    width: ViewUtils.WINDOW_WIDTH / 7,
    height: 60,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 9
  },
  dayText: {
    fontSize: 12,
    color: ViewUtils.COLOR_THEME_EXTRA_LIGHT_BLUE
  },
  dateText: {
    fontSize: 13,
    color: '#FFF',
    marginTop: 2
  },
  todayDateText: {
    color: ViewUtils.COLOR_THEME_GREEN
  },
  boldText: {
    fontWeight: 'bold'
  },
  selectedBox: {
    backgroundColor: ViewUtils.COLOR_THEME_LIGHT_BLUE
  },
  selectedDayIcon: {
    position: 'absolute',
    bottom: 0,
    width: 7,
    height: 13
  }
});

export default DayPickerSignup;
