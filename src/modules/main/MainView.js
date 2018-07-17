import React, {Component} from 'react';
import Permissions from 'react-native-permissions';
import {
  Text,
  View,
  Image,
  TextInput,
  Keyboard,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Alert,
  ToastAndroid,
  Linking
} from 'react-native';
import Moment from 'moment';
import * as Utils from '../../utils/utils';
import * as ViewUtils from '../../utils/viewUtils';
import * as MicActions from '../../redux/mics/MicActions';
import * as LocationUtils from '../../utils/location';
import Ionicon from 'react-native-vector-icons/Ionicons';
import RadarIcon from '../../../images/radarIcon2x.png';
import MicMapsViewHeader from '../../components/headers/micMapsViewHeader';
import MicMaps from './mic-maps/MicMapsView';
import DayPicker from '../../components/pickers/dayPicker';
import MicsList from '../../components/mics/list/micsList';
import Loader from '../../components/modals/loader/loader';
import AlertBar from '../../components/alert-bar/alertBar';
import {NavigationActions} from 'react-navigation';
import GATracker from '../../services/ga';

class MainView extends Component {
  static displayName = 'MainView';

  constructor(props) {
    super(props);
    this.state = {
      initialRegion: {
        latitude: 34.0502,
        longitude: -118.257,
        latitudeDelta: 0.1,
        longitudeDelta: 0.1
      },
      currentLocation: false,
      micsDate: new Date(),
      viewMode: 'map',
      searchQuery: '',
      micsList: [],
      isSearchResultsLoaded: false,
      loading:false
    };

    this.onSelectMicsDay = this.onSelectMicsDay.bind(this);
    this.loadMics = this.loadMics.bind(this);
    this.toggleViewMode = this.toggleViewMode.bind(this);
    this.onPressMarker = this.onPressMarker.bind(this);
    this.showMicInfo = this.showMicInfo.bind(this);
    this.renderError = this.renderError.bind(this);
    this.onMicsSearchRequest = this.onMicsSearchRequest.bind(this);
    this.onExitSearch = this.onExitSearch.bind(this);
    this.updateCurrentLocation = this.updateCurrentLocation.bind(this);
    this.loadCurrentLocation = this.loadCurrentLocation.bind(this);
    this.onRegionChange = this.onRegionChange.bind(this);
    this.micLoadDebounce = null;
    this.currentRegion = null;
    this.previousRegion = null;
  }

  componentDidMount() {

    const viewMode = this.props.navigation.state.params?this.props.navigation.state.params.viewMode:undefined;

    if (viewMode) {
      this.setState({viewMode});
    }

    Permissions.check('location')
      .then(response => {
        if (response !== 'authorized') {
          this.props.navigation.navigate({routeName: 'Permissions' })
          Alert.alert('', 'Please enable location permission to view mics');
        } else {
          if (Platform.OS === 'android') {
            LocationUtils.checkAndroidLocationSettings((status, message) => {
              if (status) {
                this.updateCurrentLocation();
              }
              else {
                Alert.alert('','Please enable your location settings to view mics');
              }
            });
          } else {
            this.updateCurrentLocation();
          }
        }
        console.log('Location permissions check response: ', response)
      });

    this.props.dispatch(MicActions.setLoadingStatus(false));
    if (this.state.viewMode == 'map') {
      GATracker.trackScreenView('Mics Map Main View Screen')
    }
    if (this.state.viewMode == 'list') {
      GATracker.trackScreenView('Mics List Main View Screen')
    }
  }

