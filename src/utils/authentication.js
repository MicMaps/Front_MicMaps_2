import {AsyncStorage} from 'react-native';

const AUTHENTICATION_STORAGE_KEY = 'MicMapsState:Authentication';
const REMEMBER_ME_STATUS_STORAGE_KEY = 'MicMapsState:RememberMe';
const PUSH_NOTIFICATION_TOKEN_KEY = 'MicMapsState:PNToken';

export function getAuthenticationToken() {
  return AsyncStorage.getItem(AUTHENTICATION_STORAGE_KEY);
}

export async function setAuthenticationToken(token) {
  return AsyncStorage.setItem(AUTHENTICATION_STORAGE_KEY, token);
}

export async function clearAuthenticationToken() {
  return AsyncStorage.removeItem(AUTHENTICATION_STORAGE_KEY);
}

export async function setUserRememberMeStatus(isRememberMe) {
  return AsyncStorage.setItem(REMEMBER_ME_STATUS_STORAGE_KEY, isRememberMe? 'yes' : 'no');
}

export async function getUserRememberMeStatus() {
  return AsyncStorage.getItem(REMEMBER_ME_STATUS_STORAGE_KEY);
}

export async function getPushNotificationToken() {
  return AsyncStorage.getItem(PUSH_NOTIFICATION_TOKEN_KEY);
}

export async function setPushNotificationToken(token) {
  return AsyncStorage.setItem(PUSH_NOTIFICATION_TOKEN_KEY, token);
}

export async function clearPushNotificationToken() {
  return AsyncStorage.removeItem(PUSH_NOTIFICATION_TOKEN_KEY);
}
