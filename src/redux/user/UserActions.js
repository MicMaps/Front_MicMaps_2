import {
    requestOtp,
    register,
    login,
    getProfile,
    updateProfile,
    getMics,
    deleteMic,
    updateMic,
    facebookUserLogin,
    facebookUserSignup,
    resetPasswordRequest
  } from '../../services/user';
  
//   import {
//     login as facebookLogin
//   } from '../../services/facebook'
  import * as AuthUtils from '../../utils/authentication'
  
  import * as cloudinary from '../../services/cloudinary';
  import ImagePicker from 'react-native-image-picker';
  
  export const SEND_OPT_REQUEST = 'SEND_OPT_REQUEST'
  export const SEND_OPT_SUCCESS = 'SEND_OPT_SUCCESS'
  export const SEND_OPT_FAILURE = 'SEND_OPT_FAILURE'
  export const REGISTER_USER_REQUEST = 'REGISTER_USER_REQUEST'
  export const REGISTER_USER_SUCCESS = 'REGISTER_USER_SUCCESS'
  export const REGISTER_USER_FAILURE = 'REGISTER_USER_FAILURE'
  export const USER_LOGIN_REQUEST = 'USER_LOGIN_REQUEST'
  export const USER_LOGIN_SUCCESS = 'USER_LOGIN_SUCCESS'
  export const USER_LOGIN_FAILURE = 'USER_LOGIN_FAILURE'
  export const FACEBOOK_LOGIN_REQUEST = 'FACEBOOK_LOGIN_REQUEST'
  export const FACEBOOK_LOGIN_SUCCESS = 'FACEBOOK_LOGIN_SUCCESS'
  export const FACEBOOK_LOGIN_FAILURE = 'FACEBOOK_LOGIN_FAILURE'
  export const FACEBOOK_USER_LOGIN_REQUEST = 'FACEBOOK_USER_LOGIN_REQUEST'
  export const FACEBOOK_USER_LOGIN_SUCCESS = 'FACEBOOK_USER_LOGIN_SUCCESS'
  export const FACEBOOK_USER_LOGIN_FAILURE = 'FACEBOOK_USER_LOGIN_FAILURE'
  export const FACEBOOK_USER_SIGNUP_REQUEST = 'FACEBOOK_USER_SIGNUP_REQUEST'
  export const FACEBOOK_USER_SIGNUP_SUCCESS = 'FACEBOOK_USER_SIGNUP_SUCCESS'
  export const FACEBOOK_USER_SIGNUP_FAILURE = 'FACEBOOK_USER_SIGNUP_FAILURE'
  export const SET_PERMISSIONS = 'SET_PERMISSIONS'
  export const USER_UPDATE_PROFILE_REQUEST = 'USER_UPDATE_PROFILE_REQUEST'
  export const USER_UPDATE_PROFILE_SUCCESS = 'USER_UPDATE_PROFILE_SUCCESS'
  export const USER_UPDATE_PROFILE_FAILURE = 'USER_UPDATE_PROFILE_FAILURE'
  export const OTHER_USER_GET_MICS_REQUEST = 'OTHER_USER_GET_MICS_REQUEST'
  export const OTHER_USER_GET_MICS_SUCCESS = 'OTHER_USER_GET_MICS_SUCCESS'
  export const OTHER_USER_GET_MICS_FAILURE = 'OTHER_USER_GET_MICS_FAILURE'
  export const USER_GET_MICS_REQUEST = 'USER_GET_MICS_REQUEST'
  export const USER_GET_MICS_SUCCESS = 'USER_GET_MICS_SUCCESS'
  export const USER_GET_MICS_FAILURE = 'USER_GET_MICS_FAILURE'
  export const USER_DELETE_MIC_REQUEST = 'USER_DELETE_MIC_REQUEST'
  export const USER_DELETE_MIC_SUCCESS = 'USER_DELETE_MIC_SUCCESS'
  export const USER_DELETE_MIC_FAILURE = 'USER_DELETE_MIC_FAILURE'
  export const USER_UPDATE_MIC_REQUEST = 'USER_UPDATE_MIC_REQUEST'
  export const USER_UPDATE_MIC_SUCCESS = 'USER_UPDATE_MIC_SUCCESS'
  export const USER_UPDATE_MIC_FAILURE = 'USER_UPDATE_MIC_FAILURE'
  export const UPLOAD_PROFILE_IMAGE_REQUEST = 'UPLOAD_PROFILE_IMAGE_REQUEST';
  export const UPLOAD_PROFILE_IMAGE_SUCCESS = 'UPLOAD_PROFILE_IMAGE_SUCCESS';
  export const UPLOAD_PROFILE_IMAGE_FAILURE = 'UPLOAD_PROFILE_IMAGE_FAILURE';
  export const USER_RESET_PASSWORD_REQUEST = 'USER_RESET_PASSWORD_REQUEST';
  export const USER_RESET_PASSWORD_SUCCESS = 'USER_RESET_PASSWORD_SUCCESS';
  export const USER_RESET_PASSWORD_FAILURE = 'USER_RESET_PASSWORD_FAILURE';
  export const RESET_ERROR = 'RESET_ERROR';
  export const SET_LOADING_STATUS = 'SET_LOADING_STATUS';
  export const USER_RESET_DATA = 'USER_RESET_DATA';
  
  import {
    GET_MIC_DETAILS_SUCCESS
  } from '../mics/MicActions';
  
  export async function sendOtpRequest(data, action, callback) {
    return dispatch => {
      dispatch({
        type: SEND_OPT_REQUEST
      })
      return requestOtp(data, action).then(res => {
        dispatch({ type: SEND_OPT_SUCCESS, payload: res })
        if (callback) {callback({status: true, data: res});}
      }).catch(err => {
        dispatch({ type: SEND_OPT_FAILURE, payload: err })
        if (callback) {callback({status: false, data: err});}
      });
    };
  }
  
  export async function registerUser(data, callback) {
    return dispatch => {
      dispatch({
        type: REGISTER_USER_REQUEST
      })
      return register(data).then(res => {
        getUserProfile(dispatch, REGISTER_USER_SUCCESS, REGISTER_USER_FAILURE, callback)
      }).catch(err => {
        dispatch({
          type: REGISTER_USER_FAILURE,
          payload: err
        })
        if (callback) {callback({status: false, data: err})}
      });
    };
  }
  
  export async function loginRequest(data, callback) {
    return dispatch => {
      dispatch({
        type: USER_LOGIN_REQUEST
      })
      return login(data).then(res => {
        getUserProfile(dispatch, USER_LOGIN_SUCCESS, USER_LOGIN_FAILURE, callback)
      }).catch(err => {
        dispatch({
          type: USER_LOGIN_FAILURE,
          payload: err
        })
        if (callback) {callback({status: false, data: err})}
      });
    };
  }
  
  export function facebookLoginRequest(callback) {
    return dispatch => {
      dispatch({type: FACEBOOK_LOGIN_REQUEST});
    //   return facebookLogin().then(fbResponse => {
    //     if (callback) {callback({status: true, data: fbResponse});}
    //     dispatch({
    //       type: FACEBOOK_LOGIN_SUCCESS,
    //       payload: fbResponse.profile
    //     });
    //   }).catch(fbError => {
    //     dispatch({
    //       type: FACEBOOK_LOGIN_FAILURE,
    //       payload: {message: JSON.stringify({error: fbError})}
    //     });
    //     if (callback) {callback({status: false, data: fbError});}
    //   });
    };
  }
  
  export function facebookUserSignupRequest(data, callback) {
    return dispatch => {
      dispatch({type: FACEBOOK_USER_SIGNUP_REQUEST});
      return register(data).then(res => {
        getUserProfile(dispatch, FACEBOOK_USER_SIGNUP_SUCCESS, FACEBOOK_USER_SIGNUP_FAILURE, callback)
      }).catch(err => {
        dispatch({
          type: FACEBOOK_USER_SIGNUP_FAILURE,
          payload: err
        });
        if (callback) {callback({status: false, data: err})}
      });
    };
  }
  
  export function facebookUserLoginRequest(data, callback) {
    return dispatch => {
      dispatch({type: FACEBOOK_USER_LOGIN_REQUEST});
      return login(data).then(res => {
        getUserProfile(dispatch, FACEBOOK_USER_LOGIN_SUCCESS, FACEBOOK_USER_LOGIN_FAILURE, callback)
      }).catch(err => {
        dispatch({
          type: FACEBOOK_USER_LOGIN_FAILURE,
          payload: err
        });
        if (callback) {callback({status: false, data: err})}
      });
    };
  }
  
  export function resetUserPasswordRequest(data, callback) {
    return dispatch => {
      dispatch({type: USER_RESET_PASSWORD_REQUEST});
      return resetPasswordRequest(data).then(res => {
        dispatch({
          type: USER_RESET_PASSWORD_SUCCESS,
          payload: res.data
        });
        if (callback) {callback({status: true, data: res.data})}
      }).catch(err => {
        dispatch({
          type: USER_RESET_PASSWORD_FAILURE,
          payload: err
        });
        if (callback) {callback({status: false, data: err})}
      });
    };
  }
  
  export function updateUserProfileRequest(data, callback) {
    return {
      type: USER_UPDATE_PROFILE_REQUEST,
      payload: {data:data, callback:callback}
    }
  }
  
  export function updateUserProfile(data, callback) {
    return updateProfile(data)
      .then((res) => {
        if(callback) {
          callback({status: true, data: res.data})
        }
        return {type: USER_UPDATE_PROFILE_SUCCESS, payload: res.data}
      })
      .catch((err) => ({type: USER_UPDATE_PROFILE_FAILURE, payload: err}));
  }
  
  export function getOtherUserMicsRequest(data) {
    return {
      type: OTHER_USER_GET_MICS_REQUEST,
      payload: data
    }
  }
  
  export function getUserMicsRequest(data) {
    return {
      type: USER_GET_MICS_REQUEST,
      payload: data
    }
  }
  
  export function getOtherUsersMics(data, callback) {
    return getMics(data)
     .then((res) => ({type: OTHER_USER_GET_MICS_SUCCESS, payload: res.data}))
    .catch((err) => ({type: OTHER_USER_GET_MICS_FAILURE, payload: err}));
  }
  
  export function getUserMics(data) {
    return getMics(data)
      .then((res) => ({type: USER_GET_MICS_SUCCESS, payload: res.data}))
      .catch((err) => ({type: USER_GET_MICS_FAILURE, payload: err}));
  }
  
  export function deleteUserMicRequest(userId, micId) {
    return {
      type: USER_DELETE_MIC_REQUEST,
      payload: {userId, micId}
    }
  }
  
  export function deleteUserMic(data) {
    return deleteMic(data.userId, data.micId)
      .then((res) => {
        res.micId = data.micId;
        return ({type: USER_DELETE_MIC_SUCCESS, payload: res})
      })
      .catch((err) => {
        return ({type: USER_DELETE_MIC_FAILURE, payload: err})
      });
  }
  
  export function updateUserMic(userId, data, callback) {
    //alert(JSON.stringify(data));
    return dispatch => {
      dispatch({type: USER_UPDATE_MIC_REQUEST});
      return updateMic(userId, data).then(res => {
        dispatch({
          type: USER_UPDATE_MIC_SUCCESS,
          payload: res.data
        });
        dispatch({
          type: GET_MIC_DETAILS_SUCCESS,
          payload: res.data
        });
        if (callback) {callback({status: true, data: res.data})}
      }).catch(err => {
        dispatch({
          type: USER_UPDATE_MIC_FAILURE,
          payload: err
        });
        if (callback) {callback({status: false, data: err})}
      });
    };
  }
  
  function getUserProfile(dispatch, successActionType, errorActionType, callback) {
    getProfile().then(res => {
      dispatch({
        type: successActionType,
        payload: res.data
      })
      if(callback) callback({status: true, data: res.data})
    }).catch(err => {
      dispatch({
        type: errorActionType,
        payload: err
      })
      if(callback) callback({status: false, data: err})
    })
  }
  
  export function pickProfileImage(callback) {
    return dispatch => {
  
      var options = {
        title: 'Select Profile Image',
        customButtons: [],
        storageOptions: {
          skipBackup: true,
          path: 'images'
        }
      };
  
      dispatch({ type: UPLOAD_PROFILE_IMAGE_REQUEST})
      ImagePicker.showImagePicker(options, (response) => {
        if (response.didCancel) {}
        else if (response.error) {}
        else if (response.customButton) {}
        else {
          const imageUri = 'data:image/jpeg;base64,' + response.data
          if(callback) callback({status: true, data: {status: 'uploading', image: null}})
          cloudinary.uploadImage(imageUri).then((data) => {
            const {secure_url} = data;
            dispatch({ type: UPLOAD_PROFILE_IMAGE_SUCCESS, payload: secure_url })
            if(callback) callback({status: true, data: {status: 'uploaded', image: secure_url}})
          }, (cloudinaryError) => {
  
            dispatch({type: UPLOAD_PROFILE_IMAGE_FAILURE})
            if(callback) callback({status: false, data: {error: cloudinaryError}})
          })
        }
      });
    }
  }
  
  
  export async function setUserPermission(type, value) {
    return {
      type: 'SET_PERMISSIONS',
      payload: { type, value }
    }
  }
  
  export async function saveRememberMeStatus(isRememberMe) {
    return dispatch => {
      return AuthUtils.setUserRememberMeStatus(isRememberMe);
    };
  }
  
  export async function resetError() {
    return {
      type: RESET_ERROR
    };
  }
  
  export async function setLoadingStatus(isLoading) {
    return {
      type: SET_LOADING_STATUS,
      payload: isLoading
    };
  }
  
  export function logout(callback) {
    return dispatch => {
      dispatch({type: USER_RESET_DATA});
      return AuthUtils.clearAuthenticationToken().then(success => {
        if(callback) {callback({status: true, data: success})}
      }).catch(error => {
        //console.log('token cleared error', error)
        if (callback) {callback({status: false, data: err})}
      });
    };
  }
  
  export async function loadRememberMeStatus(callback) {
    return dispatch => {
      return AuthUtils.getUserRememberMeStatus().then(data => {
        if (callback) {callback({status: true, data});}
      }).catch(error => {
        if (callback) {callback({status: false, error});}
      });
    };
  }
  
  export function resetUserData() {
    return {
      type: USER_RESET_DATA
    }
  }
  