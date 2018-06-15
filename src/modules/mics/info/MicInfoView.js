import React, {Component} from 'react';
import {
  Text,
  View,
  Image,
  TouchableOpacity,
  StyleSheet
} from 'react-native';
import * as Utils from '../../../utils/utils';
import * as ViewUtils from '../../../utils/viewUtils';
import * as MicActions from '../../../redux/mics/MicActions';
import GlobalStyles from '../../../styles/globalStyles';
import MicMapsViewHeader from '../../../components/headers/micMapsViewHeader.js';
import MicInfo from '../../../components/mics/details/micInfo';
import Loader from '../../../components/modals/loader/loader';
import ThumbsUpImage from '../../../../images/thumbsUp.png';
import ThumbsDownImage from '../../../../images/thumbsDown.png';
import AlertBar from '../../../components/alert-bar/alertBar';
import {NavigationActions} from 'react-navigation';
import GATracker from '../../../services/ga';

class MicsInfoView extends Component {
  static displayName = 'MicsInfoView';

  constructor(props) {
    super(props);
    this.state = {
      successMessage: '',
      loading: false
    };

    this.calculateMicRating = this.calculateMicRating.bind(this);
    this.reportMic = this.reportMic.bind(this);
    this.renderSuccess = this.renderSuccess.bind(this);
    this.showHostInfo = this.showHostInfo.bind(this);
  }

  componentDidMount() {

    const micId = this.props.navigation.state.params?this.props.navigation.state.params.micId:null;
    const recentMic = Utils.toJS(this.props.recentMic);
    if (recentMic && micId && recentMic._id === micId) {
        return;
    }
    if (micId) {
      this.setState({loading: true})
      this.props.dispatch(MicActions.getMicDetails(micId, (result) => {
        this.setState({loading: false})
      }));
    }
    GATracker.trackScreenView('Mics Detail View Screen')
  }

  render() {

    const {viewMode, isUserMic, onBackPress} = this.props.navigation.state.params;
    const {loading} = this.state;
    const micInfo = Utils.toJS(this.props.recentMic);
    const micDate = this.props.navigation.state.params? this.props.navigation.state.params.micDate ? this.props.navigation.state.params.micDate : this.props.navigation.state.params.micFilterDate : null;

    //console.log('MIC_INFO_VIEW_PROPS', this.props)

    return (
      <View style={styles.container}>
        <MicMapsViewHeader
          viewMode={viewMode ? viewMode : 'list'}
          onLeftButtonPress={() => {
            if(onBackPress) {
                onBackPress()
            }
            else {
              Utils.resetNavigation(this.props.navigation, 0, [{routeName: 'Main', params: {viewMode: 'list'}}]);
            }
          }}
          onRightButtonPress={() => this.props.navigation.navigate({routeName: 'Profile'})}
          navigation = {this.props.navigation} />
        
        <View style={styles.topView}>
        {
          !loading ?
          <MicInfo mic={micInfo}
            viewMode={'details'}
            micDate={micDate}
            isUserMic={isUserMic}
            showHostInfo={this.showHostInfo(micInfo)}
          />
          : <Text>Loading Mic Details..</Text>
        }

        </View>
        <View style={styles.bottomView}>
          { viewMode !== 'view' ? (
            <View style={[GlobalStyles.likeDislikeButton, {marginTop: 5}]}>
              <View style={GlobalStyles.likeButton}>
                <TouchableOpacity
                  style={GlobalStyles.likeDislikeButtonContent}
                  onPress={() => this.upvoteMic(micInfo._id)}>
                  <Text style={GlobalStyles.likeButtonText}>LOVED IT</Text>
                  <Image style={[GlobalStyles.thumbsIcon, {marginBottom: 6}]} source={ThumbsUpImage} />
                </TouchableOpacity>
              </View>
              <View style={GlobalStyles.dislikeButton}>
                <TouchableOpacity
                  style={GlobalStyles.likeDislikeButtonContent}
                  onPress={() => this.downvoteMic(micInfo._id)}>
                  <Text style={GlobalStyles.dislikeButtonText}>I'VE HAD BETTER</Text>
                  <Image style={[GlobalStyles.thumbsIcon, {marginTop: 6}]} source={ThumbsDownImage} />
                </TouchableOpacity>
              </View>
            </View>
          ) : null }
          {viewMode !== 'view' ? (
            <TouchableOpacity
              activeOpacity={0.5}
              style={[GlobalStyles.button, GlobalStyles.buttonBlueOutlined, {marginBottom: 0}]}
              onPress={() => this.reportMic(micInfo._id)}>
              <Text style={[GlobalStyles.buttonBlueOutlinedText, {fontSize: 18}]}>REPORT INACTIVE MIC</Text>
            </TouchableOpacity>
          ) : null}
        </View>
        <Loader visibility={loading} />
        {this.renderSuccess()}
      </View>
    );
  }

