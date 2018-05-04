import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {NavigationActions} from 'react-navigation';
import IntroView from './IntroView';

export default connect(
    state => ({
        loading: state.getIn(['user', 'loading']),
        error: state.getIn(['user', 'error'])
    }),
   dispatch => {
     return {
       navigate: bindActionCreators(NavigationActions.navigate, dispatch),
       dispatch:dispatch
     };
   }
)(IntroView);