  render() {

    //console.log('MAIN_VIEW_PROPS', this.props)
    //console.log('MAIN_VIEW_STATE', this.state)

    const {micsDate, viewMode, initialRegion, currentLocation, micsList, searchQuery, isSearchResultsLoaded} = this.state;
    const mics = Utils.toJS(this.props.mics);
    const searchResults = isSearchResultsLoaded ? Utils.toJS(this.props.searchResults) : [];
    const micsToMap = searchQuery ? searchResults : mics;
    const micsToList = searchQuery ? searchResults : micsList.length > 1 ? micsList : mics;
    const {loading} = this.state;
    return (
      <View style={styles.container}>
        <MicMapsViewHeader
          viewMode={viewMode === 'map' ? 'list' : 'map'}
          onLeftButtonPress={() => this.toggleViewMode()}
          onRightButtonPress={() => this.props.navigation.navigate({routeName: 'Profile'})}
          navigation = {this.props.navigation} />    
       
        {viewMode === 'map' ? (
          <MicMaps
            initialRegion={initialRegion}
            locations={micsToMap}
            onPressMarker={this.onPressMarker}
            onPressMarkerCallout={this.showMicInfo}
            onRegionChange={this.onRegionChange}
            currentLocation = {currentLocation}
            ref={(mp) => this.mapView = mp}/>
        ) : null}
        {viewMode === 'list' ? (micsToList && micsToList.length > 0) ? (
          <MicsList
            mics={micsToList}
            style={styles.micsListContainer}
            onSelectMic={this.showMicInfo} 
            isSearchResult = {isSearchResultsLoaded}
            searchQuery = {searchQuery}
            />
        ) : (
          <View style={styles.noMicsContainer}>
            <Text style={styles.noMicsText}>No mics found!</Text>
          </View>
        ) : null}

        {viewMode === 'map' ? this.renderSearchInput() : null}
        {!isSearchResultsLoaded?
        <View style={styles.topBar}>
          <DayPicker onSelectDay={this.onSelectMicsDay} selectedDay={micsDate}/>
        </View>
        :null
        }
        
          <View style={styles.bottomBar}>
          {viewMode === 'map' ? (
              <View
              style={[styles.bottomButtonContainer, {flex:1}]}>
              <TouchableOpacity style={styles.circularButtonHelp}
                onPress={() => this.sendHelpEmail()}>
                <Ionicon style={[{color: '#FFF', fontSize:45, backgroundColor: 'transparent'}]} name='ios-help-outline'/>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={[styles.bottomButtonContainer, {flex:1}]}></View>
          )}
            <View style={[styles.bottomButtonContainer, {flex:2}]}>
              <TouchableOpacity
                style={styles.suggestMicButton}
                onPress={() => this.props.navigation.navigate({routeName: 'SuggestMic'})}>
                <Text style={styles.suggestMicButtonText}>SUBMIT A MIC</Text>
              </TouchableOpacity>
            </View>
            {viewMode === 'map' ? (
              <View
              style={[styles.bottomButtonContainer, {flex:1}]}>
              <TouchableOpacity style={styles.circularButton}
                onPress={() => this.updateCurrentLocation()}>
                <Image style={{width: 21, height: 21}} source={RadarIcon} />
              </TouchableOpacity>
            </View>
          ) : (
            <View style={[styles.bottomButtonContainer, {flex:1}]}></View>
          )}
          </View>

        {this.renderError()}
      </View>
    );
  }

  renderError() {
    const {error} = this.props;
    let errorMessage = error ? '' : '';
    if (errorMessage && Platform.OS === 'ios') {
      setTimeout(() => this.props.dispatch(MicActions.resetError()), 2000);
    }
    if (errorMessage && Platform.OS === 'android') {
      ToastAndroid.show(errorMessage, ToastAndroid.SHORT);
    }
    return Platform.OS === 'ios' ? (<AlertBar message={errorMessage} type='error' position={'bottom'} positionOffset={54} />) : null;
  }

