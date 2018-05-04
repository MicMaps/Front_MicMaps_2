import React, {PropTypes, Component} from 'react';
import {connect} from 'react-redux';
import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Image
} from 'react-native';
import Ionicon from 'react-native-vector-icons/Ionicons'
import SnapCarousel from '../../../components/carousel/SnapCarousel'
import SliderEntry from '../../../components/carousel/SliderEntry'
import Pagination from '../../../components/carousel/Pagination'
import { sliderWidth, itemWidth } from '../../../components/carousel/SliderEntry.style'
import * as Utils from '../../../utils/utils'
import * as ViewUtils from '../../../utils/viewUtils'
import * as UserActions from '../../../redux/user/UserActions'
import MicIcon from '../../../../images/micLogo2x.png'
import StageIcon from '../../../../images/stageIcon2x.png'
import MicIconGreen from '../../../../images/micIconGreen2x.png'
import MapIcon from '../../../../images/mapIcon2x.png'
import MicMapsLogo from '../../../../images/MicMaps_ICON.png'
// import GATracker from '../../../services/ga'

class IntroView extends Component {
  static displayName = 'IntroView';

  constructor(props) {
    super(props)
    this.state={
      activeSlide: 0,
      entries : [
        {
          image: {
            src: MicIcon,
            width: 190,
            height: 190
          },
          description: 'Welcome to Mic Maps! The Shortest Distance Between You and Your Audience.',
          backgroundColor: ViewUtils.COLOR_THEME_GREEN
        },
        {
          image: {
            src: MicIconGreen,
            width: 190,
            height: 190
          },
          description: 'It\'s kinda like Grindr... \nBut instead of dicks, we connect you with all the nearby mics!',
          backgroundColor: ViewUtils.COLOR_THEME_BLUE
        },
        {
          image: {
            src: MapIcon,
            width: 148,
            height: 160
          },
          description: 'Never miss an opportunity for stagetime near you!',
          backgroundColor: ViewUtils.COLOR_THEME_LIGHT_GREEN
        }
      ],
      isReady: false,
      pageVisited: false,
    }

    this.getSlides = this.getSlides.bind(this);
    this.handleUserSavedData = this.handleUserSavedData.bind(this);
  }
  componentDidMount() {
    //GATracker.trackScreenView('Intoduction Screen')
  }
  componentWillMount() {
    this.handleUserSavedData();
  }

  render() {

    const {activeSlide, entries, isReady, pageVisited} = this.state;

    return !isReady ? (
      <View style={styles.container}>
        <View style={styles.loaderContainer}>
          <ActivityIndicator animating={true}
            style={styles.loader}
            size={'large'}
            color={ViewUtils.COLOR_THEME_GREEN}/>
        </View>
      </View>
    ) : pageVisited ? (
      <View style={styles.logoImageContainer}>
        <Image source={MicMapsLogo} style={styles.logoImage} />
        <Text style={styles.appNameText}>MicMaps</Text>
      </View>
    ) : (
      <View style={styles.container}>
        <View style={styles.carouselContainer}>
          <SnapCarousel
            ref={(snapCarousel) => { this._carousel = snapCarousel; }}
            style={styles.carousel}
            sliderWidth={sliderWidth}
            itemWidth={itemWidth}
            firstItem={activeSlide}
            inactiveSlideScale={0.92}
            inactiveSlideOpacity={1}
            enableMomentum={false}
            containerCustomStyle={styles.slider}
            contentContainerCustomStyle={styles.sliderContainer}
            showsHorizontalScrollIndicator={false}
            snapOnAndroid={true}
            removeClippedSubviews={false}
            onSnapToItem={(index) => this.setState({ activeSlide: index }) }>
              { this.getSlides() }
          </SnapCarousel>
        </View>
        <View style={styles.paginationContainer}>
          <Pagination
              dotsLength={entries.length}
              activeDotIndex={activeSlide}
              dotStyle={{
                  width: 10,
                  height: 10,
                  borderRadius: 6,
                  marginHorizontal: 8,
                  backgroundColor: ViewUtils.COLOR_THEME_BLUE
              }}
              inactiveDotOpacity={0.5}
              inactiveDotScale={0.6} />
          {activeSlide == 2 ? (
            <TouchableOpacity style={styles.getStartedButton} onPress={() => this.props.navigate({routeName:'Landing'})}>
              <Text style={styles.getStartedText}>Get Started</Text>
              <Ionicon style={styles.getStartedButtonIcon} name='ios-arrow-forward'/>
            </TouchableOpacity>
          ) : null}
        </View>
      </View>
    );
  }

  handleUserSavedData() {
    const {authenticated} = this.props
    this.props.dispatch(UserActions.loadRememberMeStatus(response => {
      console.log("GET_REMEMBER_ME_STATUS_RESPONSE", response);
      if(response.status && response.data === 'yes') {
        this.setState({isReady: true, pageVisited: true}, () => {
          //Actions.main();
        });
      } else {
        this.props.dispatch(UserActions.resetUserData())
        this.props.dispatch(UserActions.setLoadingStatus(false))

        Utils.isIntroPageVisited().then(isVisited => {
          console.log("isIntroPageVisited", isVisited);
          if(isVisited === 'yes') {
            this.props.navigate({routeName:'Landing'})
            this.setState({isReady: true, pageVisited: true});
          }
          else {
            Utils.setIntroPageVisited(true);
            this.setState({isReady: true});
          }
        })

      }
    }));
  }

  getSlides() {

    const {entries} = this.state;
    return entries.map((entry, index) => {
        return (
            <SliderEntry
              key={`carousel-entry-${index}`}
              entry={entry} />
        )
    });
  }
}

const styles = StyleSheet.create({
  container: {
    flex:1,
    flexDirection: 'column'
  },
  loaderContainer: {
    flex: 1,
    width: ViewUtils.WINDOW_WIDTH,
    alignItems: 'center',
    justifyContent: 'center'
  },
  logoImageContainer: {
    flex:1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
  },
  logoImage: {
    width: 208,
    height: 208,
  },
  appNameText: {
    fontSize: 24,
    color: ViewUtils.COLOR_THEME_BLUE,
    paddingTop: 30
  },
  carouselContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop:100
  },
  paginationContainer: {
    height: 70,
    width: ViewUtils.WINDOW_WIDTH,
    position: 'relative'
  },
  getStartedButton: {
    position: 'absolute',
    right: 0,
    bottom: 10,
    height: 54,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center'
  },
  getStartedText: {
    fontSize: 16,
    color: ViewUtils.COLOR_THEME_GREEN
  },
  getStartedButtonIcon: {
    fontSize: 24,
    color: ViewUtils.COLOR_THEME_GREEN,
    paddingLeft: 8,
    paddingTop:4
  }
});

export default IntroView
