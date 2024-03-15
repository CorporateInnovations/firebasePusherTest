/*******************************************************************************
 * Dependency Imports
 ******************************************************************************/

// react core - https://reactjs.org/
import React from 'react';
// react native core - https://facebook.github.io/react-native/docs/getting-started.html
import { View, Text, Dimensions, TouchableOpacity, Alert, Modal, Platform } from 'react-native';
// react navigation - https://reactnavigation.org/docs/
import { useNavigation } from '@react-navigation/native';
// PassKit - https://github.com/miyabi/react-native-passkit-wallet
import PassKit, { AddPassButton } from 'react-native-passkit-wallet'
// RNRCL Bridge
import { NativeModules, NativeEventEmitter } from 'react-native';
const { ModuleWithEmitter } = NativeModules;
// storage
import AsyncStorage from '@react-native-async-storage/async-storage';

/*******************************************************************************
 * Local components
 ******************************************************************************/

// Commented line caused issues when building for Android API Level 33
// const rnrclEmitter = new NativeEventEmitter(NativeModules.RNRCL)
const rnrclEmitter = new NativeEventEmitter(0);

// mastercard success modal
import MastercardWalletOutcome from './MastercardWalletOutcome';

/*******************************************************************************
 * Services
 ******************************************************************************/
// user service
import * as UserService from '../services/user';
// Mastercard service
import * as Mastercard from '../services/mastercard';

/*******************************************************************************
 * Global Consts
 ******************************************************************************/

// Styles
import { STYLES, VARS } from '../Styles';
// Config
import CONFIG from '../Config';
// Helpers
import { getBridgeEndpoint } from '../Helpers';
// configs
import { _i } from '../Translations';
import { logError } from '../Helpers';

// dimensions
const DIMENSIONS = Dimensions.get('screen');

/*******************************************************************************
 * MastercardProvisioning Class
 ******************************************************************************/

class MastercardProvisioning extends React.Component {

    constructor( props ) {

        super( props );

        this.state = {
            account_details: props.account ? props.account : null,
            can_add_pass: false,
            button_available: false,
            deviceSupportsWallet: Platform.OS === 'ios' ? NativeModules.RNRCL.canAddPasses() : false,
            wallet_outcome: null,
            context: props.context,
        };

        if( this.state.account_details ) {
            this._checkCanAddPass();
        } else {
            this._getAccountDetails();
        }
    }

    _isMounted = false;

    _isLoadingCard = false;

    onAddPaymentPassViewControllerDidPrepare = this.onAddPaymentPassViewControllerDidPrepare.bind(this)
    onAddPaymentPassViewControllerDidSucceed = this.onAddPaymentPassViewControllerDidSucceed.bind(this)
    onAddPaymentPassViewControllerDidFail = this.onAddPaymentPassViewControllerDidFail.bind(this)

    /**
     * get the account details
     */
    _getAccountDetails = () => {

        UserService.getAccountDetails()
            .then(( data ) => {

                if( this._isMounted ) {

                    this.setState({
                        account_details: data.details,
                    });

                    this._checkCanAddPass();
                }
            })
            .catch(( error ) => {

                logError( 'failed to get account details', 'MastercardProvisioning->_getAccountDetails', error );

            });
    }

    /**
     * Check if the pass is addable
     */
    _checkCanAddPass = () => {

        if( this.state.account_details ) {

            NativeModules.RNRCL.canAddPass( this.state.account_details.fPanId )
                .then(( can_add_pass ) => {

                    this.setState({
                        can_add_pass: can_add_pass,
                        button_available: true,
                    });
                })
                .catch(( error ) => {

                    logError( 'failed to fetch can add pass', 'MastercardProvisioning->_checkCanAddPass', error );

                });
        }
    }

    /**
     * provision
     */
    _provision = () => {

        Mastercard.provision( this.state.account_details.cardSerial, this.state.account_details.fPanId, this.state.account_details.cardHolderName, this.state.account_details.cardNumberSuffix )
            .catch(( error ) => {

                logError( 'Mastercard provisioning failed', 'MastercardProvisioning->_provision', error );
                alert(error.message);

            });
    }

    componentDidMount() {

        this._isMounted = true;

        // if the account details were not supplied as a prop, then fetch them
        if( !this.state.account_details ) {
            this._getAccountDetails();
        }

        rnrclEmitter.addListener('addPaymentPassViewControllerDidPrepare', this.onAddPaymentPassViewControllerDidPrepare)
        rnrclEmitter.addListener('addPaymentPassViewControllerDidSucceed', this.onAddPaymentPassViewControllerDidSucceed)
        rnrclEmitter.addListener('addPaymentPassViewControllerDidFail', this.onAddPaymentPassViewControllerDidFail)

    }

    componentWillUnmount() {

        this._isMounted = false;

        rnrclEmitter.removeListener('addPaymentPassViewControllerDidPrepare', this.onAddPaymentPassViewControllerDidPrepare)
        rnrclEmitter.removeListener('addPaymentPassViewControllerDidSucceed', this.onAddPaymentPassViewControllerDidSucceed)
        rnrclEmitter.removeListener('addPaymentPassViewControllerDidFail', this.onAddPaymentPassViewControllerDidFail)
    }

    componentWillReceiveProps = (nextProps) => {

        this._getAccountDetails();
    }

    onAddPaymentPassViewControllerDidPrepare( args ) {

    }

    onAddPaymentPassViewControllerDidSucceed( args ) {

        AsyncStorage.setItem( CONFIG.storage.key.cardInWallet, '1' );

        if( this._isMounted ) {
            this.setState({
                wallet_outcome: { success: true },
                button_available: false,
            });
        }
    }

    onAddPaymentPassViewControllerDidFail( args ) {
        logError( 'payment pass failed', 'MastercardProvisioning->onAddPaymentPassViewControllerDidFail', args );
    }

    render() {

        return (
            <View style={styles.section}>
            {
                ( this.state.deviceSupportsWallet && this.state.account_details && this.state.can_add_pass && this.state.button_available ) &&
                <AddPassButton
                    style={styles.addPassButton}
                    addPassButtonStyle={PassKit.AddPassButtonStyle.black}
                    onPress={() => {
                        this._provision()
                    }}
                />
            }
            {
                ( this.state.deviceSupportsWallet && this.state.account_details && this.state.can_add_pass ) &&
                <MastercardWalletOutcome wallet_outcome={this.state.wallet_outcome} context={ this.state.context }/>
            }
            </View>
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
    addPassButton: {
        height: PassKit.AddPassButtonHeight,
        width: PassKit.AddPassButtonWidth
    }
}

// Wrap and export
export default function( props ) {

    const navigation = useNavigation();

    return <MastercardProvisioning {...props} navigation={navigation} />;
}
