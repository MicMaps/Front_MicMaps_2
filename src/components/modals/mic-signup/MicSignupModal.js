import React, { Component } from 'react';
import {
    Modal,
    TouchableOpacity,
    View,
    StyleSheet,
    Text
} from 'react-native';
import ReactNative from 'react-native';
import EvilIcon from 'react-native-vector-icons/EvilIcons';
import * as ViewUtils from '../../../utils/viewUtils';
import * as Utils from '../../../utils/utils';
import Loader from '../loader/loader';
import CustomTextInput from '../../../components/custom-views/textInput';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import GlobalStyles from '../../../styles/globalStyles';

class MicSignupModal extends Component {

    constructor(props) {
        super(props);
        this.state = {
            name: '',
            phone: '',
            email: ''
        };
        this._scrollToInput = this._scrollToInput.bind(this);
        this.isDataValid = this.isDataValid.bind(this);
        this.submitSignupData = this.submitSignupData.bind(this);
    }

    componentDidMount() {

    }

    render() {

        const { visibility, open, onClose, slot, date } = this.props;
        const { name, email, phone } = this.state;
        return (
            <View style={{ flex: 1 }}>
                <Modal
                    animationType={'slide'}
                    transparent={true}
                    visible={visibility}
                    style={styles.pickerModal}
                    onRequestClose={() => { }}>
                    <View style={styles.container}>
                        <KeyboardAwareScrollView ref={ref => { this.scroll = ref }} style={{ backgroundColor: '#FFF' }}>
                            <View style={styles.pickerContainer}>
                                <Text style={styles.headerText}>Sign up for Slot no {slot} on {date}</Text>
                                <CustomTextInput
                                    label={"Your Name * (Visible Publicly.)"}
                                    textInputProps={{
                                        value: name,
                                        ref: (el) => { this._nameInput = el },
                                        onChangeText: (text) => this.setState({ 'name': text }),
                                        returnKeyType: 'next',
                                        onSubmitEditing: () => this._emailInput.focus(),
                                        onFocus: this._scrollToInput
                                    }}
                                    validationStatus={!!name}
                                    validationMessage={!name ? 'Please enter your name' : ''} />
                                <CustomTextInput
                                    label={"Your Email *"}
                                    textInputProps={{
                                        value: email,
                                        ref: (el) => { this._emailInput = el },
                                        onChangeText: (text) => this.setState({ 'email': text }),
                                        returnKeyType: 'next',
                                        onSubmitEditing: () => this._phoneInput.focus(),
                                        onFocus: this._scrollToInput
                                    }}
                                    validationStatus={Utils.isEmailValid(email)}
                                    validationMessage={!Utils.isEmailValid(email) ? 'Please enter a valid email address' : ''} />
                                <CustomTextInput
                                    label={"Your Phone Number *"}
                                    textInputProps={{
                                        value: phone,
                                        ref: (el) => { this._phoneInput = el },
                                        onChangeText: (text) => this.setState({ 'phone': text }),
                                        keyboardType: 'numeric',
                                        onFocus: this._scrollToInput
                                    }}
                                    validationStatus={Utils.isPhoneNumberValid(phone)}
                                    validationMessage={!Utils.isPhoneNumberValid(phone) ? 'Please enter a valid phone number' : ''} />
                                <TouchableOpacity style={styles.closeButton} onPress={() => onClose ? onClose() : null}>
                                    <EvilIcon name={'close'} style={styles.closeIcon} />
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[GlobalStyles.button, GlobalStyles.buttonGreenSolid, { marginBottom: 0 },
                                    this.isDataValid() ? null : GlobalStyles.buttonGreenSolidDisabled]}
                                    onPress={() => this.isDataValid() ? this.submitSignupData() : null}
                                    activeOpacity={this.isDataValid() ? 0.2 : 1}>
                                    <Text style={GlobalStyles.buttonGreenSolidText}>SUBMIT</Text>
                                </TouchableOpacity>

                            </View>
                        </KeyboardAwareScrollView>
                    </View>
                </Modal>
            </View>
        );
    }

    _scrollToInput(event) {
       // this.scroll.scrollToFocusedInput(ReactNative.findNodeHandle(event.target));
    }
    submitSignupData() {
        const { name, email, phone } = this.state;
        const { date, slot, onSubmit } = this.props;
        onSubmit({ name, email, phone, date, slot });
    }
    isDataValid() {
        const { name, email, phone } = this.state;
        if (!name || !Utils.isPhoneNumberValid(phone) || !Utils.isEmailValid(email)) {
            return false;
        }
        return true;
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
        borderTopWidth: 1,
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
        top: 25,
        right: 15,
        padding: 6,
        width: 40,
        height: 40,
        zIndex: 9,
    },
    closeIcon: {
        color: ViewUtils.COLOR_THEME_BLUE,
        backgroundColor: 'transparent',
        fontSize: 30,
        marginTop: 2
    },
    headerText: {
        color: ViewUtils.COLOR_THEME_LIGHT_BLUE,
        fontSize: 20,
        marginBottom: 40
    }
});

export default MicSignupModal;