  renderSearchInput() {

    const {searchQuery} = this.state;
    return (
      <View style={styles.searchInputContainer}>
        <View style={styles.inputIconContainer}>
          <Ionicon name={'ios-search-outline'} style={styles.inputIcon} />
        </View>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.textInput}
            placeholder={'Search by Mic Name or Venue'}
            placeholderTextColor={ViewUtils.COLOR_THEME_BLUE}
            returnKeyType='search'
            value={searchQuery}
            underlineColorAndroid={'transparent'}
            onChangeText={(text) => this.setState({searchQuery: text})}
            onSubmitEditing={ () => this.onMicsSearchRequest()}/>
        </View>
        {searchQuery ? (
          <TouchableOpacity style={styles.inputIconContainer}
            onPress={() => this.onExitSearch()}>
            <Ionicon name={'ios-close-circle'} style={styles.inputIcon} />
          </TouchableOpacity>
        ) : null}
      </View>
    );
  }

  onMicsSearchRequest() {

    const {searchQuery} = this.state;
    this.setState({viewMode: 'list'}, () => {
        if (searchQuery) {
          this.props.dispatch(MicActions.searchMicsRequest(searchQuery, (response) => {
            if (response.status) {
              this.setState({isSearchResultsLoaded: true});
            }
          }));
        }
    });
  }

  onExitSearch() {

    this.setState({searchQuery: '', isSearchResultsLoaded: false});
    Keyboard.dismiss();
  }

  onPressMarker(locations) {
    let mics = locations ? Object.values(locations) : [];
    //console.log('MICS_LIST', mics)
    if(mics.length > 1) {
      this.setState({viewMode: 'list', micsList: mics});
    }
    else {
      this.setState({viewMode: 'map', micsList: []});
    }
  }

  onRegionChange(newRegion) {
    this.currentRegion = newRegion;
    if (this.micLoadDebounce) {
      this.micLoadDebounce();
    } else {
      this.micLoadDebounce = Utils.debounce(() => {
        this.loadMics();
      }, 500);      
    }
  }

  showMicInfo(micId) {

    const {micsDate, viewMode, isSearchResultsLoaded} = this.state;
    let params = {
      micId, 
      viewMode: viewMode, 
      onBackPress: () => this.props.navigation.dispatch(NavigationActions.back())
    }
    if(!isSearchResultsLoaded) {
      params['micFilterDate'] = micsDate
    }
    this.props.navigation.navigate({routeName: 'MicInfo', params: params});
  }

  onSelectMicsDay(date) {
    this.setState({micsDate: date}, () => this.loadMics());
  }

  loadMics() {
    this.setState({loading:true})
    let region = this.currentRegion;
    let dt = Moment(this.state.micsDate).toDate();
    let date = Moment([dt.getFullYear(), dt.getMonth(), dt.getDate()]);

    if (!region) {
      console.log("Region is no updated yet");
      return;
    }

    let options = {
       from: date.format(),
       toDate: date.add(1, 'days').format(),
    }
    if (Utils.isToday(dt)) {
        options.starttime = Utils.turnMilitary(dt);
    }
    let verticalDistance = Utils.getDistanceFromLatLonInKm(
      region.latitude - (region.latitudeDelta/2),
      region.longitude - (region.longitudeDelta/2),
      region.latitude + (region.latitudeDelta/2),
      region.longitude + (region.longitudeDelta/2)
    );
    console.log('verticalDistance', verticalDistance);
    options.lat = region.latitude;
    options.lng = region.longitude;
    options.dis = Math.max((0.621371 * verticalDistance), 100); //km to miles
    console.log('MICS_OPTIONS', options);
    this.props.dispatch(MicActions.getMics(options, () => {
      this.setState({loading:false, micsList:[]})
    }));
  }

  toggleViewMode() {
    const viewMode = this.state.viewMode === 'map' ? 'list' : 'map' ;
    GATracker.trackScreenView('Mics ' + (viewMode == 'map'?'Map':'List') +  ' Main View Screen')
    this.setState({viewMode: viewMode, micsList:[], isSearchResultsLoaded:false, searchQuery:'', initialRegion: this.currentRegion?this.currentRegion:this.state.initialRegion});
  }

  updateCurrentLocation() {
    this.loadCurrentLocation(
      (success) => setTimeout(() => this.loadMics(), 300),
      (error) => console.log(error)
    )
  }

  loadCurrentLocation(successCallback, errorCallback) {
    LocationUtils.requestCurrentLocation(response => {
      if(response.status) {
        let location = response.data ? response.data.coords : null;
        this.currentRegion = {
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: 0.15,
          longitudeDelta: 0.15
        }

        if(location) {
          console.log('CURRENT_LOCATION', location)
          this.setState({
            currentLocation: {
              latitude: location.latitude,
              longitude: location.longitude
           }
         }, () => {
                if(successCallback) {
                    successCallback(location)
                    if(this.mapView) {
                      this.mapView.snapToCurrentLocation()
                    }
                }
         })
        }
      } else {
        if(errorCallback) errorCallback(response.data);
      }
    })
  }

  sendHelpEmail() {
    let mailUrl = 'mailto:tierney@micmaps.com?subject=MicMaps Help';
    return Linking.openURL(mailUrl);
  }

}

