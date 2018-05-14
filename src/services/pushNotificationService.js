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
     if(notification.userInteraction) {
         if(notification.data.type == "mic") {
            NavigationService.navigate('MicInfo', {micId: notification.data.micId});
         }
     }
     if(AppState.currentState == 'active' && !notification.userInteraction) {
        Alert.alert(
            'MicMaps Notification',
            notification.data.message,
            [
              {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
              {text: 'Show Mic', onPress: () => NavigationService.navigate('MicInfo', {micId: notification.data.micId, onBackPress: () => NavigationService.back()})}
            ],
            {cancelable: false}
          )
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
   requestPermissions: true

 });
};

export default PNConfigure;
