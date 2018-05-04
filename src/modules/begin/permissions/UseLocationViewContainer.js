import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {NavigationActions} from 'react-navigation';
import UseLocationView from './UseLocationView';

export default connect(
  state => ({
    loading: state.getIn(['user', 'loading']),
    error: state.getIn(['user', 'error']),
    userSettings: state.getIn(['user', 'settings'])
  }),
  dispatch => {
    return {
      navigate: bindActionCreators(NavigationActions.navigate, dispatch),
      dispatch:dispatch
    };
  }
)(UseLocationView);
