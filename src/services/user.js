import {get, post, put, del} from '../utils/api';
import {
  setAuthenticationToken,
  getAuthenticationToken,
  getUserRememberMeStatus,
  setUserRememberMeStatus
} from '../utils/authentication';

export function requestOtp(data, action) {

  let url = action === 'login' ? '/authenticate' : '/register/phone';
  return post(url, data)
}

export function register(data) {
  return new Promise((resolve, reject) => {
    post('/register', data)
      .then((res) => {
        if(res.token) setAuthenticationToken(res.token);
        resolve(res);
      })
      .catch((err) => {
        reject(err)
      });
  })
}

export function login(data) {
  return new Promise((resolve, reject) => {
    post('/authenticate', data)
      .then((res) => {
        if(res.data.token) setAuthenticationToken(res.data.token);
        resolve(res);
      })
      .catch((err) => {
        reject(err)
      });
  })
}

export function getProfile() {
  return get('/me');
}

export function updateProfile(data) {
  return put('/me', data);
}

export function getMics(userId) {
  return get(`/user/${userId}/mics`);
}

export function deleteMic(userId, micId) {
  //console.log(`Mic Id: ${micId}, User Id: ${userId}`)
  return del(`/user/${userId}/mics`, {id: micId});
}

export function updateMic(userId, micData) {
  //alert(JSON.stringify(micData));
  console.log("UPDATE_MIC_URL", `/user/${userId}/mics`);
  console.log("UPDATE_MIC_PAYLOAD", micData);
  return put(`/user/${userId}/mics`, micData);
}

export function resetPasswordRequest(data) {
  //console.log('RESET_PASSWORD_PAYLOAD', data);
  return post('/forgot-password', data)
}

export function getRememberMeStatus() {
  return getUserRememberMeStatus();
}

export function setRememberMeStatus(isRememberMe) {
  return setUserRememberMeStatus(isRememberMe);
}

export function updateDeviceToken(oldToken, newToken, deviceType) {
  const data = {oldToken, newToken, deviceType}
  console.log(data)
  return put('/users/devicetoken', data)
}
