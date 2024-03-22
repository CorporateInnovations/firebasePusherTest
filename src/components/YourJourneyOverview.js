/*******************************************************************************
 * Dependency Imports
 ******************************************************************************/
// react core - https://reactjs.org/
import React from 'react';
// react native core - https://facebook.github.io/react-native/docs/getting-started.html
import {View, Text, Dimensions, StyleSheet, FlatList, Image, TouchableOpacity, SafeAreaView, ScrollView, Animated} from 'react-native';
import AltIcon from 'react-native-vector-icons/Fontisto';
// react navigation - https://reactnavigation.org/docs/
import { useNavigation } from '@react-navigation/native';
import { TouchableHighlight } from 'react-native-gesture-handler';
// local components
import LearnCategoryOverview from '../components/LearnCategoryOverview';
import GeneralMessage from '../components/GeneralMessage';
import LoadingSpinner from '../components/LoadingSpinner';
import ButtonBlock from '../components/ButtonBlock';
// context
import { LearnContext } from '../context/LearnContext';
// config
import { STYLES, VARS } from '../Styles';
import { _i } from '../Translations';
import GeneralTabsHeader from './GeneralTabsHeader';
import GeneralTabsPanel from './GeneralTabsPanel';
import GeneralHTML from './GeneralHTML';

import { createIconSetFromIcoMoon } from 'react-native-vector-icons';
import icoMoonConfig from '../../assets/icons/selection.json';
import AnimatedView from './AnimatedView';
const Icon = createIconSetFromIcoMoon(icoMoonConfig, 'icomoon', 'icomoon.ttf' );

const DIMENSIONS = Dimensions.get('screen');

/*******************************************************************************
 * YourJourneyOverview Class
 ******************************************************************************/
class YourJourneyOverview extends React.Component {

    constructor( props ) {

        super( props );

        this.state = {

        };
    }

    _isMounted = false;

