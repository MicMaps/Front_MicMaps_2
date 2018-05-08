import {connect} from 'react-redux';
import MainView from './MainView';

export default connect(
  state => ({
    loading: state.getIn(['mics', 'loading']),
    error: state.getIn(['mics', 'error']),
    mics: state.getIn(['mics', 'mics']),
    searchResults: state.getIn(['mics', 'searchResults']),
    userSettings: state.getIn(['user', 'settings']),
    micMapsState: state.getIn(['mics', 'micMapsState'])
  })
)(MainView);
