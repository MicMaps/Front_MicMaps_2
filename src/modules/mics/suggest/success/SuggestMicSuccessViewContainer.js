import {connect} from 'react-redux';
import SuggestMicSuccessView from './SuggestMicSuccessView';

export default connect(
  state => ({
    loading: state.getIn(['mics', 'loading']),
    error: state.getIn(['mics', 'error'])
  })
)(SuggestMicSuccessView);
