/*******************************************************************************
 * Dependency Imports
 ******************************************************************************/

// react core - https://reactjs.org/
import React from 'react';
// react native core - https://facebook.github.io/react-native/docs/getting-started.html
import { View, Text, Dimensions, StyleSheet, Image, Alert, TouchableOpacity } from 'react-native';
// react navigation - https://reactnavigation.org/docs/
import { useNavigation } from '@react-navigation/native';
// icons
import { createIconSetFromIcoMoon } from 'react-native-vector-icons';
import icoMoonConfig from '../../assets/icons/selection.json';
const Icon = createIconSetFromIcoMoon( icoMoonConfig, 'icomoon', 'icomoon.ttf' );

// external imports
import LinearGradient from 'react-native-linear-gradient';
// local components
import ButtonBlock from '../components/ButtonBlock';
import RewardsTransfer from '../components/RewardsTransfer';
import RewardsClaimBooking from '../components/RewardsClaimBooking';
// context
import { UserContext } from '../context/UserContext';
// styles
import { STYLES, VARS } from '../Styles';
// translations
import { _i } from '../Translations';

//transfer

const DIMENSIONS = Dimensions.get('screen');

/*******************************************************************************
 * RewardsOverview Class
 ******************************************************************************/
class RewardsOverview extends React.Component {

    constructor( props ) {

        super( props );

        this.state = {

        };
    }

    render() {

        const { navigate } = this.props.navigation;

        return (
            <UserContext.Consumer>{( userContext ) => {
                const { profile, rewardsTransfer, transferRewardsBalance, claimBookingShow } = userContext;

                return (
                    <LinearGradient colors={STYLES.gradients.navy} start={{ x: 1, y: 1 }} end={{ x: 0, y: 0 }} style={{ flex: 0 }}>
                        <View style={STYLES.section.large}>
                            <View style={{...styles.row, marginBottom: VARS.spacer.small }}>
                                <Text style={styles.balance_label}>{ _i('Available to Transfer') }</Text>
                            </View>
                            <View style={{...styles.row, marginBottom: VARS.spacer.large }}>
                                <Text style={styles.balance_value}>{ `£${profile.balance}` }</Text>
                            </View>
                            <View style={styles.actions_row}>
                                <View style={styles.action_col}>
                                    <TouchableOpacity
                                        onPress={ () => transferRewardsBalance() }
                                    >
                                        <View style={styles.action_inner}>
                                            <Icon name={ `rp-icon-mastercard-transfer-alt` } size={ 30 } color={ STYLES.colors.white } style={styles.action_icon} />
                                            <Text style={styles.action_label_text}>{_i('Transfer to Card')}</Text>
                                        </View>
                                    </TouchableOpacity>
                                </View>
                                <View style={styles.action_col}>
                                    <TouchableOpacity
                                        onPress={ () => claimBookingShow() }
                                    >
                                        <View style={styles.action_inner}>
                                            <Icon name={ `rp-icon-booking-claim` } size={ 30 } color={ STYLES.colors.white } style={styles.action_icon} />
                                            <Text style={styles.action_label_text}>{_i('Claim a Booking')}</Text>
                                        </View>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>

                        <RewardsTransfer />

                        <RewardsClaimBooking />

                    </LinearGradient>
                );
            }}</UserContext.Consumer>
        );
    }
}

const styles = StyleSheet.create({
    row: {
        flex: 0,
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
    },
    balance_label: {
        ...STYLES.text.body_light,
        color: STYLES.colors.white,
        textAlign: 'center',
    },
    balance_value: {
        ...STYLES.text.heading3,
        color: STYLES.colors.white,
        fontSize: 60,
        lineHeight: 60,
        textAlign: 'center',
    },
    actions_row: {
        flex: 0,
        flexDirection: 'row',
        alignItems: 'stretch',
        justifyContent: 'center',
        flexWrap: 'nowrap',
    },
    action_col: {
        width: '33%',
        flexGrow: 1,
        flexShrink: 1,
        flex: 1,
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'center',
        flexWrap: 'wrap',
        textAlign: 'center',
        paddingLeft: 15,
        paddingRight: 15
    },
    action_inner: {
        width: '100%',
    },
    action_label_text: {
        fontFamily: VARS.fonts.family.darwin_light,
        fontSize: 12,
        lineHeight: 14,
        color: STYLES.colors.white,
        textTransform: 'uppercase',
        textAlign: 'center',
        letterSpacing: 1
    },
    action_icon: {
        textAlign: 'center',
        marginBottom: 5
    },
    balance_row: {
        flex: 0,
        width: '100%',
        justifyContent: 'center',
        marginBottom: 3
    },
    balance_value_text: {
        fontFamily: VARS.fonts.family.darwin_bold,
        textAlign: 'center',
        color: STYLES.colors.white,
        fontSize: 26,
    }
});

RewardsOverview.contextType = UserContext;


// Wrap and export
export default function( props ) {

    const navigation = useNavigation();
    
    return <RewardsOverview {...props} navigation={navigation} />;
}
