import {connect} from 'react-redux';
import UseLocationView from './UseLocationView';

export default connect(
  state => ({
    loading: state.getIn(['user', 'loading']),
    error: state.getIn(['user', 'error']),
    userSettings: state.getIn(['user', 'settings'])
  })
)(UseLocationView);
