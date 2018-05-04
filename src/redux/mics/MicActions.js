import {
    fetchMics,
    fetchMicDetails,
    suggestMic,
    voteMic,
    reportMic,
    search
  } from '../../services/mics';
  
  import * as cloudinary from '../../services/cloudinary';
  import ImagePicker from 'react-native-image-picker';
  
  export const GET_MICS_REQUEST = 'GET_MICS_REQUEST'
  export const GET_MICS_SUCCESS = 'GET_MICS_SUCCESS'
  export const GET_MICS_FAILURE = 'GET_MICS_FAILURE'
  export const GET_MIC_DETAILS_REQUEST = 'GET_MIC_DETAILS_REQUEST'
  export const GET_MIC_DETAILS_SUCCESS = 'GET_MIC_DETAILS_SUCCESS'
  export const GET_MIC_DETAILS_FAILURE = 'GET_MIC_DETAILS_FAILURE'
  export const SUGGEST_MIC_POST_REQUEST = 'SUGGEST_MIC_POST_REQUEST'
  export const SUGGEST_MIC_POST_SUCCESS = 'SUGGEST_MIC_POST_SUCCESS'
  export const SUGGEST_MIC_POST_FAILURE = 'SUGGEST_MIC_POST_FAILURE'
  export const VOTE_MIC_REQUEST = 'VOTE_MIC_REQUEST'
  export const VOTE_MIC_SUCCESS = 'VOTE_MIC_SUCCESS'
  export const VOTE_MIC_FAILURE = 'VOTE_MIC_FAILURE'
  export const SEARCH_MICS_REQUEST = 'SEARCH_MICS_REQUEST'
  export const SEARCH_MICS_SUCCESS = 'SEARCH_MICS_SUCCESS'
  export const SEARCH_MICS_FAILURE = 'SEARCH_MICS_FAILURE'
  export const REPORT_MIC_REQUEST = 'REPORT_MIC_REQUEST'
  export const REPORT_MIC_SUCCESS = 'REPORT_MIC_SUCCESS'
  export const REPORT_MIC_FAILURE = 'REPORT_MIC_FAILURE'
  export const UPLOAD_MIC_IMAGE_REQUEST = 'UPLOAD_MIC_IMAGE_REQUEST';
  export const UPLOAD_MIC_IMAGE_SUCCESS = 'UPLOAD_MIC_IMAGE_SUCCESS';
  export const UPLOAD_MIC_IMAGE_FAILURE = 'UPLOAD_MIC_IMAGE_FAILURE';
  export const SET_MIC_MAPS_STATE = 'SET_MIC_MAPS_STATE';
  export const SET_LOADING_STATUS = 'SET_LOADING_STATUS'
  export const RESET_ERROR = 'RESET_ERROR'
  
  export async function getMicsRequest() {
    return {
      type: GET_MICS_REQUEST
    }
  }
  
  export async function getMicDetailsRequest(micId) {
    return {
      type: GET_MIC_DETAILS_REQUEST,
      payload: micId
    }
  }
  
  // export async function getMics(data) {
  //   return fetchMics(data)
  //     .then((res) => {
  //       //console.log('MICS_RESPONSE', res)
  //       return ({type: GET_MICS_SUCCESS, payload: res.data})
  //     })
  //     .catch((err) => ({type: GET_MICS_FAILURE, payload: err}));
  // }
  
  export async function getMics(data, callback) {
    return dispatch => {
      dispatch({ type: GET_MICS_REQUEST })
      return fetchMics(data).then(res => {
        dispatch({
          type: GET_MICS_SUCCESS,
          payload: res.data
        })
        if (callback) {callback({status: true, data: res.data})}
      }).catch(err => {
        dispatch({
          type: GET_MICS_FAILURE,
          payload: err
        })
        if (callback) {callback({status: false, data: err})}
      });
    };
  }
  
  // export async function getMicDetails(data) {
  //   return fetchMicDetails(data)
  //     .then((res) => ({type: GET_MIC_DETAILS_SUCCESS, payload: res.data}))
  //     .catch((err) => ({type: GET_MIC_DETAILS_FAILURE, payload: err}));
  // }
  
  export async function getMicDetails(data, callback) {
    return dispatch => {
      dispatch({ type: GET_MIC_DETAILS_REQUEST })
      return fetchMicDetails(data).then(res => {
        dispatch({
          type: GET_MIC_DETAILS_SUCCESS,
          payload: res.data
        })
        if (callback) {callback({status: true, data: res.data})}
      }).catch(err => {
        dispatch({
          type: GET_MIC_DETAILS_FAILURE,
          payload: err
        })
        if (callback) {callback({status: false, data: err})}
      });
    };
  }
  
  export async function suggestMicRequest(data, callback) {
    return dispatch => {
      dispatch({ type: SUGGEST_MIC_POST_REQUEST })
      return suggestMic(data).then(res => {
        dispatch({
          type: SUGGEST_MIC_POST_SUCCESS,
          payload: res.data
        })
        if (callback) {callback({status: true, data: res.data})}
      }).catch(err => {
        dispatch({
          type: SUGGEST_MIC_POST_FAILURE,
          payload: err
        })
        if (callback) {callback({status: false, data: err})}
      });
    };
  }
  
  export async function voteMicRequest(micId, vote, callback) {
    return dispatch => {
      dispatch({ type: VOTE_MIC_REQUEST })
      return voteMic(micId, vote).then(res => {
        dispatch({
          type: VOTE_MIC_SUCCESS,
          payload: res.data
        })
        if (callback) {callback({status: true, data: res})}
      }).catch(err => {
        dispatch({
          type: VOTE_MIC_FAILURE,
          payload: err
        })
        if (callback) {callback({status: false, data: err})}
      });
    };
  }
  
  export async function reportMicRequest(micId, callback) {
    return dispatch => {
      dispatch({ type: REPORT_MIC_REQUEST })
      return reportMic(micId).then(res => {
        dispatch({
          type: REPORT_MIC_SUCCESS,
          payload: res.data
        })
        if (callback) {callback({status: true, data: res})}
      }).catch(err => {
        dispatch({
          type: REPORT_MIC_FAILURE,
          payload: err
        })
        if (callback) {callback({status: false, data: err})}
      });
    };
  }
  
  export function pickMicImage(callback) {
    return dispatch => {
  
      var options = {
        title: 'Select Mic Image',
        customButtons: [],
        storageOptions: {
          skipBackup: true,
          path: 'images'
        }
      };
  
      
      ImagePicker.showImagePicker(options, (response) => {
        if (response.didCancel) {}
        else if (response.error) {}
        else if (response.customButton) {}
        else {
          dispatch({ type: UPLOAD_MIC_IMAGE_REQUEST})
          const imageUri = 'data:image/jpeg;base64,' + response.data
          if(callback) callback({status: true, data: {status: 'uploading', cloud: null}})
          cloudinary.uploadImage(imageUri).then((data) => {
            console.log("MIC_IMAGE_CLOUDINARY_RESPONSE", data);
            //const {secure_url} = data;
            dispatch({ type: UPLOAD_MIC_IMAGE_SUCCESS, payload: data })
            if(callback) callback({status: true, data: {status: 'uploaded', cloud: data}})
          }, (cloudinaryError) => {
  
            dispatch({type: UPLOAD_MIC_IMAGE_FAILURE})
            if(callback) callback({status: false, data: {error: cloudinaryError}})
          })
        }
      });
    }
  }
  
  export function setMicMapsState(data) {
  
    return {
      type: SET_MIC_MAPS_STATE,
      payload: data
    }
  }
  
  // export function searchMicsRequest(query) {
  //   return {
  //     type: SEARCH_MICS_REQUEST,
  //     payload: query
  //   }
  // }
  //
  // export function searchMics(data) {
  //   return search(data)
  //     .then((res) => ({type: SEARCH_MICS_SUCCESS, payload: res.data}))
  //     .catch((err) => ({type: SEARCH_MICS_FAILURE, payload: err}));
  // }
  
  export async function searchMicsRequest(query, callback) {
    return dispatch => {
      dispatch({ type: SEARCH_MICS_REQUEST })
      return search(query).then(res => {
        dispatch({
          type: SEARCH_MICS_SUCCESS,
          payload: res.data
        })
        if (callback) {callback({status: true, data: res.data})}
      }).catch(err => {
        dispatch({
          type: SEARCH_MICS_FAILURE,
          payload: err
        })
        if (callback) {callback({status: false, data: err})}
      });
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
  