    componentDidMount() {
        this._isMounted = true;
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    bookingsTabContent = (currentTier, numOfBookings, minBookingsRequired, nextTier) => {
        if (currentTier == "Learner Tier") {
            return (
                <Text style={{...styles.time_on_learn, paddingLeft: VARS.spacer.small + 20}}>You have achieved the{'\n'}required bookings to reach{'\n'}Expert</Text>
            )
        }

        if (currentTier == "Royal Guru") {
            return (
                <Text style={{...styles.time_on_learn, paddingLeft: VARS.spacer.small + 20}}>You have achieved the{'\n'}required bookings to reach{'\n'}Royal Guru</Text>
            )
        }

        if (minBookingsRequired == 0) {
            return (
                <Text style={{...styles.time_on_learn, paddingLeft: VARS.spacer.small + 20}}>You have achieved the{'\n'}required bookings to reach{'\n'}{nextTier}</Text>
            )
        } else {
            return (
                <>
                    <Text style={{ ...styles.modules_time_completed, paddingLeft: VARS.spacer.medium - 7, width: '35%', fontSize: 20 }}>{numOfBookings}{'\n'} bookings</Text>

                    <Text style={{...styles.time_on_learn, paddingLeft: VARS.spacer.small, textAlign: 'center', width: '35%'}}>Achieve {minBookingsRequired} bookings{'\n'}to go{'\n'} to reach {nextTier}</Text>
                </>
            )
        }
    }

    _renderLabelStyles = (tiers) => {
        if(tiers.tier_stats.filter((tier) => tier.displayed).length > 2) {
            return {
                bottom: -40
            };
        }

        if(tiers.tier_stats.filter((tier) => tier.displayed).length > 1) {

        }
        if(tiers.tier_stats.filter((tier) => tier.displayed).length == 1) {
            return {
                right: 60,
                bottom: 27
            };
        }
    }

    _renderProgressStyles = (tiers) => {
        if(tiers.tier_stats.filter((tier) => tier.displayed).length > 2) {
            return {
                width: '250%',
            };
        }

        if(tiers.tier_stats.filter((tier) => tier.displayed).length > 1) {
            return {
                width: '180%',
            };
        }
        if(tiers.tier_stats.filter((tier) => tier.displayed).length == 1) {
            return {
                width: '80%',
            };
        }
    }

    render() {
        const { navigate } = this.props.navigation;

        return (
            <LearnContext.Consumer>{( learnContext ) => {
                const { tiers, time_spent, booking_stats, level } = learnContext;
                // var level = "Royal Guru" // For testing with, to debug Bookings Tab wordings
                return(
                <>
                        <View style={{ ...styles.container, marginBottom: 20 }}>
                            <View style={{width: '60%', flexDirection:'row'}}>
                                {
                                    tiers.tier_stats.filter((tier) => tier.displayed).map( (tier) => {
                                        return(
                                            <View key={tier.name} style={{...styles.square, width: '100%', flex: 1, paddingTop: 100}}>
                                                <Text numberOfLines={1} style={{ ...styles.label, ...this._renderLabelStyles(tiers), transform: [{rotate: '-90deg'}], paddingLeft: 0, borderWidth: 0,}}>{tier.name}</Text>
                                                <View style={{...styles.progress, ...this._renderProgressStyles(tiers) }}>
                                                    <Animated.View style={[StyleSheet.absoluteFill], {backgroundColor: "#FBBA00", width: ((100/ tier.total) * tier.completed)+'%', borderRadius: VARS.borderRadius.small}}/>
                                                </View>
                                            </View>
                                        )
                                    })
                                }
                            </View>
                            <View style={{...styles.square, width: '40%', height: 200}}>
                                <View style={{ flexDirection: 'column', paddingTop: 15}}>
                                    <Text style={{ ...styles.modules_completed_number }}>{tiers.module_totals.completed}</Text>
                                    <Text numberOfLines={2} style={{ textAlign: 'center', color: 'white', fontSize: 10 }}>Module{(tiers.module_totals.completed >1 ? 's' : '')}{'\n'}Completed</Text>
                                </View>
                                <View style={{ flexDirection: 'column', paddingTop: 10}}>
                                    <Text style={{ ...styles.modules_completed_number }}>{Math.trunc((100 / tiers.module_totals.modules) * tiers.module_totals.completed)}%</Text>
                                    <Text numberOfLines={2} style={{ textAlign: 'center', color: 'white', fontSize: 10 }}>Modules{'\n'}Completed</Text>
                                </View>
                            </View>
                        </View>
                        <View style={{ ...styles.container, flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginBottom: 15 }}>
                            <Icon
                                name={ `rc-icon-stopwatch` }
                                size={ 60 }
                                color={ STYLES.colors.white }
                                style={{ paddingTop: VARS.spacer.small, paddingBottom: VARS.spacer.small, paddingLeft: VARS.spacer.small, textAlign: 'center' }}
                            />
                            <Text style={{ ...styles.modules_time_completed, width: '40%' }}>{time_spent}</Text>
                            <Text style={{...styles.time_on_learn,textAlign: 'center', paddingRight: VARS.spacer.small}}>Time spent on{'\n'}Learn</Text>
                        </View>
                   </>
                );

            }}</LearnContext.Consumer>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "white",
        flexDirection: "row",
        backgroundColor: '#FFFFFF50',
        borderRadius: VARS.borderRadius.small
    },
    progress: {
        height: 5,
        flexDirection: "row",
        width: '180%',
        zIndex: 12,
        backgroundColor: '#4D307B',
        borderColor: '#E5CCF4',
        borderWidth: 0,
        borderRadius: 5,
        transform: [{rotate: '-90deg'}],
        right: 30,
        bottom: 20
    },
    label: {
        bottom: -28,
        fontFamily: VARS.fonts.family.darwin_bold,
        color: VARS.colors.navy.default,
        fontSize: 14,
        lineHeight: 15,
        height: 22
    },
    modules_completed_number: {
        textAlign: 'center',
        ...STYLES.text.heading2,
        color: VARS.colors.white,
        fontFamily: VARS.fonts.family.darwin_light,
    },
    modules_time_completed: {
        textAlign: 'center',
        ...STYLES.text.heading3,
        color: VARS.colors.white,
        fontFamily: VARS.fonts.family.darwin_light,
        justifyContent: 'center', //Centered horizontally
        alignItems: 'center', //Centered vertically
    },
    time_on_learn: {
        color: VARS.colors.white,
    },
    image: {
        height: 60,
        width: 60,
        marginTop: VARS.spacer.small, 
        marginBottom: VARS.spacer.small, 
        marginLeft: '8%', 
        alignSelf: "flex-start" 
    }
});

YourJourneyOverview.contextType = LearnContext;

// Wrap and export
export default function( props ) {
    const navigation = useNavigation();
    return <YourJourneyOverview {...props} navigation={navigation} />;
}
