import React from 'react';
import {
  Modal,
  TouchableOpacity,
  View,
  StyleSheet,
  Platform,
  DatePickerIOS,
  DatePickerAndroid
} from 'react-native';
import EvilIcon from 'react-native-vector-icons/EvilIcons';
import * as ViewUtils from '../../../utils/viewUtils';

const PICKER_WIDTH = ViewUtils.WINDOW_WIDTH;
const PICKER_HEIGHT = ViewUtils.WINDOW_HEIGHT * 0.3;

function DatePicker({onChangeDate, selectedDate, visibility, maximumDate, minimumDate, mode, open, close}) {

  return (Platform.OS == 'ios') ? (
    <Modal
      animationType={'slide'}
      transparent={true}
      visible={visibility}
      style={styles.pickerModal}
      onRequestClose={() => {}}>
        <View style={styles.container}>
          <View style={styles.pickerContainer}>
            <DatePickerIOS
              style={styles.time}
              date={selectedDate ? selectedDate : new Date()}
              mode={mode ? mode : "date"}
              minuteInterval={30}
              onDateChange={onChangeDate}
              maximumDate={maximumDate ? maximumDate : undefined}
              minimumDate={minimumDate ? minimumDate: undefined}
            />
            <TouchableOpacity style={styles.closeButton} onPress={() => close()}>
              <EvilIcon name={'check'} style={styles.closeIcon}/>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

    ): (
      <DatePickerAndroid
        date={selectedDate}
        mode="date"
        onDateChange={onChangeDate} />
    );

}



const styles = StyleSheet.create({

  pickerModal: {
    backgroundColor: 'transparent'
  },
  container: {
    backgroundColor: 'transparent',
    flex: 1,
    alignSelf: 'center',
    height: window.height,
    width: window.width,
    alignItems: 'center',
    justifyContent: 'flex-end',
    flexDirection: 'column'
  },
  time: {
    width: 320
  },
  pickerContainer: {
    height: PICKER_HEIGHT,
    width: PICKER_WIDTH,
    borderTopWidth:1,
    borderTopColor: '#DDD',
    backgroundColor: '#FFF'
  },
  picker: {
    flex:1,
  },
  closeButton: {
    position: 'absolute',
    top:0,
    right:0,
    padding:6,
    width:40,
    height:40,
    zIndex:9
  },
  closeIcon: {
    fontSize: 24
  }
});

export default DatePicker;
