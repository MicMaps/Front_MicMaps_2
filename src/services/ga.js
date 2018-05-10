import {GoogleAnalyticsTracker} from 'react-native-google-analytics-bridge';
import {getConfiguration} from '../utils/configuration';

const GATracker = new GoogleAnalyticsTracker(getConfiguration('GOOGLE_ANALYTICS_TRACKING_ID'));

export default GATracker;