function distance(lat1, lon1, lat2, lon2, unit) {
	var radlat1 = Math.PI * lat1/180
	var radlat2 = Math.PI * lat2/180
	var theta = lon1-lon2
	var radtheta = Math.PI * theta/180
	var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
	dist = Math.acos(dist)
	dist = dist * 180/Math.PI
	dist = dist * 60 * 1.1515
	if (unit=="K") { dist = dist * 1.609344 }
	if (unit=="N") { dist = dist * 0.8684 }
	return dist
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    flex:1,
    flexDirection: 'column',
    alignItems: 'center'
  },
  topBar: {
    position: 'absolute',
    top:ViewUtils.getHeaderHeight(),
    left:0,
    width: ViewUtils.WINDOW_WIDTH,
    height: 60,
    backgroundColor: '#E8E8E8'
  },
  bottomBar: {
    position: 'absolute',
    bottom:0,
    left:0,
    width: ViewUtils.WINDOW_WIDTH,
    height: 80,
    flexDirection: 'row',
    alignItems: 'center'
  },
  bottomButtonContainer: {
    width: 90,
    height: 100,
    alignItems: 'center',
    justifyContent: 'center'
  },
  circularButton: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: ViewUtils.COLOR_THEME_BLUE,
    shadowColor: ViewUtils.COLOR_THEME_EXTRA_LIGHT_BLUE,
    shadowOffset: { width: 2, height: 4 },
    shadowOpacity: 0.6,
    shadowRadius: 6,
    marginTop: -4,
    alignItems: 'center',
    justifyContent: 'center'
  },
  circularButtonHelp: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: ViewUtils.COLOR_THEME_BLUE,
    shadowColor: ViewUtils.COLOR_THEME_EXTRA_LIGHT_BLUE,
    shadowOffset: { width: 2, height: 4 },
    shadowOpacity: 0.6,
    shadowRadius: 6,
    marginTop: -4,
    alignItems: 'center',
    justifyContent: 'center'
  },
  suggestMicButton: {
    height: 44,
    borderRadius: 23,
    paddingHorizontal: 30,
    backgroundColor: ViewUtils.COLOR_THEME_GREEN,
    shadowColor: ViewUtils.COLOR_THEME_DARK_BLUE,
    shadowOffset: { width: 2, height: 4 },
    shadowOpacity: 0.6,
    shadowRadius: 6,
    alignItems: 'center',
    justifyContent: 'center'
  },
  bottomButtonIcon: {
    color: '#FFF',
    fontSize: 24,
    marginTop:2
  },
  suggestMicButtonText: {
    color: ViewUtils.COLOR_THEME_BLUE,
    fontSize: 16,
    fontFamily: ViewUtils.FONT_DOSIS_BOLD
  },
  micsListContainer: {
    marginTop: 60,
    width: ViewUtils.WINDOW_WIDTH,
    height: ViewUtils.getContentHeight(true) - 60,
    backgroundColor: '#E8E8E8'
  },
  searchInputContainer: {
    position: 'absolute',
    top: ViewUtils.getHeaderHeight() + 56 + 10,
    left: 20,
    width: ViewUtils.WINDOW_WIDTH - 40,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#FFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 15,
    shadowColor: ViewUtils.COLOR_THEME_DARK_BLUE,
    shadowOffset: { width: 2, height: 3 },
    shadowOpacity: 0.4,
    shadowRadius: 4
  },
  inputIconContainer: {
    width: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputContainer: {
    flex:1,
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
  },
  textInput: {
    flex:1,
    height: 42,
    fontSize: 16,
    alignSelf: 'center',
    color: ViewUtils.COLOR_THEME_BLUE,
    fontFamily: ViewUtils.FONT_DOSIS_MEDIUM
  },
  inputIcon: {
    color: ViewUtils.COLOR_THEME_BLUE,
    fontSize: 28,
    marginTop:2
  },
  noMicsContainer: {
    width: ViewUtils.WINDOW_WIDTH,
    position:'absolute',
    top:ViewUtils.getHeaderHeight() + 60,
    justifyContent: 'center',
    alignItems:'center',
    paddingTop:20,
    backgroundColor: '#FFF'
  },
  noMicsText: {
    fontSize: 20,
    fontFamily: ViewUtils.FONT_DOSIS_LIGHT,
    color: ViewUtils.COLOR_THEME_BLUE
  },
});

export default MainView;
