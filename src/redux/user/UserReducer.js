import {
    fromJS
  } from 'immutable';
  import {
    loop,
    Effects
  } from 'redux-loop-symbol-ponyfill';
  import {
    SEND_OPT_REQUEST,
    SEND_OPT_FAILURE,
    SEND_OPT_SUCCESS,
    REGISTER_USER_REQUEST,
    REGISTER_USER_SUCCESS,
    REGISTER_USER_FAILURE,
    USER_LOGIN_REQUEST,
    USER_LOGIN_SUCCESS,
    USER_LOGIN_FAILURE,
    SET_LOADING_STATUS,
    FACEBOOK_LOGIN_REQUEST,
    FACEBOOK_LOGIN_SUCCESS,
    FACEBOOK_LOGIN_FAILURE,
    FACEBOOK_USER_SIGNUP_REQUEST,
    FACEBOOK_USER_SIGNUP_SUCCESS,
    FACEBOOK_USER_SIGNUP_FAILURE,
    FACEBOOK_USER_LOGIN_REQUEST,
    FACEBOOK_USER_LOGIN_SUCCESS,
    FACEBOOK_USER_LOGIN_FAILURE,
    USER_UPDATE_PROFILE_REQUEST,
    USER_UPDATE_PROFILE_SUCCESS,
    USER_UPDATE_PROFILE_FAILURE,
    USER_GET_MICS_REQUEST,
    USER_GET_MICS_SUCCESS,
    USER_GET_MICS_FAILURE,
    OTHER_USER_GET_MICS_REQUEST,
    OTHER_USER_GET_MICS_SUCCESS,
    OTHER_USER_GET_MICS_FAILURE,
    USER_DELETE_MIC_REQUEST,
    USER_DELETE_MIC_SUCCESS,
    USER_DELETE_MIC_FAILURE,
    USER_UPDATE_MIC_REQUEST,
    USER_UPDATE_MIC_SUCCESS,
    USER_UPDATE_MIC_FAILURE,
    SET_PERMISSIONS,
    RESET_ERROR,
    USER_RESET_DATA,
    USER_RESET_PASSWORD_REQUEST,
    USER_RESET_PASSWORD_SUCCESS,
    USER_RESET_PASSWORD_FAILURE,
    updateUserProfile,
    getUserMics,
    getOtherUsersMics,
    deleteUserMic
  } from './UserActions';
  import * as Utils from '../../utils/utils'
  
  // Initial state
  const initialState = fromJS({
    user: {},
    settings: {
      location: false,
      notification: false
    },
    loading: false,
    error: {},
    facebookUser: {},
    mics: []
  });
  
  // Reducer
  export default function UserReducer(state = initialState, action = {}) {
  
    let oldSettings = Utils.toJS(state.get('settings'))
    switch (action.type) {
      case SEND_OPT_REQUEST:
      case USER_RESET_PASSWORD_REQUEST:
      case USER_UPDATE_MIC_REQUEST:
        return state.set('loading', true).set('error', false);
      case REGISTER_USER_REQUEST:
      case FACEBOOK_USER_SIGNUP_REQUEST:
        return state.set('loading', true)
          .set('error', false)
          .set('user', {})
          .set('settings', {});
      case USER_LOGIN_REQUEST:
      case FACEBOOK_USER_LOGIN_REQUEST:
        return state.set('loading', true)
          .set('error', false)
          .set('user', {});
      case SEND_OPT_SUCCESS:
      case USER_RESET_PASSWORD_SUCCESS:
      case USER_UPDATE_MIC_SUCCESS:
        return state.set('loading', false);
      case REGISTER_USER_SUCCESS:
      case USER_LOGIN_SUCCESS:
        return state.set('loading', false).set('user', fromJS(action.payload));
      case SET_LOADING_STATUS:
        return state.set('loading', action.payload);
      case FACEBOOK_LOGIN_SUCCESS:
        return state.set('loading', false).set('facebookUser', action.payload)
      case FACEBOOK_USER_SIGNUP_SUCCESS:
      case FACEBOOK_USER_LOGIN_SUCCESS:
        return state.set('loading',false).set('user', action.payload);
      case RESET_ERROR:
        return state.set('error', false);
      case SET_PERMISSIONS:
        oldSettings[action.payload.type] = action.payload.value;
        return state.set('settings', oldSettings)
      case USER_UPDATE_PROFILE_REQUEST:
        return loop(
          state.set('loading', true).set('error', false),
          Effects.promise(() => updateUserProfile(action.payload.data, action.payload.callback))
        );
      case USER_UPDATE_PROFILE_SUCCESS:
        return state.set('loading',false).set('user', action.payload);
      case OTHER_USER_GET_MICS_REQUEST:
        return loop(
          state.set('loading', true).set('error', false).set('otherUserMics', []),
          Effects.promise(() => getOtherUsersMics(action.payload))
        );
      case OTHER_USER_GET_MICS_SUCCESS:
        return state.set('loading',false).set('otherUserMics', action.payload);
      case USER_GET_MICS_REQUEST:
        return loop(
          state.set('loading', true).set('error', false),
          Effects.promise(() => getUserMics(action.payload))
        );
      case USER_GET_MICS_SUCCESS:
        return state.set('loading',false).set('mics', action.payload);
      case USER_DELETE_MIC_REQUEST:
        return loop(
          state.set('loading', true).set('error', false),
          Effects.promise(() => deleteUserMic(action.payload))
        );
      case USER_DELETE_MIC_SUCCESS:
        let mics = Utils.toJS(state.get('mics'));
        console.log('USER_MICS: ', mics, 'DELTED_MIC_ID', action.payload.micId);
        filteredMics = mics.filter(mic => action.payload.micId !== mic._id);
        return state.set('loading',false).set('mics', filteredMics);
  
      case USER_RESET_DATA:
        return state.set('user', {})
          .set('facebookUser', {})
          .set('settings', {location: false, notification: false})
          .set('mics', []);
      case SEND_OPT_FAILURE:
      case USER_LOGIN_FAILURE:
      case REGISTER_USER_FAILURE:
      case FACEBOOK_LOGIN_FAILURE:
      case FACEBOOK_USER_SIGNUP_FAILURE:
      case FACEBOOK_USER_LOGIN_FAILURE:
      case USER_UPDATE_PROFILE_FAILURE:
      case USER_GET_MICS_FAILURE:
      case OTHER_USER_GET_MICS_FAILURE:
      case USER_DELETE_MIC_FAILURE:
      case USER_RESET_PASSWORD_FAILURE:
      case USER_UPDATE_MIC_FAILURE:
        return state.set('error', action.payload).set('loading',false)
      default:
        return state;
    }
  }
  