import {connect} from 'react-redux';
import PermissionsView from './PermissionsView';

export default connect(
  state => ({
    user: state.getIn(['user', 'user']),
    loading: state.getIn(['user', 'loading']),
    error: state.getIn(['user', 'error'])
  })
)(PermissionsView);
