import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {NavigationActions} from 'react-navigation';
import VerifyOtpView from './VerifyOtpView';

export default connect(
  state => ({
    loading: state.getIn(['user', 'loading']),
    error: state.getIn(['user', 'error']),
    settings: state.getIn(['user', 'settings'])
  }),
  dispatch => {
    return {
      navigate: bindActionCreators(NavigationActions.navigate, dispatch),
      dispatch:dispatch
    };
  }
)(VerifyOtpView);
