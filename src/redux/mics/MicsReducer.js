import {
    fromJS
  } from 'immutable';
  import {
    loop,
    Effects
  } from 'redux-loop-symbol-ponyfill';
  import * as Utils from '../../utils/utils';
  
  import {
    GET_MICS_REQUEST,
    GET_MICS_SUCCESS,
    GET_MICS_FAILURE,
    GET_MIC_DETAILS_REQUEST,
    GET_MIC_DETAILS_SUCCESS,
    GET_MIC_DETAILS_FAILURE,
    SUGGEST_MIC_POST_REQUEST,
    SUGGEST_MIC_POST_SUCCESS,
    SUGGEST_MIC_POST_FAILURE,
    VOTE_MIC_REQUEST,
    VOTE_MIC_SUCCESS,
    VOTE_MIC_FAILURE,
    SEARCH_MICS_REQUEST,
    SEARCH_MICS_SUCCESS,
    SEARCH_MICS_FAILURE,
    SET_LOADING_STATUS,
    REPORT_MIC_REQUEST,
    REPORT_MIC_SUCCESS,
    REPORT_MIC_FAILURE,
    UPLOAD_MIC_IMAGE_REQUEST,
    UPLOAD_MIC_IMAGE_SUCCESS,
    UPLOAD_MIC_IMAGE_FAILURE,
    SET_MIC_MAPS_STATE,
    RESET_ERROR,
    getMics,
    getMicDetails,
    voteMic,
    searchMics,
  } from './MicActions';
  
  // Initial state
  const initialState = fromJS({
    loading: false,
    error: {},
    mics: [],
    recentMic: {},
    suggestedMic: {},
    searchResults: [],
    micMapsState: false
  });
  
  // Reducer
  export default function MicsReducer(state = initialState, action = {}) {
  
    let mics = Utils.toJS(state.get('mics'));
    switch (action.type) {
  
      case GET_MICS_REQUEST:
        return state.set('loading', true).set('error', false).set('mics', []);
  
      case GET_MIC_DETAILS_REQUEST:
        return state.set('loading', true).set('error', false).set('recentMic', {});
  
      case GET_MICS_SUCCESS:
        return state.set('loading', false).set('mics', action.payload)
  
      case GET_MIC_DETAILS_SUCCESS:
        return state.set('loading', false).set('recentMic', action.payload)
  
      case VOTE_MIC_REQUEST:
      case UPLOAD_MIC_IMAGE_REQUEST:
        return state.set('loading', true).set('error', false)
  
      case VOTE_MIC_SUCCESS:
        let votedMic = action.payload
        mics = mics.filter(mic => {
          if(votedMic._id === mic._id) {
            mic.noOfThumbsDown = votedMic.noOfThumbsDown;
            mic.noOfThumbsUp = votedMic.noOfThumbsUp;
          }
          return true;
        })
        return state.set('loading', false).set('mics', mics).set('recentMic', action.payload)
  
      case SUGGEST_MIC_POST_REQUEST:
        return state.set('loading', true).set('error', false);
  
      case SUGGEST_MIC_POST_SUCCESS:
        return state.set('loading', false).set('recentMic', action.payload);
  
      case SEARCH_MICS_REQUEST:
        return state.set('loading', true).set('error', false).set('searchResults', []);
  
      case SEARCH_MICS_SUCCESS:
        return state.set('loading', false).set('searchResults', action.payload);
  
      case REPORT_MIC_REQUEST:
        return state.set('loading', true).set('error', false);
  
      case REPORT_MIC_SUCCESS:
      case UPLOAD_MIC_IMAGE_SUCCESS:
        // let reportedMic = action.payload
        // filteredMics = mics.filter(mic => reportedMic._id !== mic._id)
        return state.set('loading', false);
  
      case SET_MIC_MAPS_STATE:
        return state.set('micMapsState', action.payload);
  
      case SET_LOADING_STATUS:
        return state.set('loading', action.payload);
  
      case RESET_ERROR:
        return state.set('error', false);
  
      case GET_MICS_FAILURE:
      case GET_MIC_DETAILS_FAILURE:
      case SUGGEST_MIC_POST_FAILURE:
      case VOTE_MIC_FAILURE:
      case SEARCH_MICS_FAILURE:
      case REPORT_MIC_FAILURE:
      case UPLOAD_MIC_IMAGE_FAILURE:
        return state.set('error', action.payload).set('loading',false)
  
      default:
        return state;
    }
  }
  