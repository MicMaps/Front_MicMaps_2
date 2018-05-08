import React, {Component} from 'react';

import htmlContent from './content';

import {
  View,
  StyleSheet,
  WebView
} from 'react-native';
import PermissionsViewHeader from '../../../components/headers/permissionsViewHeader';
import PageHeader from '../../../components/custom-views/pageHeader';
import * as ViewUtils from '../../../utils/viewUtils';
import {NavigationActions} from 'react-navigation';

class HowItWorksView extends Component {
  static displayName = 'HowItWorksView';

  constructor(props) {
    super(props);
    this.state = {
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <PermissionsViewHeader
          navigation={this.props.navigation}
          onRightButtonPress={() => this.props.navigation.dispatch(NavigationActions.back())} />
        <PageHeader title={'HOW IT WORKS'} />
        <View style={styles.contentContainer}>
          <WebView source={{html: htmlContent}} />
        </View>
      </View>
    );
  }

}

const styles = StyleSheet.create({
  container: {
    flex:1,
    flexDirection: 'column',
    backgroundColor: '#FFF',
    paddingHorizontal: 18,
    alignItems: 'center'
  },
  contentContainer: {
    flex:1,
    width: ViewUtils.WINDOW_WIDTH,
    flexDirection: 'row',
  }
});

export default HowItWorksView;
