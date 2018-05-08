import React, {Component} from 'react';
import {
  Modal,
  TouchableOpacity,
  View,
  StyleSheet,
  Image
} from 'react-native';
import EvilIcon from 'react-native-vector-icons/EvilIcons';
import * as ViewUtils from '../../../utils/viewUtils';
import Loader from '../loader/loader';
import MicDefaultLogo from '../../../../images/micFlatLogo3x.png';

class ImagePreviewModal extends Component {

  constructor(props) {
    super(props);
    this.state = {
      loading: false
    };
  }

  render() {

    const {imageUri, visibility, open, onClose} = this.props;
    const {loading} = this.state;
    return (
      <View style={{flex:1}}>
      <Modal
        animationType={'slide'}
        transparent={true}
        visible={visibility}
        style={styles.pickerModal}
        onRequestClose={() => {}}>
          <View style={styles.container}>
            <View style={styles.pickerContainer}>
              <Image style={[styles.image, !imageUri ? {width:250,height:250}: null]}
                source={imageUri ? {uri: imageUri} : MicDefaultLogo}
                onLoad={(e) => this.setState({loading: false})}
                onLoadStart={(e) => this.setState({loading: true})}/>
              <TouchableOpacity style={styles.closeButton} onPress={() => onClose ? onClose() : null}>
                <EvilIcon name={'close'} style={styles.closeIcon}/>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
        <Loader visibility={loading} />
      </View>
    );
  }
}

const styles = StyleSheet.create({

  pickerModal: {
    backgroundColor: 'transparent'
  },
  container: {
    position: 'relative',
    backgroundColor: '#FF0',
    flex: 1,
    alignSelf: 'center',
    height: window.height,
    width: window.width,
    alignItems: 'center',
    justifyContent: 'flex-end',
    flexDirection: 'column'
  },
  pickerContainer: {
    height: ViewUtils.WINDOW_HEIGHT,
    width: ViewUtils.WINDOW_WIDTH,
    borderTopWidth:1,
    backgroundColor: '#FFF',
    alignItems: 'center',
    justifyContent: 'center'
  },
  image: {
    resizeMode: 'contain',
    height: ViewUtils.WINDOW_HEIGHT,
    width: ViewUtils.WINDOW_WIDTH,
  },
  closeButton: {
    position: 'absolute',
    top:25,
    right:15,
    padding:6,
    width:40,
    height:40,
    zIndex:9,
  },
  closeIcon: {
    color: ViewUtils.COLOR_THEME_BLUE,
    backgroundColor: 'transparent',
    fontSize: 30,
    marginTop:2
  }
});

export default ImagePreviewModal;
