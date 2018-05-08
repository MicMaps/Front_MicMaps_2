import {connect} from 'react-redux';
import VerifyOtpView from './VerifyOtpView';

export default connect(
  state => ({
    loading: state.getIn(['user', 'loading']),
    error: state.getIn(['user', 'error']),
    settings: state.getIn(['user', 'settings'])
  })
)(VerifyOtpView);
