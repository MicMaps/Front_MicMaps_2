import {connect} from 'react-redux';
import ConfirmMicView from './ConfirmMicView';

export default connect(
  state => ({
    loading: (state.getIn(['mics', 'loading']) || state.getIn(['user', 'loading'])),
    error: state.getIn(['mics', 'error']),
    user: state.getIn(['user', 'user'])
  })
)(ConfirmMicView);
