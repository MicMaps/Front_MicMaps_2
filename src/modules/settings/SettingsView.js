import React, {Component} from 'react';
import {
  View,
  StyleSheet
} from 'react-native';
import MicMapsViewHeader from '../../components/headers/micMapsViewHeader';
import PageHeader from '../../components/custom-views/pageHeader';
import * as EmailUtils from '../../utils/email';
import * as UserActions from '../../redux/user/UserActions';
import CustomSelectInput from '../../components/custom-views/selectInput';
import * as Utils from '../../utils/utils';
import GATracker from '../../services/ga';

class SettingsView extends Component {
  static displayName = 'SettingsView';

  constructor(props) {
    super(props);
    this.state = {
    };

    this.contact = this.contact.bind(this);
    this.logout = this.logout.bind(this);
  }

  componentDidMount() {
    GATracker.trackScreenView('Settings Screen')
  }

  render() {
    return (
      <View style={styles.container}>
        <MicMapsViewHeader
          viewMode={'list'}
          onLeftButtonPress={() => Utils.resetNavigation(this.props.navigation, 0, [{routeName: 'Main', params: {viewMode: 'list'}}])}
          onRightButtonPress={() => this.props.navigation.navigate({routeName: 'Profile'})} 
          navigation = {this.props.navigation} />
        <PageHeader title={'SETTINGS'} />
        <CustomSelectInput
          onSelectInput={() => this.props.navigation.navigate({routeName: 'Permissions'})}
          inputValue={'Permissions'} />
        <CustomSelectInput
          onSelectInput={() => this.props.navigation.navigate({routeName: 'HowItWorks'})}
          inputValue={'How it works'} />
        <CustomSelectInput
          onSelectInput={() => this.props.navigation.navigate({routeName: 'TOS'})}
          inputValue={'Terms and Conditions'} />
        <CustomSelectInput
          onSelectInput={() => this.contact()}
          inputValue={'Contact us'} />
        <CustomSelectInput
          onSelectInput={() => this.logout()}
          inputValue={'Log Out'} />
      </View>
    );
  }

  logout() {
    this.props.dispatch(UserActions.logout(response => {
      this.props.dispatch(UserActions.saveRememberMeStatus(false));
      if (response.status) {
        this.props.navigation.navigate({routeName: 'Begin'});
      }
    }));
  }

  contact() {
    EmailUtils.requestSendMail();
  }
}

const styles = StyleSheet.create({
  container: {
    flex:1,
    flexDirection: 'column',
    backgroundColor: '#FFF',
    paddingHorizontal: 18,
    alignItems: 'center'
  }
});

export default SettingsView;
