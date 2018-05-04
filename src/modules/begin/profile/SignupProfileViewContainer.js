import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {NavigationActions} from 'react-navigation';
import SignupProfileView from './SignupProfileView';

export default connect(
  state => ({
    loading: state.getIn(['user', 'loading']),
    error: state.getIn(['user', 'error']),
    user: state.getIn(['user', 'user']),
  }),
  dispatch => {
    return {
      navigate: bindActionCreators(NavigationActions.navigate, dispatch),
      dispatch:dispatch
    };
  }
)(SignupProfileView);