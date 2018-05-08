import {connect} from 'react-redux';
import MicInfoView from './MicInfoView';

export default connect(
  state => ({
    loading: state.getIn(['mics', 'loading']),
    error: state.getIn(['mics', 'error']),
    recentMic: state.getIn(['mics', 'recentMic'])
  })
)(MicInfoView);
