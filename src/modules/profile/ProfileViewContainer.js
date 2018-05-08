import {connect} from 'react-redux';
import ProfileView from './ProfileView';

export default connect(
  state => ({
    user: state.getIn(['user', 'user']),
    loading: state.getIn(['user', 'loading']),
    error: state.getIn(['user', 'error']),
    userMics: state.getIn(['user', 'mics']),
    mics: state.getIn(['mics', 'mics'])
  })
)(ProfileView);
