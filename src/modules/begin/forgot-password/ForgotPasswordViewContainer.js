import {connect} from 'react-redux';
import ForgotPasswordView from './ForgotPasswordView';

export default connect(
  state => ({
    loading: state.getIn(['user', 'loading']),
    error: state.getIn(['user', 'error'])
  })
)(ForgotPasswordView);
