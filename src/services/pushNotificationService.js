import PushNotification from 'react-native-push-notification-ce';
import {Platform, PushNotificationIOS, Alert, AppState} from 'react-native';
import {getAuthenticationToken, getPushNotificationToken, setPushNotificationToken} from '../utils/authentication';
import {getConfiguration} from '../utils/configuration';
import * as UserService from './user';
import NavigationService from './navigationService';

const PNConfigure = () => {
 console.log("configuring PN...")   
 PushNotification.configure({

   onRegister: async function(token) {
     //process token
     console.log(token)
        try {
            const authToken = await getAuthenticationToken();
            const previousToken =  await getPushNotificationToken();
            console.log(authToken, token.token, previousToken)
            if(authToken) {
                // Update token on the user profile on server. Send both oldToken as well as newToken
                UserService.updateDeviceToken(previousToken, token.token, Platform.OS)
            }
            if(token.token == previousToken) {
                return;
            }
            setPushNotificationToken(token.token)
        } catch (error) {
            console.log((new Error(error)))
        }
   },

   onNotification: function(notification) {
     // process the notification
     console.log(notification)
     const data = notification.data?notification.data:notification

     if(notification.userInteraction) {
         if(data.type == "mic") {
            setTimeout(() => NavigationService.navigate('MicInfo', {micId: data.micId}))
            ;
         }
     }
     if(AppState.currentState == 'active' && !notification.userInteraction) {
        if(data.type == "mic") {
            Alert.alert(
                'MicMaps Notification',
                data.message,
                [
                  {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
                  {text: 'Show Mic', onPress: () => NavigationService.navigate('MicInfo', {micId: data.micId, onBackPress: () => NavigationService.back()})}
                ],
                {cancelable: false}
              )
        } else {
            Alert.alert(
                'MicMaps Notification',
                data.message,
                [
                  {text: 'OK', onPress: () => console.log('OK Pressed'), style: 'default'},
                ],
                {cancelable: false}
              )
        }
        
     }
     // required on iOS only
     notification.finish(PushNotificationIOS.FetchResult.NoData);
   },

   senderID: getConfiguration('FCM_SENDER_ID'),
   permissions: {
     alert: true,
     badge: true,
     sound: true
   },

   popInitialNotification: true,
   requestPermissions: true,
   hasPoppedInitialNotification: false

 });
};

export default PNConfigure;