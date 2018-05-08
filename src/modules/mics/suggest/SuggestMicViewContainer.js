import {connect} from 'react-redux';
import SuggestMicView from './SuggestMicView';

export default connect(
  state => ({
    user: state.getIn(['user', 'user']),
    loading: state.getIn(['mics', 'loading']),
    error: state.getIn(['mics', 'error'])
  })
)(SuggestMicView);
