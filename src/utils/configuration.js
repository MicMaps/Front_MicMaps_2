import {Map} from 'immutable';

let configuration = Map({
  //API_ROOT: 'http://api.micmaps.com/api',
  API_ROOT: 'http://staging-api.micmaps.com/api',
  //API_ROOT: 'http://192.168.1.3:3000/api',
  GOOGLE_PLACES_API_KEY: 'AIzaSyABuXCTqrSSWHxrdu7WjhBueTMC2P77R7Y',
  GOOGLE_ANALYTICS_TRACKING_ID: 'UA-118416899-1',
  FCM_SENDER_ID:'616072879797'
});


export function setConfiguration(name, value) {
  configuration = configuration.set(name, value);
}

export function setAll(properties) {
  configuration = configuration.merge(properties);
}

export function unsetConfiguration(name) {
  configuration = configuration.delete(name);
}

export function getConfiguration(key) {
  if (!configuration.has(key)) {
    throw new Error('Undefined configuration key: ' + key);
  }

  return configuration.get(key);
}
