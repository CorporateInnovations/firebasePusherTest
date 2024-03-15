// react core - https://reactjs.org/
import React from 'react';
// react native core - https://facebook.github.io/react-native/docs/getting-started.html
import { View, Text, Platform, StyleSheet, Linking, TouchableOpacity } from 'react-native';
// react navigation - https://reactnavigation.org/docs/
import { useNavigation } from '@react-navigation/native';
// icons
import { createIconSetFromIcoMoon } from 'react-native-vector-icons';
import icoMoonConfig from '../../assets/icons/selection.json';
const Icon = createIconSetFromIcoMoon( icoMoonConfig, 'icomoon', 'icomoon.ttf' );
// external imports
import LinearGradient from 'react-native-linear-gradient';
// context
import { UserContext } from '../context/UserContext';
// local components
import MastercardImage from './MastercardImage';
import MastercardProvisioning from './MastercardProvisioning';
import MastercardGooglePayProvisioning from './MastercardGooglePayProvisioning';
// styles
import { STYLES, VARS } from '../Styles';
// translations
import { _i } from '../Translations';

class MastercardOverview extends React.Component {

    constructor( props ) {

        super( props );

        this.state = {
            fullFpanRequired: false
        };
    }

    _isMounted = false;

    _isLoading = false;

    componentDidMount() {

        this._isMounted = true;

    }

    componentWillUnmount() {

        this._isMounted = false;

    }

    render() {

        const { navigate } = this.props.navigation;

        return (
            <UserContext.Consumer>{( userContext ) => {
                const { 
                    profile,
                    rewardsTransfer, 
                    transferRewardsBalance, 
                    claimBookingShow, 
                    mastercardHiddenSideLabel, 
                    showMastercardSide, 
                    customerCode,
                    mastercardBalanceAvailable,
                    mastercardBalanceCleared,
                    accountData
                } = userContext;

                return (
                    <LinearGradient colors={STYLES.gradients.navy} start={{ x: 1, y: 1 }} end={{ x: 0, y: 0 }} style={{ flex: 0 }}>
                        <View style={STYLES.section.large}>
                            <View style={{...styles.row, marginBottom: 20 }}>
                                <MastercardImage />
                                <View
                                    style={{
                                        width: '100%',
                                        flexDirection: 'row',
                                        flexWrap: 'nowrap',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        paddingTop: VARS.spacer.small,
                                        paddingBottom: VARS.spacer.small,
                                        marginBottom: VARS.spacer.large,
                                    }}
                                >
                                    <TouchableOpacity
                                        style={{
                                            ...STYLES.button.base.button,
                                            borderWidth: 2,
                                            borderColor: STYLES.colors.white
                                        }}
                                        onPress={() => showMastercardSide() }
                                    >
                                        <Text
                                            style={{
                                                ...STYLES.button.base.text,
                                                color: STYLES.colors.white
                                            }}
                                        >{  `Show ${ mastercardHiddenSideLabel }`}</Text>
                                    </TouchableOpacity>
                                    {
                                        customerCode &&
                                        <TouchableOpacity
                                            style={{
                                                ...STYLES.button.base.button,
                                                paddingRight: 0,
                                                flexDirection: 'row',
                                                alignItems: 'center',
                                                justifyContent: 'flex-end',
                                                flexWrap: 'nowrap'
                                            }}
                                            onPress={() => Linking.openURL(`https://sites.pps.edenred.com/chopinweb/scareMyLogin.do?customerCode=${customerCode}&loc=en`) }
                                        >
                                            <Text
                                                style={{
                                                    ...STYLES.button.base.text,
                                                    color: STYLES.colors.white
                                                }}
                                            >{ _i('Mastercard Login') }</Text>
                                            <Icon name={ `rp-icon-link-external` } size={ 14 } color={ STYLES.colors.white } style={{ marginLeft: 8, marginBottom: 2 }} />
                                        </TouchableOpacity>
                                    }
                                    
                                </View>

                                <View>
                                {
                                    ( Platform.OS === 'ios' && ((this.state.fullFpanRequired && accountData?.details?.fullFpanLoaded) || !this.state.fullFpanRequired)) &&
                                    <MastercardProvisioning account={ accountData?.details } context={'mastercard-screen'} />
                                }
                                {
                                    Platform.OS === 'android' &&
                                    <MastercardGooglePayProvisioning account={ accountData?.full_details } />
                                }
                                </View>

                                <View style={styles.actions_row}>
                                    <View style={styles.action_col}>
                                        <View style={styles.action_inner}>
                                            <Text style={styles.action_label_text}>{_i('Available Balance')}</Text>
                                            <View style={styles.balance_row}>
                                                <Text style={styles.balance_value_text}>{ mastercardBalanceAvailable }</Text>
                                            </View>
                                        </View>
                                    </View>
                                    <View style={styles.action_col}>
                                        <View style={styles.action_inner}>
                                            <Text style={styles.action_label_text}>{_i('Cleared Balance')}</Text>
                                            <View style={styles.balance_row}>
                                                <Text style={styles.balance_value_text}>{ mastercardBalanceCleared }</Text>
                                            </View>
                                        </View>
                                    </View>
                                </View>
                            </View>
                        </View>
                    </LinearGradient>
                );
            }}</UserContext.Consumer>
        );
    };

};

const styles = StyleSheet.create({
    row: {
        flex: 0,
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
    },
    name_text: {
        ...STYLES.text.heading3,
        color: STYLES.colors.yellow.default,
        textAlign: 'center',
    },
    mastercard_text: {
        ...STYLES.text.heading4,
        fontFamily: VARS.fonts.family.darwin_light,
        color: STYLES.colors.white,
        textAlign: 'center',
    },
    mastercard_balance_text: {
        ...STYLES.text.heading4,
        color: STYLES.colors.white,
        textAlign: 'center',
    },
    profile_image: {
        width: 130,
        height: 130,
        borderRadius: 65
    },
    actions_row: {
        flex: 0,
        flexDirection: 'row',
        alignItems: 'stretch',
        justifyContent: 'center',
        flexWrap: 'nowrap',
    },
    action_col: {
        width: '100%',
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

MastercardOverview.contextType = UserContext;

    // Wrap and export
export default function( props ) {

    const navigation = useNavigation();

    return <MastercardOverview {...props} navigation={navigation} />;
}