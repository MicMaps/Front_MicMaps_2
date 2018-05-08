import {connect} from 'react-redux';
import UserProfileView from './UserProfileView';

export default connect(
  state => ({
    user: state.getIn(['user', 'user']),
    loading: state.getIn(['user', 'loading']),
    error: state.getIn(['user', 'error']),
    userMics: state.getIn(['user', 'otherUserMics']),
    mics: state.getIn(['mics', 'mics'])
  })
)(UserProfileView);
