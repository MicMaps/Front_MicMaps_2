import React, { Component } from 'react';
import Moment from 'moment';
import {
    View,
    StyleSheet,
    Text,
    ScrollView,
    TouchableOpacity
} from 'react-native';
import GeneralBackHeader from '../../../components/headers/generalBackHeader';
import GlobalStyles from '../../../styles/globalStyles';
import * as ViewUtils from '../../../utils/viewUtils';
import DayPickerSignup from '../../../components/pickers/dayPickerSignup';
import * as _ from 'lodash';
import MicSignupModal from '../../../components/modals/mic-signup/MicSignupModal';
import Loader from '../../../components/modals/loader/loader';
import * as MicServices from '../../../services/mics';
class MicSignupView extends Component {
    static displayName = 'MicSignupView';

    constructor(props) {
        super(props);
        this.state = {
            days: [],
            daysData: [],
            selectedDay: Moment(),
            micSignupModalVisibility: false,
            maxSlots: 0,
            loading: false
        }
        this.mapKeys = this.mapKeys.bind(this);
        this.onSelectDay = this.onSelectDay.bind(this);
        this.renderListItem = this.renderListItem.bind(this);
        this.renderSlot = this.renderSlot.bind(this);
        this.renderSlottedUser = this.renderSlottedUser.bind(this);
        this.signupForMic = this.signupForMic.bind(this);
        this.getSignupData = this.getSignupData.bind(this);
        this.initStateForMicSignupDate = this.initStateForMicSignupDate.bind(this);
    }

    componentDidMount() {
        const {micId} = this.props.navigation.state.params;
        this.getSignupData(micId);
    }

    render() {
        const { micSignupModalVisibility, loading } = this.state;
        const selectedDayContent = _.filter(this.state.daysData, { date: this.state.selectedDay.format('MM/DD/YYYY') });
        const maxSlotsArray = _.range(1, this.state.maxSlots + 1);
        return (
            <View style={styles.container}>
                
                <GeneralBackHeader
                    title={`Mic's Sign Up Sheet`}
                />

                <View style={styles.topBar}>
                    <DayPickerSignup
                        days={this.mapKeys()}
                        selectedDay={this.state.selectedDay}
                        onSelectDay={this.onSelectDay}
                    />
                </View>
                <View style={styles.usersContainer}>
                    <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
                        <View style={styles.usersContainerWrapper}>
                            {

                                (
                                    maxSlotsArray.map((slot, idx) => {
                                        const slottedUser = _.find(selectedDayContent, { slot });
                                        return (

                                            <View key={idx} style={styles.userWrapper}>
                                                <View style={styles.slotContainer}>
                                                    {this.renderSlot(slot)}
                                                </View>

                                                {slottedUser
                                                    ? <View style={styles.userItemContainer}>
                                                        {this.renderSlottedUser(slottedUser, slot)}
                                                    </View>
                                                    : <View style={[styles.userItemContainer, { alignItems: 'flex-start' }]}>
                                                        <TouchableOpacity
                                                            style={styles.slotMeButton}
                                                            onPress={() => this.setState({ micSignupModalVisibility: true, selectedSlot: slot})}>
                                                            <Text style={styles.slotMeButtonText}>SLOT ME</Text>
                                                        </TouchableOpacity>
                                                    </View>
                                                }

                                            </View>

                                        )
                                    }))

                            }
                        </View>
                    </ScrollView>
                </View>
                <Loader  visibility={loading}/>
                <MicSignupModal visibility={micSignupModalVisibility} onSubmit={this.signupForMic} slot={this.state.selectedSlot} date={this.state.selectedDay.format('MM/DD/YYYY')} onClose={() => this.setState({ micSignupModalVisibility: false })} />
            </View>
        );
    }

    mapKeys() {
        return _.map((this.state.days), (day) => {
            return Moment(day)
        })
    }

    onSelectDay(day) {
        this.setState({ selectedDay: day });
    }

