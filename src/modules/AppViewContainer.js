import {connect} from 'react-redux';
import AppView from './AppView';
import {withDeepLinking, DeepLinking} from 'react-native-deep-link';
import NavigationService from '../services/navigationService';

const handleMicScreenDeepLink = ({ dispatch }) => ({ params: { micId } }) => {
  NavigationService.navigate('MicInfo',{ micId });
}



DeepLinking.registerRoute('micmaps:', '/mic/:micId', handleMicScreenDeepLink);

export default connect(
  state => ({
    isReady: state.getIn(['session', 'isReady'])
  })
)(withDeepLinking(AppView));
