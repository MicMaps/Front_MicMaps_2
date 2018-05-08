import {connect} from 'react-redux';
import LandingView from './LandingView';

export default connect(
  state => ({
    loading: state.getIn(['user', 'loading']),
    error: state.getIn(['user', 'error'])
  })
)(LandingView);
