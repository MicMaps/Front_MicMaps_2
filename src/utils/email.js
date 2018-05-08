import {Linking} from 'react-native';

export const EMAIL_DEFAULT_ID = 'tierney@micmaps.com';
export const EMAIL_DEFAULT_SUBJECT = 'Mics Lover';
export const EMAIL_DEFAULT_BODY = 'I am looking for great mics';

export function requestSendMail(toEmail = EMAIL_DEFAULT_ID, subject = EMAIL_DEFAULT_SUBJECT, body = EMAIL_DEFAULT_BODY) {
  let mailUrl = 'mailto:'+toEmail+'?subject='+subject+'&body='+body;
  //console.log("MAIL_QUERY_STRING", mailUrl);
  return Linking.openURL(mailUrl);
}
