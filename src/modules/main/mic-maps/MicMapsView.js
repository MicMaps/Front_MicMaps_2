import React, {Component} from 'react';
import Moment from 'moment';
import {
  StyleSheet,
  Text,
  View,
  Image
} from 'react-native';
import MapView from 'react-native-maps';
import Ionicon from 'react-native-vector-icons/Ionicons';
import MapStyles from '../../../styles/mapStyles';
import * as Utils from '../../../utils/utils';
import * as ViewUtils from '../../../utils/viewUtils';
import MicPin from '../../../../images/micPin6.png';

let mapViewSize = {
  width: ViewUtils.WINDOW_WIDTH,
  height: ViewUtils.getContentHeight(true)
}

class MicMapsView extends Component {
  static displayName = 'MicMapsView';

  constructor(props) {
    super(props);
    this.state = {
    };

    this.onMarkerPressed = this.onMarkerPressed.bind(this);
    this.renderMarker = this.renderMarker.bind(this);
    this.renderCallout = this.renderCallout.bind(this);
    this.onMarkerPressed = this.onMarkerPressed.bind(this);
    this.snapToCurrentLocation = this.snapToCurrentLocation.bind(this);
  }

  componentWillMount() {

    const {viewSize} = this.props;
    if (viewSize) {
      mapViewSize.width = viewSize.width;
      mapViewSize.height = viewSize.height;
    }
  }

  render() {

    const {locations, onRegionChange, initialRegion} = this.props;
    const groupedLocations = this.groupLocations(locations);

    //console.log('MIC_MAPS_VIEW_PROPS', this.props);
    return (
      <View style ={styles.container}>
        <MapView
          ref={(c) => { this.mapRef = c; }}
          provider={'google'}
          style={styles.map}
          customMapStyle={MapStyles}
          initialRegion={initialRegion}
          draggable
          moveOnMarkerPress = {false}
          onRegionChange={onRegionChange ? onRegionChange : null}>
          {
            locations && locations.length ? locations.map((location, index) => {
              return (
                <MapView.Marker
                  key={index}
                  coordinate={Utils.cleanCoordinates(location.location)}
                  calloutOffset={{x:40, y:0}}
                  image={MicPin}
                  onPress={() => this.onMarkerPressed(location, groupedLocations)}
                  ref={(c) => { this[`marker + ${index}`] = c; }}>
                  {this.renderMarker(location, groupedLocations)}
                  {this.renderCallout(location, groupedLocations)}
                </MapView.Marker>
              )
            }) : null
          }
          {
            this.props.currentLocation ? (
              <MapView.Marker
                coordinate={this.props.currentLocation}>
                  {/* <Image source={CurrentPin} style={{width: 20, height: 20 }} /> */}
                  <View style={styles.currentPin}></View>
              </MapView.Marker>
            ) : null
          }
        </MapView>
      </View>
    )
  }

  onMarkerPressed(location, groupedLocations) {
    //this[marker].showCallout();
    const {onPressMarker} = this.props;
    if(!!groupedLocations && onPressMarker) onPressMarker(groupedLocations[location.location.join('_')])

  }
  snapToCurrentLocation () {
      let currentLoc = this.props.currentLocation;
      let currentLocRegion = {
            latitude: currentLoc.latitude,
            longitude: currentLoc.longitude,
            latitudeDelta: 0.15,
            longitudeDelta: 0.15
          }
      console.log(currentLocRegion)
      this.mapRef.animateToRegion(currentLocRegion);
  }
  renderMarker(location, groupedLocations) {

    const locations = groupedLocations[location.location.join('_')];
    const locationsCount = locations ? Object.keys(locations).length : 0;
    return (
      <View style={styles.markerWrapper}>
        {/* <View style={styles.marker}>
          <Text style={styles.markerText}>
            {locationsCount > 1 ? locationsCount : ''}
          </Text>
        </View>
        <View style={styles.markerOuterTriangle} />
        <View style={styles.markerInnerTriangle} /> */}
        <View style={styles.markerPinContainer}>
          {/* <Image style={styles.markerPin} source={MicPin} /> */}
          {locationsCount > 1 ? (
            <View style={styles.markerMicCountContainer}>
              <Text style={styles.markerMicCountText}>{locationsCount}</Text>
            </View>
          ) : null}
        </View>
      </View>
    )
  }



