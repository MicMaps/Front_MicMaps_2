import Moment from 'moment';
import {AsyncStorage} from 'react-native';
import {NavigationActions} from 'react-navigation';

const APP_INTRO_VISITED_KEY = 'MicMapsState:isIntroPageVisited';

export function toJS(immutable) {
  if (immutable && immutable.toJS) {
    return immutable.toJS()
  }
  return immutable;
}

export function isUrl(url) {
  var regexp = /(http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/
  return regexp.test(url);
}

export function trimByCharsLimit(string, maxLength) {
  var trimmedString = string.substr(0, maxLength);
  return trimmedString.substr(0, Math.min(trimmedString.length, trimmedString.lastIndexOf(" ")));
}

export function cleanCoordinates(arr) {
  //console.log(arr);
  return arr
    ? {
      longitude: arr[0],
      latitude: arr[1]
    }
    : undefined;
}

export function addHTTP(url) {
  if (!/^https?:\/\//i.test(url)) {
    url = 'http://' + url;
  }
  return url;
}

export function numberToArray(num) {
  var arr = []
  for (var i = 0; i < num + 1; i++) {
    arr.push(i);
  };
  return arr;
}

export function isPhoneNumberValid(phone) {
  //return /^(\+\d{1,3}[- ]?)?\d{10}$/.test(phone)
  return /^[2-9]\d{9}$/.test(phone)
}

export function isEmailValid(email) {
  return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)
}

export function isPasswordValid(password) {
  return (password && (password.length >= 6))?true:false
}
export function isToday(date) {
  //console.log('today date? ', date);
  return Moment(date).format('DD-MM-YYYY') === Moment().format('DD-MM-YYYY')
}

export function turnMilitary(time) {

  let dateTime = (typeof time === 'string')
    ? new Date(time)
    : time;
  //console.log('typeof time: ',typeof time);
  var hours = dateTime.getHours()
  var minutes = dateTime.getMinutes()
  minutes = minutes.toString()
  if (minutes.length === 1) {
    minutes = `0${minutes}`
  }
  return `${hours}${minutes}`
}

export function turnMilitaryToDate(time, date = new Date()) {

  const hours = parseInt(time / 100)
  const minutes = parseFloat(time % 100)
  date = (typeof date === 'string')
    ? (new Date(date))
    : date;
  let dt = new Date(date.getTime())
  dt.setHours(hours)
  dt.setMinutes(minutes)
  //console.log(date)
  return dt
}

export function turnMilitaryToTime(time, timeFormat = 'ha', date = new Date()) {
  return Moment(turnMilitaryToDate(time, date)).format(timeFormat)
}

export function padZeros(str) {
  str = str
    ? str.toString()
    : "0"
  switch (str.length) {
    case 1:
      return "000" + str
    case 2:
      return "00" + str
    case 3:
      return "0" + str
    case 4:
      return str
    default:
      return str

  }
}

export function arraysEqual(arr1, arr2) {
  if (arr1.length !== arr2.length)
    return false;
  for (var i = arr1.length; i--;) {
    if (arr1[i] !== arr2[i])
      return false;
    }
  return true;
}

export function formatMinutes(val) {

  let hours = parseInt(parseInt(val) / 60);
  let minutes = parseInt(val) % 60;
  return (hours
    ? `${hours} hours `
    : '') + (minutes
    ? `${minutes} minutes`
    : '');
}

export function isIntroPageVisited() {
  return AsyncStorage.getItem(APP_INTRO_VISITED_KEY);
}

export async function setIntroPageVisited(visited) {
  return AsyncStorage.setItem(APP_INTRO_VISITED_KEY, visited
    ? 'yes'
    : 'no');
}

export function debounce(func, wait, immediate) {
  var timeout;
  return function() {
    var context = this,
      args = arguments;
    clearTimeout(timeout);
    timeout = setTimeout(function() {
      timeout = null;
      if (!immediate)
        func.apply(context, args);
      }
    , wait);
    if (immediate && !timeout) {
      func.apply(context, args);
    }
    return timeout;
  };
}

export function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
  var R = 6371; // Radius of the earth in km
  var dLat = deg2rad(lat2 - lat1); // deg2rad below
  var dLon = deg2rad(lon2 - lon1);
  var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  var d = R * c; // Distance in km
  return d;
}

function deg2rad(deg) {
  return deg * (Math.PI / 180)
}

export function resetNavigation(navigation, index, routesStack = []) {
  const actions = routesStack.map((route) => {
    return NavigationActions.navigate(route);
  });
  const resetAction = NavigationActions.reset({
    index: index,
    actions: actions
  });
  navigation.dispatch(resetAction);
}
