/*******************************************************************************
 * Dependency Imports
 ******************************************************************************/

// react core - https://reactjs.org/
import React from 'react';
// react native core - https://facebook.github.io/react-native/docs/getting-started.html
import { View, Text, Dimensions, TouchableHighlight, Alert, Modal, Button, Image, requireNativeComponent, AppState } from 'react-native';
// react navigation - https://reactnavigation.org/docs/
import { useNavigation } from '@react-navigation/native';
// PassKit - https://github.com/miyabi/react-native-passkit-wallet
import PassKit, { AddPassButton } from 'react-native-passkit-wallet'
// RNRCL Bridge
import { NativeModules } from 'react-native';
// storage
import AsyncStorage from '@react-native-async-storage/async-storage';
// react event listeners https://github.com/meinto/react-native-event-listeners
import { EventRegister } from 'react-native-event-listeners';
// context
import { UserContext } from '../context/UserContext';

/*******************************************************************************
 * Services
 ******************************************************************************/

// user service
import * as UserService from '../services/user';

/*******************************************************************************
 * Global Consts
 ******************************************************************************/

// Styles
import { STYLES, VARS } from '../Styles';

// Config
import CONFIG from '../Config';

import { _i } from '../Translations';
import { logError, getSession } from '../Helpers';

// dimensions
const DIMENSIONS = Dimensions.get('screen');

/*******************************************************************************
 * MastercardGooglePayProvisioning Class
 ******************************************************************************/

class MastercardGooglePayProvisioning extends React.Component {

    constructor( props ) {

        super( props );

        this.state = {
            account_details: props.account ? props.account : null,
            // NOTE: can_add_pass is a boolean flag that describes if the card is eligible to be added to this wallet.
            //       if the card is pending provisioning, already in the wallet, or somehow invalid - this should be false
            can_add_pass: false,
            // NOTE: button_available is a boolean manaul control so we can enable/disable as required throuhout the component lifecycle.
            button_available: true,
        };
    }

    _isMounted = false;

    _isLoadingCard = false;

    _cardTokenCheck = null;

    /**
     * get the account details
     */
    _getAccountDetails = () => {

        UserService.getAccountDetails()
            .then(( data ) => {

                if( this._isMounted ) {

                    this.setState({
                        account_details: data.full_details,
                    }, () => {

                        // get a value for can_add_pass
                        this._cardTokenCheckInterval();

                    });
                }
            })
            .catch(( error ) => {
                logError( 'failed to get account details', 'MastercardGooglePayProvisioning->_getAccountDetails', error );
            });
    }

    _cardTokenCheckInterval = () => {

        if( this._cardTokenCheck ) {
            clearInterval( this._cardTokenCheck );
        }

        this._checkCanAddPass();

        this._cardTokenCheck = setInterval(() => {
            this._checkCanAddPass();
        }, 7000 );

    }

    /**
     * Determines if the card can be added
     */
    _checkCanAddPass = async () => {

        // check async storage to look for a stored card token in google wallet
        let card_token = await AsyncStorage.getItem(CONFIG.storage.key.cardInGwalletToken);

        // if we have a card_token saved, do something with it
        if( card_token ) {

            // the native module receives the card token and determines if card is in wallet
            NativeModules.RNRCL.checkCardStatus(card_token, (err, value) => {

                if( err ) {
                    // do the failed callback
                    Alert.alert('Error', 'Sorry, we were unable to add your card to Google Pay')
                    logError( 'failed to get card status', 'MastercardGooglePayProvisioning->_checkCanAddPass', err );

                } else {
                    if( this._isMounted ) {
                        this.setState({
                            can_add_pass: value,
                            button_available: true,
                        });
                    }
                }

            });

        } else {

            if( this._isMounted ) {
                this.setState({
                    can_add_pass: true,
                });
            }

        }
    }

    _provisionAndroidNative = async () => {

        // gets the session object
        let session = await getSession();
        // only proceed if we have account details and the session data
        if( this.state.account_details && session ) {

            // stringify teh account data
            let account_data = JSON.stringify( this.state.account_details );

            // hand these variables to the native example function
            NativeModules.RNRCL.provisionCard( account_data, session.accessToken, (value) => {

                !value ? this._googleProvisioningFailed() : this._googleProvisioningSuccess( value );

            });

        }

    }

    /**
     * TODO: Jonathan we need to perform the following action when the provisioning returns a SUCCESS outcome.
     * This is called using this._googleProvisioningSuccess() from within an arrow function.
     *
     * @param {str} card_token from the successfully provisioned card
     */
    _googleProvisioningSuccess( card_token ) {
        // we need to send an event to the parent component so that the parent can refresh the mastercard screen view.
        // the parent is MastercardScreen.js
        EventRegister.emit( 'googlePayProvisioningSuccess', 'success' );

        if( card_token ) AsyncStorage.setItem(CONFIG.storage.key.cardInGwalletToken, card_token);

        if( this._isMounted ) {
            this.setState({
                // here we hide the 'add to walllet' button manually to make sure it doesn't show after the card is added for any reason such as lag
                button_available: false,
            });
        }

    }

    /**
     * TODO: Jonathan we need to perform the following action when the provisioning returns a FAILED outcome.
     * This is called using this._googleProvisioningFailed() from within an arrow function.
     */
    _googleProvisioningFailed() {

        // perhaps this can be replaced with an actual reason if the error response has one!!
        let failure_message = 'Sorry, your card could not be added to Google Pay Wallet at this time';

        Alert.alert( 'Failed', failure_message );

    }

    // fires on an app state change
    _handleAppStateChange = async ( nextAppState ) => {
        // if the app state changes to open, check again if the card can be added to the wallet
        if( nextAppState == 'active' && Platform.OS === 'android') {

            this._cardTokenCheckInterval();

        } else if( nextAppState == 'active' ) {

            if( this._cardTokenCheck ) {
                clearInterval( this._cardTokenCheck );
            }

        }

    }

    componentDidMount() {

        this._isMounted = true;

        if( this.state.account_details ) {

            this._cardTokenCheckInterval();

        } else {

            this._getAccountDetails();

        }



        // listen out for the app state changing (e.g. going to background) and respond accordingly
        AppState.addEventListener( 'change', this._handleAppStateChange );

    }

    componentWillUnmount() {

        this._isMounted = false;

        AppState.removeEventListener( 'change', this._handleAppStateChange );

        if( this._cardTokenCheck ) {
            clearInterval( this._cardTokenCheck );
        }

    }

    componentWillReceiveProps = (nextProps) => {

        this._getAccountDetails();

    }

    render() {

        return (
            <UserContext.Consumer>{( userContext ) => {
                return (
                    <View style={styles.section}>

                        {
                            // only show the add to wallet button if the card can be added, the device supports it, and the manual button_available control is truthy
                            ( this.state.button_available && this.state.can_add_pass ) &&
                            <TouchableHighlight style={styles.gpay_button} onPress={() => this._provisionAndroidNative()}>
                                <Image source={require("../../assets/images/add-to-google-pay.png")}/>
                            </TouchableHighlight>
                        }
                    </View>
                );
            }}</UserContext.Consumer>
        );
    }
}

const styles = {
    section: {
        flex: 0,
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        padding: VARS.spacer.small,
    },
    gpay_button: {
        flex: 0,
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: 54,
        borderRadius: 6,
        backgroundColor: '#000',
    }
}

MastercardGooglePayProvisioning.contextType = UserContext;

// Wrap and export
export default function( props ) {

    const navigation = useNavigation();

    return <MastercardGooglePayProvisioning {...props} navigation={navigation} />;
}