    renderListItem(name, value, slot) {
        return (
            value ?
                <View style={[GlobalStyles.listItemContainer, { borderBottomWidth: 0 }]} key={slot}>
                    <Text style={GlobalStyles.listItemLabel}>{name}</Text>
                    <Text style={GlobalStyles.listItemContent} ellipsizeMode={'tail'} numberOfLines={1}>
                        {value}
                    </Text>
                </View>
                : null
        )
    }
    renderSlot(slotNo) {
        return (
            <View>
                <Text>Slot No {slotNo}</Text>
            </View>
        )
    }
    renderSlottedUser(slottedUser, slot) {
        const {isUserMic} = this.props.navigation.state.params;
        let userElements = [];
        userElements.push(this.renderListItem('Name', slottedUser.name, slot));
        if(isUserMic) {
            userElements.push(this.renderListItem('Email', slottedUser.email, slot + 1));
            userElements.push(this.renderListItem('Phone', slottedUser.phone, slot + 2));
        }
        return userElements;
    }

    signupForMic(data) {
        const {micId} = this.props.navigation.state.params;
        this.setState({loading: true, micSignupModalVisibility: false}, () => {
            MicServices.signupForMic(micId, data)
                .then((result) => {
                    this.setState({loading: false, daysData: result.data.daysData});
                })
                .catch((error) => {
                    this.setState({loading: false});
                })
        });
    }

    getSignupData(micId) {
        this.setState({loading: true}, () => {
        MicServices.getSignupData(micId)
            .then((result) => {
                this.initStateForMicSignupDate(result.data);
                
            })
            .catch((error) => {
                this.setState({loading: false});
            })
        });
    }

    filterDatesForAWeek(days) {
        return _.filter(days, (day) => {
            const diff = Moment(day).diff(Moment(), 'days')
            return (diff >= 0 && diff <= 7);
        })
    }

    initStateForMicSignupDate(data) {
        const {isUserMic} = this.props.navigation.state.params;
        let filteredDates = data.days
        if(!isUserMic) {
            filteredDates = this.filterDatesForAWeek(filteredDates);
        }
        const selectedDay = filteredDates?Moment(filteredDates[0]):Moment() 
        this.setState({loading: false, days: filteredDates, daysData: data.daysData, maxSlots: data.noOfSignupSlots, selectedDay: selectedDay});
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: '#FFF',
        paddingHorizontal: 0,
        alignItems: 'center'
    },
    contentContainer: {
        flex: 1,
        width: ViewUtils.WINDOW_WIDTH,
        flexDirection: 'row'
    },
    topBar: {
        position: 'absolute',
        top: ViewUtils.getHeaderHeight(),
        left: 0,
        width: ViewUtils.WINDOW_WIDTH,
        height: 60,
        backgroundColor: '#E8E8E8'
    },
    usersContainerWrapper: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: '#FFF',
        width: ViewUtils.WINDOW_WIDTH
    },
    usersContainer: {
        marginTop: 60
    },
    userWrapper: {
        minHeight: 100,
        width: ViewUtils.WINDOW_WIDTH,
        flexDirection: 'row',
        borderBottomWidth: 2,
        borderBottomColor: ViewUtils.COLOR_THEME_GREEN
    },
    slotContainer: {
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1
    },
    userItemContainer: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'flex-end',
        justifyContent: 'center'
    },
    slotMeButton: {
        height: 40,
        borderRadius: 20,
        paddingHorizontal: 30,
        backgroundColor: ViewUtils.COLOR_THEME_GREEN,
        shadowColor: ViewUtils.COLOR_THEME_DARK_BLUE,
        shadowOffset: { width: 2, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        alignItems: 'center',
        justifyContent: 'center'
    },
    slotMeButtonText: {
        color: ViewUtils.COLOR_THEME_BLUE,
        fontSize: 16,
        fontFamily: ViewUtils.FONT_DOSIS_SEMI_BOLD
    }
});

export default MicSignupView;
