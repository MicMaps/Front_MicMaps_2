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
import ArrowPointerIcon from '../../../images/arrowPointer2x.png'

class DayPicker extends Component {
  static displayName = 'IntroView';

  constructor(props) {
    super(props);
    this.state = {

    };

    this.isSelected = this.isSelected.bind(this);
  }

  componentDidMount() {

    const {selectedDay} = this.props;
    if(selectedDay) this.setState({selectedDay});
  }

  render() {

    const {onSelectDay} = this.props;
    const {selectedDay} = this.state;
    const days = getWeekDays();

    return (
      <View style={styles.container}>
        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
          {days.map((day, idx) => {
            return (
              <TouchableOpacity
                key={idx}
                style={[styles.dayTextContainer, this.isSelected(day) ? styles.selectedBox : null]}
                onPress={() => this.setState({selectedDay: day}, () => onSelectDay(day))}>
                <Text style={styles.dayText}>
                  {this.isToday(day) ? 'TODAY' : Moment(day).format('ddd').toUpperCase()}
                </Text>
                <Text style={[styles.dateText, idx == 0 ? styles.todayDateText : null]}>
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

    const {selectedDay} = this.state;
    if(!selectedDay) return false;
    let d1 = Moment(date).format('DD-MM-YYYY')
    let d2 = Moment(selectedDay).format('DD-MM-YYYY');
    return d1 === d2;
  }

  isToday(date) {
    return Moment(date).format('DD-MM-YYYY') === Moment().format('DD-MM-YYYY')
  }

}
function getWeekDays() {

  let weekDays = [];
  for (var i=0;i<7;i++) {
    let date = Moment().add(i, 'days').toDate();
    weekDays.push(date);
  }
  return weekDays;
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

export default DayPicker;