  renderSuccess() {
    const {successMessage} = this.state;
    if(successMessage) setTimeout(() => this.setState({successMessage: ''}), 8000)
    return <AlertBar message={successMessage} type='success' />
  }

  calculateMicRating() {

    const mic = Utils.toJS(this.props.recentMic);
    let downVotes = !mic.noOfThumbsDown ? 0 : parseInt(mic.noOfThumbsDown);
    let upVotes = !mic.noOfThumbsUp ? 0 : parseInt(mic.noOfThumbsUp);
    if(upVotes == 0 & downVotes == 0) return 0;
    //console.log(mic, 'downVotes: '+upVotes, 'downVotes: '+downVotes);
    return ((upVotes - downVotes) * 100) / (upVotes + downVotes);
  }

  upvoteMic(micId) {
    if(!micId) return;
    this.props.dispatch(MicActions.voteMicRequest(micId, true, response => {
      //console.log('VOTE_MIC_RESPONSE', response)
    }))
  }

  downvoteMic(micId) {
    if(!micId) return;
    this.props.dispatch(MicActions.voteMicRequest(micId, false, response => {
      //console.log('VOTE_MIC_RESPONSE', response)
    }))
  }

  showHostInfo(micInfo) {
    return () => {
      console.log(micInfo)
      this.props.navigation.dispatch(NavigationActions.navigate({routeName: 'UserProfile', params: {hostName: micInfo.hostName, micOwner: micInfo.submittedBy}}));
    };
  }
  reportMic(micId) {
    this.props.dispatch(MicActions.reportMicRequest(micId, response => {
      console.log('REPORT_MIC_RESPONSE', response)
      if(response.status) {
        this.setState({
          successMessage: 'Your report has been submitted. Our admins will review it. Thanks.'}
        );
      }
    }))
  }
}

const styles = StyleSheet.create({
  container: {
    flex:1,
    flexDirection: 'column',
    backgroundColor: '#EEE'
  },
  headerTitleText: {
    fontSize: 16,
    color: '#444'
  },
  topView: {
    flex:1,
    flexDirection: 'column',
    paddingTop:15,
    width: ViewUtils.WINDOW_WIDTH,
    alignItems: 'center'
  },
  bottomView: {
    height: 150,
    width: ViewUtils.WINDOW_WIDTH,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
  },
  header: {
    height: 90,
    width: ViewUtils.WINDOW_WIDTH,
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 30,
  },
  titleText: {
    fontSize: 15,
    color: '#666',
    fontWeight: 'bold',
    marginTop:5
  },
  subTitleText: {
    fontSize: 15,
    color: '#666',
    marginTop: 5
  },
  headerImage: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: '#CCC',
    marginHorizontal: 18
  },
  headerContent: {
    flex: 1,
    height: 54,
    paddingLeft: 6,
    flexDirection: 'column',
  },
  detailsContainer: {
    marginHorizontal: 15,
    flexDirection: 'column'
  },
  detailText: {
    fontSize: 12,
    color: '#888',
    marginTop:8
  },
  ratingPercentCircle: {
    width: 110,
    height:110,
    borderRadius: 55,
    backgroundColor: '#D8D8D8',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  ratingPercentText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#888'
  },
  ratingIcon: {
    fontSize: 48,
    color: '#CCC',
    marginLeft: 15,
  }
});

export default MicsInfoView;
