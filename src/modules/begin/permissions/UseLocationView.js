import React, {PropTypes, Component} from 'react';
import Permissions from 'react-native-permissions';
import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet
} from 'react-native';
import * as ViewUtils from '../../../utils/viewUtils'
import * as UserActions from '../../../redux/user/UserActions'
import GlobalStyles from '../../../styles/globalStyles'
import PageHeader from '../../../components/custom-views/pageHeader'

class UseLocationView extends Component {
  static displayName = 'UseLocationView';

  constructor(props) {
    super(props);
    this.state = {
      dialogVisibility: false
    }

    this.requestPermission = this.requestPermission.bind(this);
    this.handleLocationPermission = this.handleLocationPermission.bind(this);
  }

  render() {

    return (
      <View style={styles.container}>
        <PageHeader title={'ALLOW LOCATION'} />
        <View style={styles.topView}>
          <View style={styles.textContainer}>
            <Text style={styles.descriptionText}>How else do you expect us to tell you where the closest Mics are?</Text>
          </View>
        </View>
        <View style={styles.bottomView}>
          <TouchableOpacity
            style={[GlobalStyles.button, GlobalStyles.buttonGreenSolid, {marginTop:24}]}
            onPress={() => this.handleLocationPermission()}>
            <Text style={GlobalStyles.buttonGreenSolidText}>YES, ALLOW LOCATION</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  handleLocationPermission() {

    let permission = false;
    Permissions.check('location')
      .then(response => {
        switch(response) {
          case 'authorized':
            this.props.dispatch(UserActions.setUserPermission('location', true))
            setTimeout(() => this.props.navigate({routeName:'Main'}), 400)
            break;
          case 'undetermined':
            this.requestPermission();
            break;
          case 'denied':
            Permissions.openSettings();
        }
    })
  }

  requestPermission() {
    Permissions.request('location').then(response => {
      this.props.dispatch(UserActions.setUserPermission('location', response === 'authorized'))
      setTimeout(() => this.props.navigate({routeName:'Main'}), 300)
    });
  }
}

const styles = StyleSheet.create({
  container: {
    flex:1,
    flexDirection: 'column',
    paddingTop: 46,
    backgroundColor: '#FFF'
  },
  topView: {
    flex:0.6,
    flexDirection: 'column'
  },
  bottomView: {
    flex: 0.4,
    width: ViewUtils.WINDOW_WIDTH,
    flexDirection: 'column',
    alignItems: 'center'
  },
  textContainer: {
    paddingTop: 25,
    paddingLeft: 25,
    paddingRight: 65
  },
  titleText: {
    fontSize: 34,
    color: '#888',
    marginVertical: 20
  },
  descriptionText: {
    fontSize: 15,
    color: ViewUtils.COLOR_THEME_BLUE,
    fontFamily: ViewUtils.FONT_DOSIS_MEDIUM
  }
});

export default UseLocationView;
