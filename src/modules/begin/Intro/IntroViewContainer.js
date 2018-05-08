import {connect} from 'react-redux';
import IntroView from './IntroView';

export default connect(
    state => ({
        loading: state.getIn(['user', 'loading']),
        error: state.getIn(['user', 'error'])
    })
)(IntroView);