  renderCallout(location, groupedLocations) {

    const {onPressMarkerCallout} = this.props;
    const locations = groupedLocations[location.location.join('_')];
    const locationsCount = locations ? Object.keys(locations).length : 0;
    const startTime = Moment(Utils.padZeros(location.startTime), 'hmm').format('hh:mma');
    const endTime = Moment(Utils.padZeros(location.endTime), 'hmm').format('hh:mma');
    return locationsCount == 1 ? (
      <MapView.Callout tooltip onPress={() => onPressMarkerCallout ? onPressMarkerCallout(location._id) : null}>
        <View style={styles.callout}>
          <View style={styles.calloutImage}>
            <Ionicon style={{width: 18, height: 18, color: '#FFF', fontSize: 18}} name={'ios-information-circle-outline'} />
          </View>
          <View style={styles.calloutContent}>
            <Text style={styles.calloutText} ellipsizeMode={'tail'} numberOfLines={1}>{`Venue: ${location.venueName}`}</Text>
            <Text style={styles.calloutText} ellipsizeMode={'tail'} numberOfLines={1}>{`Time: ${startTime}-${endTime}`}</Text>
            <Text style={styles.calloutText} ellipsizeMode={'tail'} numberOfLines={1}>{`Time on Stage: ${Utils.formatMinutes(location.timeOnStage)}`}</Text>
          </View>
        </View>
      </MapView.Callout>
    ) : <MapView.Callout tooltip >
    </MapView.Callout>;
  }

  groupLocations(locations) {
    let groups = {}
    if(!locations) return groups;

    locations.map(location => {
      let latLng = location.location.join("_");
      if(!(latLng in groups)) groups[latLng] = {};
      groups[latLng][location._id] = location
    })
    return groups;
  }
}

const styles = StyleSheet.create({
  container: {
    width: mapViewSize.width,
    height: mapViewSize.height,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  map: {
    width: mapViewSize.width,
    height: mapViewSize.height,
  },
  latlng: {
    width: 200,
    alignItems: 'stretch',
  },
  markerWrapper: {
    position: 'relative',
    height: 54,
    width: 36,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  marker: {
    height: 24,
    width: 26,
    backgroundColor: '#FFF',
    borderColor: '#888',
    borderWidth: 1,
    borderRadius: 3,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  markerPinContainer: {
    position: 'absolute',
    bottom: 0,
    width: 37,
    height: 50,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  markerPin: {
    width: 43.5,
    height: 61
  },
  markerMicCountContainer: {
    position: 'absolute',
    width: 18,
    height: 18,
    bottom: 5,
    backgroundColor: ViewUtils.COLOR_THEME_BLUE,
    borderRadius: 9,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  markerMicCountText: {
    color: ViewUtils.COLOR_THEME_GREEN,
    fontSize: 11,
  },
  currentPin: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: ViewUtils.COLOR_THEME_BLUE,
    borderWidth: 4,
    borderColor: '#FFF'
  },
  darkMarker: {
    backgroundColor: '#666',
    borderColor: '#666',
  },
  markerText: {
    fontSize: 13,
    color: '#888'
  },
  darkMarkerText: {
    color: '#FFF'
  },
  markerOuterTriangle: {
    position: 'absolute',
    left:11,
    bottom:1,
    borderLeftColor: 'transparent',
    borderLeftWidth: 3,
    borderTopWidth: 6,
    borderTopColor: '#888',
    borderRightWidth: 3,
    borderRightColor: 'transparent'
  },
  markerInnerTriangle: {
    position: 'absolute',
    left:12,
    bottom:2,
    borderLeftColor: 'transparent',
    borderLeftWidth: 2,
    borderTopWidth: 5,
    borderTopColor: '#FFF',
    borderRightWidth: 2,
    borderRightColor: 'transparent'
  },
  darkMarkerOuterTriangle: {
    borderTopColor: '#666',
  },
  callout: {
    position: 'relative',
    width: 220,
    height: 80,
    backgroundColor: ViewUtils.COLOR_THEME_GREEN,
    paddingVertical: 0,
    paddingHorizontal: 10,
    borderRadius: 5,
    flexDirection: 'row',
    alignItems: 'center',
  },
  calloutText: {
    color: '#FFF',
    fontSize: 15,
    fontFamily: ViewUtils.FONT_DOSIS_MEDIUM,
    marginTop: 6,
    lineHeight: 18
  },
  calloutImage: {
    position: 'absolute',
    bottom:5,
    right:3,
    width: 24,
    height: 24,
    borderRadius: 5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  calloutContent: {
    flex: 1,
    height: 70,
    flexDirection: 'column',
  }
});

export default MicMapsView;
