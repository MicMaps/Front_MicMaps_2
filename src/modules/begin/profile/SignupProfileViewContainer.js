import {connect} from 'react-redux';
import SignupProfileView from './SignupProfileView';

export default connect(
  state => ({
    loading: state.getIn(['user', 'loading']),
    error: state.getIn(['user', 'error']),
    user: state.getIn(['user', 'user']),
  })
)(SignupProfileView);