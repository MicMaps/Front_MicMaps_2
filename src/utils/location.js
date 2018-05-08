import RNSettings from 'react-native-settings';

export function requestCurrentLocation(callback) {
  //console.log('center location requested');
  navigator.geolocation.getCurrentPosition(
    (position) => {
      if (callback) {
        callback({status: true, data: position});
      }
    },
    (error) => {
      if(callback) {
        callback({
          status: false,
          data: error ? error.message : "Unable to retrieve current location."
        });
      }
    },
    {enableHighAccuracy: false, timeout: 20000, maximumAge: 10000}
  );
}

export function checkAndroidLocationSettings(callback) {

  RNSettings.getSetting(RNSettings.LOCATION_SETTING).then(result => {
    if (result == RNSettings.ENABLED) {
      if (callback) {
        callback(true, 'location is enabled')
      }
    } else {
      if (callback) {
        callback(false, 'location is disabled')
      }
    }
  })
}
