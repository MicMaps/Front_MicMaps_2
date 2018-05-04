import {get, post, put, del} from '../utils/api';
import * as ConfigurationUtils from '../utils/configuration'
import QueryBuilder from 'query-string';

export function fetchMics(data) {
  let query = QueryBuilder.stringify(data);
  //console.log('FETCH_MICS_QUERY', `/mics/location?${query}`);
  return get(`/mics/location?${query}`, true)
}

export function fetchMicDetails(data) {
  return get(`/mic/${data}`)
}

export function suggestMic(data) {
  //alert(JSON.stringify(data))
  return post('/mics/suggest', {mic: data})
}

export function voteMic(micId, vote) {
  //console.log('VOTE_MIC_PAYLOAD', {id: micId, vote: vote.toString()})
  return post('/mics/vote', {id: micId, vote: vote.toString()})
}

export function reportMic(micId) {
  //console.log('REPORT_MIC_PAYLOAD', {id: micId, status:'canceled'})
  return post('/mics/report', {id: micId, status:'canceled'})
}

export function search(data) {
  let query = QueryBuilder.stringify({s: data});
  //console.log('SEARCH_MICS_QUERY_STRING', `/mics/search?${query}`);
  return get(`/mics/search?${query}`)
}

export function getPlaceDetailsFromGoogle(placeID) {
  let query = QueryBuilder.stringify({placeid: placeID, key:ConfigurationUtils.getConfiguration('GOOGLE_PLACES_API_KEY')});
  //console.log('SEARCH_MICS_QUERY_STRING', `/mics/search?${query}`);
  return get(`https://maps.googleapis.com/maps/api/place/details/json?${query}`)
}
