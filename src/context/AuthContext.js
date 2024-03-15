import React, { Component, createContext } from 'react';
// react native core - https://facebook.github.io/react-native/docs/getting-started.html
import { Alert, Platform, Image, AppState } from 'react-native';
// https://github.com/emeraldsanto/react-native-encrypted-storage
import EncryptedStorage from 'react-native-encrypted-storage';
// https://react-native-async-storage.github.io/async-storage/docs/usage
import AsyncStorage from '@react-native-async-storage/async-storage';
// https://www.npmjs.com/package/react-native-keychain
import * as Keychain from 'react-native-keychain';
// https://github.com/naoufal/react-native-touch-id
import TouchID from 'react-native-touch-id';
// https://www.npmjs.com/package/react-native-biometrics
import ReactNativeBiometrics from 'react-native-biometrics';
// https://github.com/meinto/react-native-event-listeners
import { EventRegister } from 'react-native-event-listeners';
// https://www.npmjs.com/package/react-native-pusher-push-notifications
import RNPusherPushNotifications from 'react-native-pusher-push-notifications';
// lodash
import { _ } from 'lodash';
// components
import FormField from '../components/FormField';
// styles
import { STYLES } from '../Styles';
// configs
import { _i } from '../Translations';
import { validate, validateField, logError } from '../Helpers';
import CONFIG from '../Config';
// services
import * as AuthService from '../services/auth';
import * as MastercardService from '../services/mastercard';

export const AuthContext = createContext();

class AuthContextProvider extends Component {

    // mounted flag
    _isMounted = false;

    constructor( props ) {

        super(props);

        this.state = {
            // storage keys for various values...
            storedPasscodeKey: CONFIG.storage.key.storedPasscodeKey,
            storedMemorableWordKey: CONFIG.storage.key.storedMemorableWordKey,
            storedBiometricKey: CONFIG.storage.key.storedBiometricKey,
            stored2FACodeKey: CONFIG.storage.key.stored2FACodeKey,
            storedAccessTokenKey: CONFIG.storage.key.storedAccessTokenKey,
            storedPhoenixCsrfTokenKey: CONFIG.storage.key.storedPhoenixCsrfTokenKey,
            storedPhoenixAssetPathKey: CONFIG.storage.key.storedPhoenixAssetPathKey,
            storedChallengeHistoryKey: CONFIG.storage.key.storedChallengeHistoryKey,
            storedSSOKeyKey: CONFIG.storage.key.storedSSOKeyKey,
            // current route name
            currentRouteName: null,
            // phoenix csrf - popu;lated by the meta request
            phoenixCsrf: null,
            // phoeix asset path - populated by the meta request
            phoenixAssetPath: null,
            // 2FA code
            code: null,
            // authorisation token from bridge
            accessToken: null,
            // phoenix sso key
            SSOKey: null,
            // bool flag used in Routes to switch between authenticated and unauthenticated stacks
            isAuthenticated: false,
            // object containing the users' preferences i.e. user has chosen to enable face id
            authPreference: null,
            // a computed object that contains all values required for the current 'quick access' login method e.g. biometric OR passcode OR email
            authMethod: null,
            // bool flag for showing a 'quick access' login method
            authModalActive: false,
            // bool flag that shows/hides the loading spinner
            submitInProgress: false,
            // counts failed login attemtps. used for determining UI messaging i.e. first attempt vs subsequent attempt
            authFailedAttempts: 0,
            // user entered value for entry passcode
            passcode: '',
            // bool flag for if 'this' user can access developer features or not
            developerMode: false,
            // 3DS mastercard challenge
            has3DSChallenge: false,
            // the step in the challenge flow
            challengeStep: 1,
            // 3DS - true whilst a request is pending
            challengeUpdatePending: false,
            // 3DS true once a challenge has been resolved
            challengeUpdateComplete: false,
            // challenge was a success bool
            challengeSuccess: false,
            // challenge failed attempts
            challengeFailedAttempts: 0,
            // challenge allowed attemptes
            challengeMaxAttempts: 3,
            // flag to show a challenge retrry
            allowBiometricRetry: false,
            challengeError: false,
            challengeErrorMessage: null,
            challengeValue: null,
            challengeManuallyRejected: false,
            // challenge id
            challengeId: null,
            // 3DS challenge method
            challengeMethod: null,
            // challenge attempts
            challengeAttempts: 0,
            // the index positions of challenged memword characters
            memwordChallenge: [],
            // user entred value for memorable word challenge characters
            memword: '', 
            // auth image
            authImage: null,
            // all auth form fields
            fields: {
                // AuthLoginScreen login form
                login: {
                    email: {
                        active: true,
                        key: 'email',
                        type: 'text',
                        value: '',
                        required: true,
                        pristine: true,
                        validation: [],
                        valid: false,
                        label: _i('Email'),
                        labelColor: STYLES.colors.navy.default,
                        message: null,
                        messageColor: STYLES.colors.white,
                        inputColor: STYLES.colors.navy.default,
                        borderColor: STYLES.colors.white,
                        borderStyle: 'underline',
                        textContentType: 'emailAddress',
                        keyboardType: 'email-address',
                        autoCapitalize: 'none',
                        editable: true,
                        secureTextEntry: false,
                        maxLength: 500,
                    },
                    password: {
                        active: true,
                        key: 'password',
                        type: 'text',
                        value: '',
                        required: true,
                        pristine: true,
                        validation: [],
                        valid: false,
                        label: _i('Password'),
                        message: null,
                        messageColor: STYLES.colors.white,
                        labelColor: STYLES.colors.navy.default,
                        inputColor: STYLES.colors.navy.default,
                        borderColor: STYLES.colors.white,
                        borderStyle: 'underline',
                        textContentType: 'password',
                        keyboardType: null,
                        autoCapitalize: 'none',
                        editable: true,
                        secureTextEntry: true,
                        maxLength: 500,
                    },
                },
                forgotPasswordEmail: {
                    email: {
                        active: true,
                        key: 'email',
                        type: 'text',
                        value: '',
                        required: true,
                        pristine: true,
                        validation: [
                            {type: 'email', value: null}
                        ],
                        valid: false,
                        label: _i('Email'),
                        labelColor: STYLES.colors.navy.default,
                        message: null,
                        messageColor: STYLES.colors.white,
                        inputColor: STYLES.colors.white,
                        borderColor: STYLES.colors.white,
                        borderStyle: 'underline',
                        textContentType: 'emailAddress',
                        keyboardType: 'email-address',
                        autoCapitalize: 'none',
                        editable: true,
                        secureTextEntry: false,
                        maxLength: 500,
                    },
                    confirmEmail: {
                        active: true,
                        key: 'confirmEmail',
                        type: 'text',
                        value: '',
                        required: true,
                        pristine: true,
                        validation: [
                            {type: 'email', value: null}
                        ],
                        valid: false,
                        label: _i('Confirm Email'),
                        labelColor: STYLES.colors.navy.default,
                        message: null,
                        messageColor: STYLES.colors.white,
                        inputColor: STYLES.colors.white,
                        borderColor: STYLES.colors.white,
                        borderStyle: 'underline',
                        textContentType: 'emailAddress',
                        keyboardType: 'email-address',
                        autoCapitalize: 'none',
                        editable: true,
                        secureTextEntry: false,
                        maxLength: 500,
                    },
                },
                forgotEmail2FA: {
                    verifyCode: {
                        active: true,
                        key: 'verifyCode',
                        type: 'text',
                        value: '',
                        required: true,
                        pristine: true,
                        validation: [
                            { type: 'max-char', value: 5 },
                            { type: 'min-char', value: 5 },
                            { type: 'digitsOnly', value: 'digits'}
                        ],
                        valid: false,
                        label: _i('Password Reset Code'),
                        labelColor: STYLES.colors.yellow.default,
                        message: null,
                        messageColor: STYLES.colors.white,
                        inputColor: STYLES.colors.white,
                        borderColor: STYLES.colors.white,
                        borderStyle: 'full',
                        textContentType: 'none',
                        autoCapitalize: 'none',
                        editable: true,
                        secureTextEntry: false,
                        maxLength: 8,
                    },
                },
                changePassword: {
                    password: {
                        active: true,
                        key: 'password',
                        type: 'text',
                        value: '',
                        required: true,
                        pristine: true,
                        validation: [
                            { type: 'min-char', value: 8 },
                            { type: '2fa-password', value: null }
                        ],
                        valid: false,
                        label: _i('Password'),
                        message: null,
                        messageColor: STYLES.colors.white,
                        labelColor: STYLES.colors.white,
                        inputColor: STYLES.colors.white,
                        borderColor: STYLES.colors.white,
                        borderStyle: 'underline',
                        textContentType: 'password',
                        keyboardType: null,
                        autoCapitalize: 'none',
                        editable: true,
                        secureTextEntry: true,
                        maxLength: 500,
                    },
                    confirmPassword: {
                        active: true,
                        key: 'confirmPassword',
                        type: 'text',
                        value: '',
                        required: true,
                        pristine: true,
                        validation: [
                            { type: 'min-char', value: 8 },
                            { type: '2fa-password', value: null }
                        ],
                        valid: false,
                        label: _i('Confirm Password'),
                        message: null,
                        messageColor: STYLES.colors.white,
                        labelColor: STYLES.colors.white,
                        inputColor: STYLES.colors.white,
                        borderColor: STYLES.colors.white,
                        borderStyle: 'underline',
                        textContentType: 'password',
                        keyboardType: null,
                        autoCapitalize: 'none',
                        editable: true,
                        secureTextEntry: true,
                        maxLength: 500,
                    },
                },
                // AuthLoginSecurityScreen - the screen after login where users enter 2FA code
                security: {
                    code: {
                        active: true,
                        key: 'code',
                        type: 'text',
                        value: '',
                        required: true,
                        pristine: true,
                        validation: [
                            { type: 'max-char', value: 8 },
                            { type: 'min-char', value: 8 },
                        ],
                        valid: false,
                        label: _i('Enter your passcode'),
                        labelColor: STYLES.colors.yellow.default,
                        message: null,
                        messageColor: STYLES.colors.white,
                        inputColor: STYLES.colors.white,
                        borderColor: STYLES.colors.white,
                        borderStyle: 'full',
                        textContentType: 'none',
                        //keyboardType: 'number-pad',
                        autoCapitalize: 'none',
                        editable: true,
                        secureTextEntry: false,
                        maxLength: 8,
                    },
                },
                challenge: {
                    passcode: {
                        active: true,
                        key: 'passcode',
                        type: 'text',
                        value: '',
                        required: true,
                        pristine: true,
                        validation: [
                            { type: 'max-char', value: 6 },
                            { type: 'min-char', value: 6 },
                        ],
                        valid: false,
                        label: _i('Enter your passcode'),
                        labelColor: STYLES.colors.navy.default,
                        message: null,
                        messageColor: STYLES.colors.navy.default,
                        inputColor: STYLES.colors.navy.default,
                        borderColor: STYLES.colors.navy.default,
                        borderStyle: 'full',
                        textContentType: 'none',
                        keyboardType: 'number-pad',
                        autoCapitalize: 'none',
                        editable: true,
                        secureTextEntry: false,
                        maxLength: 6,
                        extraStyles: {
                            textAlign: 'center',
                            letterSpacing: 5,
                        }
                    },
                },
            },
        };

    }

    /**
     * get any pending challenges from bridge
     * called upon login in MainLoading
     * @returns 
     */
     getPendingChallenges = async () => {

        // there is a live challenge already when this is called then we'll not look for another
        if( this.state.has3DSChallenge ) return;

        try {
            const challengeResponse = await MastercardService.getPendingChallenges();
            const challenge = challengeResponse?.data?.data;

            if( challenge && !Array.isArray(challenge) && challenge.hasOwnProperty('id') )  await this.handleChallenge( challenge );

        } catch( error ) {
            logError( 'Failed to get pending challenges', 'AuthContext->getPendingChallenges', error );
        }

        return;
    }

    getHas3DSChallenge = async () => {
        return this.state.has3DSChallenge;
    }

    /**
     * if biometrics is supported return the type, else false
     * @returns false/{string}
     */
     getBiometricSupported = async () => {

        try {
            const { biometryType } = await ReactNativeBiometrics.isSensorAvailable();

            if ( biometryType === ReactNativeBiometrics.TouchID ) {
                return 'TouchID';
            } else if ( biometryType === ReactNativeBiometrics.FaceID ) {
                return 'FaceID';
            } else if ( biometryType === ReactNativeBiometrics.Biometrics ) {
                return 'Biometrics';
            }

            return null;
            //return biometricSupported;
        } catch( error ) {
            logError( 'Failed to detect if biometric is supported', 'AuthContext->getBiometricSupported', error );
        }
    }

    /**
     * do we have username and password in keychain?
     * @returns {bool}
     */
    hasCredentials = async () => {
        const credentials = await this.getCredentials();
        return credentials?.username && credentials?.password ? true : false;
    }

    /**
     *
     * @returns returns obj containing user's auth preferences
     */
    getAuthPreference = async () => {

        const code = await this.get2FACode();

        const authPreference = {
            passcode: await this.getPasscode(),
            biometricPreference: await this.getBiometricPreference(),
            hasCredentials: await this.hasCredentials(),
            has2FACode: code ? true : false,
        };
        
        if( this._isMounted ) {
            await this.setState({ authPreference, code });
        }
        await this.setAuthMethod();

        return authPreference;
    };

    /**
     * get the meta data from phoenix - importantly this includes the csrf token
     */
    getPhoenixMeta = async () => {

        try {

            const phoenixMeta = await AuthService.getPhoenixMeta();
            const csrf = _.get( phoenixMeta, 'token', null );
            const assetPath = _.get( phoenixMeta, 'asset_path', null );

            if( !csrf ) {
                throw 'Phoenix did not provide a csrf token';
            }

            await this.setPhoenixCsrfToken( csrf );
            await this.setPhoenixMeta( phoenixMeta );
            await this.setPhoenixAssetPath( assetPath );

            return { success: true };

        } catch( error ) {
            logError( 'Phoenix failed during request for meta data', 'AuthContext->getPhoenixMeta', error );
            return new Promise(( resolve, reject ) => { reject( error )});
        }
    }

    getAuthMethod = async overrides => {
        // we're gonna be referencing optional properties of this, so MUST be an object literal even if not supplied
        overrides = overrides || {};
        // email by dedfault
        let authMethod = {
            type: 'email',
            heading: '',
            body: '',
            icon: '',
            actions: [],
            active: false,
        };

        // we can only proceed with a quick login method if we're sure we know the credentials and we have the 2FA code
        if( this.state.authPreference.hasCredentials && this.state.authPreference.has2FACode ) {
            // we need to establish up front the dedsired type because that establishes how all else is defined
            // always favour the manually provided override if it exists
            if( overrides['type'] ) {
                authMethod.type = overrides['type'];
            } else if( this.state.authPreference.biometricPreference && this.state.authPreference.biometricPreference != '0' ) {
                authMethod.type = this.state.authPreference.biometricPreference;
            } else if( this.state.authPreference.passcode ) {
                authMethod.type = 'passcode';
            }

            // TODO: android biometric is not going to provide FaceID or TouchID, so I need still to work out how to manage this scenario
            switch( authMethod.type ) {
                case 'FaceID':
                    authMethod.type = 'FaceID';
                    authMethod.heading = overrides['heading'] || _i('Sign in with Face ID');
                    authMethod.body = overrides['body'] || _i('Start face scan to access the app');
                    authMethod.icon = overrides['icon'] || 'rp-icon-face-id';
                    authMethod.actions = overrides['actions'] || [
                        { key: '1', label: this.state.authFailedAttempts === 0 ? _i('Start Face Scan') : _i('Try Again'), color: STYLES.colors.navy.default, onPressEvent: this.bioAuthenticate },
                        { key: '3', label: _i('Use Email/Password'), color: STYLES.colors.gray.light, onPressEvent: this.dismissAuthModal }
                    ];

                    if( this.state.authPreference.passcode && !overrides['actions'] ) {
                        authMethod.actions.push( { key: '2', label: _i('Use Passcode'), color: STYLES.colors.gray.light, onPressEvent: this.passwordAuthenticate } );
                    }

                    authMethod.active = true;
                    break;
                case 'TouchID':
                    authMethod.type = 'TouchID';
                    authMethod.heading = overrides['heading'] || _i('Sign in with Touch ID');
                    authMethod.body = overrides['body'] || _i('Unlock with fingerprint pad to continue');
                    authMethod.icon = overrides['icon'] || 'rp-icon-touch-id-init';
                    authMethod.actions = overrides['actions'] || [
                        { key: '1', label: this.state.authFailedAttempts === 0 ? _i('Scan Fingerprint') : _i('Try Again'), color: STYLES.colors.navy.default, onPressEvent: this.bioAuthenticate },
                        { key: '3', label: _i('Use Email/Password'), color: STYLES.colors.gray.light, onPressEvent: this.dismissAuthModal }
                    ];

                    if( this.state.authPreference.passcode && !overrides['actions'] ) {
                        authMethod.actions.push( { key: '2', label: _i('Use Passcode'), color: STYLES.colors.gray.light, onPressEvent: this.passwordAuthenticate } );
                    }
                    authMethod.active = true;
                    break;
                case 'Biometrics':
                    authMethod.type = 'Biometrics';
                    authMethod.heading = overrides['heading'] || _i('Scan to sign in');
                    authMethod.body = overrides['body'] || _i('Unlock with biometrics to continue');
                    authMethod.icon = overrides['icon'] || 'rp-icon-face-id-init';
                    authMethod.actions = overrides['actions'] || [
                        { key: '1', label: this.state.authFailedAttempts === 0 ? _i('Start Scan') : _i('Try Again'), color: STYLES.colors.navy.default, onPressEvent: this.bioAuthenticate },
                        { key: '3', label: _i('Use Email/Password'), color: STYLES.colors.gray.light, onPressEvent: this.dismissAuthModal }
                    ];

                    if( this.state.authPreference.passcode && !overrides['actions'] ) {
                        authMethod.actions.push( { key: '2', label: _i('Use Passcode'), color: STYLES.colors.gray.light, onPressEvent: this.passwordAuthenticate } );
                    }
                    authMethod.active = true;
                    break;
                case 'passcode':
                    authMethod.type = 'passcode';
                    authMethod.heading = overrides['heading'] || _i('Sign in with Passcode');
                    authMethod.body = overrides['body'] ||  _i('Enter your passcode to continue');
                    authMethod.icon = overrides['icon'] || null;
                    authMethod.actions = overrides['actions'] || [
                        { key: '1', label: _i('Submit'), color: STYLES.colors.navy.default, onPressEvent: this.verifyPasscode },
                        { key: '2', label: _i('Use Email/Password'), color: STYLES.colors.gray.light, onPressEvent: this.dismissAuthModal }
                    ];
                    authMethod.active = true;
                default:
                    // NOT SURE YET
            }
        }

        // we need to re-sort the array of actions because they're coonditionally present
        if( Array.isArray( authMethod.actions ) ) authMethod.actions = _.sortBy( authMethod.actions, ['key']);

        return authMethod;
    }

    getChallengeMethod = async () => {

        const authPreferenceTest = await this.getAuthPreference();

        // email by dedfault
        let challengeMethod = {
            type: '',
            buttonLabel: '',
            body: '',
            icon: '',
            isBiometric: false,
        };

        // always favour the manually provided override if it exists
        if( this.state.authPreference.biometricPreference && this.state.authPreference.biometricPreference != '0' ) {
            challengeMethod.type = this.state.authPreference.biometricPreference;
        } else if( this.state.authPreference.passcode ) {
            challengeMethod.type = 'passcode';
        }

        // TODO: android biometric is not going to provide FaceID or TouchID, so I need still to work out how to manage this scenario 
        switch( challengeMethod.type ) {
            case 'FaceID':
                challengeMethod.type = 'FaceID';
                challengeMethod.buttonLabel = _i('Start Scanning');
                challengeMethod.body = _i('Start face scan to authorise transaction');
                challengeMethod.icon = 'rp-icon-face-id';
                challengeMethod.isBiometric = true;
                break;
            case 'TouchID':
                challengeMethod.type = 'TouchID';
                challengeMethod.buttonLabel = _i('Start Scanning');
                challengeMethod.body = _i('Use your fingerprint to authorise transaction');
                challengeMethod.icon = 'rp-icon-touch-id-init';
                challengeMethod.isBiometric = true;
                break;
            case 'Biometrics':
                challengeMethod.type = 'Biometrics';
                challengeMethod.buttonLabel = _i('Start Scanning');
                challengeMethod.body = _i('Use biometric scanning to authorise transaction');
                challengeMethod.icon = 'rp-icon-face-id-init';
                challengeMethod.isBiometric = true;
                break;
            case 'passcode':
                challengeMethod.type = 'passcode';
                challengeMethod.buttonLabel = _i('Submit Passcode');
                challengeMethod.body = _i('Enter your passcode to authorise transaction');
                challengeMethod.icon = null;
                challengeMethod.isBiometric = false;
            default:
                // NOT SURE YET
        }

        return challengeMethod;
    }

    /**
     * 
     */
    setAuthMethod = async overrides => {
        
        const authMethod = await this.getAuthMethod( overrides );

        if( this._isMounted ) {
            await this.setState({
                authMethod: authMethod,
                authModalActive: authMethod.active,
            });
        }

        return authMethod;
    }

    dismissAuthModal = () => {
        if( this._isMounted ) {
            this.setState({ authModalActive: false });
        }
    }

    /**
     * get a passcode from encrypted storage
     * @returns passcode
     */
    getPasscode = async () => {
        return await EncryptedStorage.getItem( this.state.storedPasscodeKey ) ?? null;
    };

    /**
     * updates the context state with user entered passcode value
     * @returns
     */
    enterPasscode = async passcode => {
        if( this._isMounted ) {
            return this.setState({ passcode });
        }
    }

    /**
     * reset the passcode
     * @returns 
     */
    resetPasscode = async () => {
        if( this._isMounted ) {
            return this.setState({ passcode: '' });
        }
    }

    /**
     * a user triggered action that checks a user entered passcode against the stored passcode
     */
    verifyPasscode = async () => {

        if( this.passcodeMatches() ) {
            this.keychainLogin();
        } else {
            EventRegister.emit( 'reset-passcode', null );
            Alert.alert( _i('Incorrect Passcode'), _i('You entered the incorrect passcode, please try again') );
        }
    }

    passcodeMatches = () => {
        return this.state.passcode == this.state.authPreference.passcode;
    }

    /**
     * get a memorable word from encrypted storage
     * @returns memword
     */
    getMemword = async () => {
        return await EncryptedStorage.getItem( this.state.storedMemorableWordKey ) ?? null;
    };

    /**
     * updates the context state with user entered memword value
     * @returns 
     */
     enterMemword = async memword => {
        if( this._isMounted ) {
            return this.setState({ memword });
        }
    }

    /**
     * check to see if the submitted characters are correct according to the meorable word.
     */
    memwordValid = async () => {
        const storedMemword = await EncryptedStorage.getItem( this.state.storedMemorableWordKey );
        const challenge = this.state.memwordChallenge;
        let solution = '';

        for( let i = 0; i < challenge.length; i++ ) {
            solution += storedMemword[challenge[i]];
        }

        return this.state.memword.toLowerCase() == solution.toLowerCase();
    };

    /**
     * reset the passcode
     * @returns 
     */
     resetMemword = async () => {
        if( this._isMounted ) {
            return this.setState({ memword: '' });
        }
    }

    /**
     * get a biometric preference
     * @returns 'FaceID' || 'TouchID' || 'Biometric' || null
     */
    getBiometricPreference = async () => {

        const supportedBiometric = await this.getBiometricSupported();
        const preferedBiometric = await AsyncStorage.getItem( this.state.storedBiometricKey ) ?? null;

        if( !supportedBiometric || preferedBiometric === '0' ) {
            return null;
        }

        return supportedBiometric;

    };

    /**
     * set the keychain credentials
     * @returns
     */
    setCredentials = async ( email, password) => {

        if( !email || !password ) return;

        return await Keychain.setGenericPassword( email, password );
    }

    /**
     * get the keychain credentials
     * @returns
     */
    getCredentials = async () => {
        return await Keychain.getGenericPassword();
    }

    get2FACode = async () => {
        return await EncryptedStorage.getItem( this.state.stored2FACodeKey ) ?? null;
    }

    /**
     * receive a passcode and set it
     * @param {str} passcode
     * @returns
     */
    setPasscode = async passcode => {

        try {
            // validate the passcode
            // 6 digit numerical string only
            if( !passcode || 'string' !== typeof passcode || passcode.length !== 6 || !/^\d+$/.test( passcode ) ) {
                throw new Error('invalid passcode format');
            }

            await EncryptedStorage.setItem( this.state.storedPasscodeKey, passcode );

            return true;

        } catch( error ) {
            logError( 'failed to set passcode', 'AuthContext->setPasscode', error );
        }

    };

    /**
     * receive a memorable word and set it
     * @param {str} memword
     * @returns
     */
     setMemword = async memword => {
        try {
            // validate the passcode
            // 6 digit numerical string only
            if( !memword || 'string' !== typeof memword ) {
                throw new Error('invalid memword format');
            }

            await EncryptedStorage.setItem( this.state.storedMemorableWordKey, memword );

            return true;

        } catch( error ) {
            logError( 'failed to set memword', 'AuthContext->setMemword', error );
        }

    };

    /**
     * get a random character index from a supplied array
     */
    getRandomCharIndex = ( arr ) => {
        return Math.floor( Math.random() * arr.length );
    }

    /**
     * regenerate a new memorable word challenge
     */
    generateMemwordChallenge = async () => {
        // first get the memorable word
        const memword = await EncryptedStorage.getItem( this.state.storedMemorableWordKey );
        // set up the challenge array
        const memwordChallenge = [];
        // set up index placeholder
        let charIndex;
        // randomly get the positions of 3 chars from the memorable word
        for( let i = 0; i < 3; i++ ) {
            // a unique flag...
            let unique = false;
            // just keep regenerating charIndexes until we get a unique one
            while( !unique ) {
                charIndex = this.getRandomCharIndex( memword );
                if( !memwordChallenge.includes(charIndex) ) {
                    // add it to the challenge
                    memwordChallenge.push(charIndex);
                    // tell the while loop we're done here
                    unique = true;
                }
            }
        }
        // make sure the challenge is in index order asc
        memwordChallenge.sort( function( a, b ) {
            return a - b;
        });
        if( this._isMounted ) {
            // save to state.
            this.setState({ memwordChallenge });
        }

        return memwordChallenge;
    }

    /**
     * set biomeric preference
     * @param {str} preference
     * @returns
     */
     setBiometric = async preference => {
        try {
            await EncryptedStorage.setItem( this.state.storedPasscodeKey, preference );
            return true;

        } catch( error ) {
            logError( 'failed to set biometric preference', 'AuthContext->setBiometric', error );
        }

    };

    /**
     * set 2 factor auth code
     * @param {str} code
     * @returns
     */
     set2FACode = async code => {
        try {
            await EncryptedStorage.setItem( this.state.stored2FACodeKey, code );
            return true;

        } catch( error ) {
            logError( 'failed to set 2 factor auth code', 'AuthContext->set2FACode', error );
        }

    };

    /**
     * set access token
     * @param {str} token
     * @returns
     */
     setAccessToken = async token => {
        try {
            if( this._isMounted ) {
                await this.setState({ accessToken: token });
            }
            await EncryptedStorage.setItem( this.state.storedAccessTokenKey, token );
            return true;

        } catch( error ) {
            logError( 'failed to set access token', 'AuthContext->setAccessToken', error );
        }

    };

    /**
     * set phoenix csrf token
     * @param {str} csrf
     * @returns
     */
     setPhoenixCsrfToken = async csrf => {
        try {
            if( this._isMounted ) {
                await this.setState({ phoenixCsrf: csrf });
            }
            await EncryptedStorage.setItem( this.state.storedPhoenixCsrfTokenKey, csrf );
            return true;

        } catch( error ) {
            logError( 'failed to set csrf token', 'AuthContext->setPhoenixCsrfToken', error );
        }

    };

    /**
     * set phoenix asset path
     * @param {str} csrf
     * @returns
     */
     setPhoenixAssetPath = async path => {

        try {
            if( this._isMounted ) {
                await this.setState({ phoenixAssetPath: path });
            }
            await AsyncStorage.setItem( this.state.storedPhoenixAssetPathKey, path );
            return true;

        } catch( error ) {
            logError( 'failed to set phoenix asset path', 'AuthContext->storedPhoenixAssetPathKey', error );
        }

    };

    /**
     * set phoenix meta
     * @param {str} meta
     * @returns
     */
     setPhoenixMeta = async meta => {

        const authImage = await this.getAuthImage( meta );

        try {
            if( this._isMounted ) {
                return await this.setState({
                    phoenixAssetPath: meta.asset_path,
                    authImage: authImage
                });
            }

        } catch( error ) {
            logError( 'failed to set phoenix meta', 'AuthContext->setPhoenixMeta', error );
        }
    };

    /**
     * get the full auth image url from the meta
     * @param {obj} meta
     * @returns 
     */
     getAuthImage = async meta => {

        if( !meta ) return null;

        if( !meta.asset_path || !meta.homepage_image ) return null;

        const url = meta.asset_path + meta.homepage_image;

        try {
            const test = await Image.prefetch( url );
        } catch( error ) {
            logError( 'failed to prefetch image', 'AuthContext->getAuthImage', error );
        }

        return { uri: url }; 

    }
    /**
     * validates a colelction of one or many fieldsets
     * @param {arr} fieldSets is an array of string keys refering to the children of state.fields above.
     * @returns {bool}
     */
     isValid = fieldSets => {
        // fieldSets must be an array
        fieldSets = !Array.isArray(fieldSets) || !fieldSets ? [] : fieldSets;
        // valid field. true by default.
        let valid = true;
        // loop through the given fieldset keys
        for(let i = 0; i < fieldSets.length; i++ ) {
            // skip if the fieldset does not exist in this context
            if( !this.state.fields.hasOwnProperty( fieldSets[i] ) ) {
                console.warn(`validator could not find ${fieldSets[i]} in the onboardring context fields`);
                continue;
            }
            // validate this set
            if( !this.isValidSet( fieldSets[i], this.state.fields[fieldSets[i]] ) ) {
                valid = false;
            }
        }

        return valid;
    }

    /**
     * Compare field values and returns error if not the same.
     * @param {arr} fieldSets is an array of string keys refering to the children of state.fields above.
     * @returns {bool}
     */
    compareFields = (fieldValue1, fieldValue2) => { 
        
        if (!fieldValue1 || !fieldValue2) {
            return false
        }

        if(fieldValue1 == fieldValue2) {
            return true
        } else {
            return false
        }
    }

    /**
     * validates a single fieldset
     * @param {str} key
     * @param {obj} fieldSet
     */
    isValidSet = ( key, fieldSet ) => {

        const { isValid, updatedFields } = validate( fieldSet );
        // dupe the fields
        let fields = this.state.fields;
        // update the field set
        fields[key] = updatedFields;
        // set the state
        if( this._isMounted ) {
            this.setState({
                fields: fields
            });
        }

        return isValid;
    }

    /**
     * updates the state value of a specificed field in a specified fieldset
     * @param {str} fieldSetName
     * @param {str} field
     * @param {*} value
     */
    setValue = ( fieldSetName, field, value ) => {

        let fields = this.state.fields;

        fields[fieldSetName][field].value = value;

        if( !fields[fieldSetName][field].pristine ) {
            // if this field is not pristine then re-validate on change
            fields[fieldSetName][field] = validateField(fields[fieldSetName][field]);
        }
        // commit the entire fieldset back to state to update the interface
        if( this._isMounted ) {
            this.setState({
                fields: fields
            });
        }
    };

    renderFields = fieldSetName => {

        const fieldsArray = Object.values( this.state.fields[fieldSetName] );

        return fieldsArray.map((item, index) => {
            return (
                <FormField
                    index={ fieldsArray.length - index }
                    key={item.key}
                    fieldKey={item.key}
                    fieldSetName={fieldSetName}
                    type={item.type}
                    label={item.label}
                    labelColor={item.labelColor}
                    maxLength={item.maxLength}
                    message={item.message}
                    messageColor={item.messageColor}
                    borderColor={item.borderColor}
                    borderStyle={item.borderStyle}
                    extraStyles={item.extraStyles}
                    inputColor={item.inputColor}
                    textContentType={item.textContentType}
                    keyboardType={item.keyboardType}
                    autoCapitalize={item.autoCapitalize}
                    editable={item.editable}
                    required={item.required}
                    activeColor={item.activeColor || null}
                    activeIconColor={item.activeIconColor || null}
                    secureTextEntry={item.secureTextEntry}
                    updateValue={this.setValue}
                />
            );
        });

    }

    /**
     * login with user supplied email and password
     * @returns
     */
     manualLogin = async code => {

        // all requests to the login require email and password
        let payload = {
            email: this.state.fields.login.email.value,
            password: this.state.fields.login.password.value
        };
        // if we have a stored 2FA code, append here else the user will be required to go through 2FA
        if( code ) {
            payload['2fa_code'] = code;
            payload['2fa_success'] = 1;
        }

        return this.login( payload, code );
    };

    /**
     * login with stored credentials
     */
    keychainLogin = async () => {

        const credentials = await this.getCredentials();

        const payload = {
            '2fa_code': this.state.code,
            '2fa_success': 1,
            email: credentials.username,
            password: credentials.password
        }

        if( this._isMounted ) {
            this.setState({ submitInProgress: true });
        }

        this.login( payload )
            .then( response => {
                this.grantAccess();
            })
            .catch( error => {

                //this.resetAuth();
                Alert.alert(_i('Sorry!'), _i('We were unable to log you in using the credentials stored on your device. Please manually log in using your email address and password.'))
                console.warn( 'this.login error', error );

            })
            .finally(() => {
                if( this._isMounted ) {
                    this.setState({
                        submitInProgress: false,
                        authModalActive: false,
                    });
                }
            });

    }

    // make an actual login request
    login = async ( payload, code ) => {

        return new Promise(( resolve, reject ) => {
            AuthService.login( payload )
                .then( data => {

                    console.log("HERE IS THE AUTH ERROR! ", data);

                    let bridge = data.bridge;
                    let phoenix = data.phoenix;
                    const email = _.get( bridge, 'user.data.email', null );
                    const userId = _.get( bridge, 'user.data.id', null );
                    const accessToken = bridge.access_token;
                    const ssoKey = bridge.sso_key;

                    if( !accessToken ) {
                        // TODO: handle no token error
                        reject({ success: false, error: 'Token missing error' });
                        return;
                    }

                    this.postLoginActions( accessToken, payload, userId, code, ssoKey );

                    // determine if we need to go through 2FA
                    bridge.require2FA = this.get2FARequired( bridge );

                    resolve( bridge );
                })
                .catch( error => {

                    const errorDetail = {
                        error: error,
                        payload: payload,
                        code: code
                    };

                    // reset code
                    if( this._isMounted ) {
                        this.setState({ code: null });
                    }

                    logError( 'Login error located in the AuthService', 'AuthContext->login', errorDetail );
                    // do a reset auth action
                    //this.resetAuth();
                    reject( error );
                });
        });
    }

    postLoginActions = async ( accessToken, credentials, userId, code, ssoKey ) => {

        // set the access token
        await this.setAccessToken( accessToken );
        // set the sso key
        await this.setSSOKey( ssoKey );

        // if we were supplied a 2fa code, set it to storage
        if( code ) this.set2FACode( code );

        if( code || credentials['2fa_code'] ) {
            // only init notifications after a 2fa code login
            await this.initNotifications();

            await this.resetFields();
        }
        // store the credentials in keystore
        if( credentials ) await this.setCredentials( credentials?.email, credentials?.password );

        await this.getPendingChallenges();

        this.setDeveloperMode( credentials.email );

    }

    /**
     * set sso key
     * @param {str} SSOKey
     * @returns
     */
     setSSOKey = async SSOKey => {
        try {
            if( this._isMounted ) {
                await this.setState({ SSOKey: SSOKey });
            }
            await EncryptedStorage.setItem( this.state.storedSSOKeyKey, SSOKey );
            return true;

        } catch( error ) {
            logError( 'failed to set sso key', 'AuthContext->SSOKey', error );
        }

    };

    resetFields = async () => {
        
        const fields = this.state.fields;

        fields.login.email.value = '';
        fields.login.password.value = '';
        fields.security.code.value = '';
        fields.challenge.passcode.value = '';

        if( this._isMounted ) {
            await this.setState({ fields });
        }

        return;

    }

    /**
     * determine if the authenticated user is permitted to view in developer mode
     * @returns
     */
    setDeveloperMode = email => {
        //this.setState({ developerMode: true });
        //return;
        // TODO - we probably need a better way of doing this with roles I guess!!!
        // but this is fine for now ... all cigroup emails are treated as being in developer mode
        if( email && typeof email === 'string' ) {
            if( this._isMounted ) {
                //this.setState({ developerMode: email.includes('cigroup.co.uk') });
                // check to see if this in the array of internal email hosts
                CONFIG.security.internalEmailHosts.find( allowed => {
                    if( email.includes( allowed ) && this._isMounted ) {
                        this.setState({ developerMode: true });
                    }
                });
            }
        }
    }

    /**
     * request a security code
     * @returns
     */
    requestSecurityCode = async () => {

        return new Promise(( resolve, reject ) => {
            AuthService.requestSecurityCode()
                .then( data => {
                    resolve( data );
                })
                .catch( error => {
                    logError( 'Request Security Code Error', 'AuthContext->requestSecurityCode', error );
                    reject( error );
                });
        });

    };

    /**
     * submit a security code
     * @param {*} response
     * @returns
     */
    submitSecurityCode = async () => {

        const code = this.state.fields.security.code.value;

        if( this._isMounted ) {
            await this.setState({ code: code });
        }

        return this.manualLogin( code );
    }

    get2FARequired = response => {
        let require2FA = false;

        if( !response.user ) {
            require2FA = true;
        }

        if( !this.state.code ) {
            require2FA = true;
        }

        return require2FA;

    }

    passwordAuthenticate = () => {
        this.setAuthMethod({ type: 'passcode' });
    }

    bioAuthenticate = async () => {

        const method = await this.getBiometricSupported();
        let promptMessage = 'Start scan';

        if( method == 'FaceID' ) {
            this.setAuthMethod({ icon:'rp-icon-face-id-init', body: 'Scanning for Face ID, look into the camera' });
            promptMessage = 'Confirm face scan';
        } else if( method == 'TouchID' ) {
            this.setAuthMethod({ icon:'rp-icon-touch-id-init', body: 'Scanning for fingerprint' });
            promptMessage = 'Confirm fingerprint';
        }

        ReactNativeBiometrics.simplePrompt({ promptMessage: promptMessage })
            .then((resultObject) => {
                const { success } = resultObject
            
                if (success) {

                    this.keychainLogin();

                } else {
                    
                    if( this._isMounted ) {
                        this.setState({ authFailedAttempts: this.state.authFailedAttempts + 1 });
                    }

                    this.setAuthMethod();

                }
            })
            .catch(() => {
                console.log('biometrics failed');
            })
    }

    grantAccess = () => {
        const code = this.state.code || this.state.fields.security.code.value;
        if( this._isMounted ) {
            this.setState({
                isAuthenticated: true,
                code: code,
                currentRouteName: null,
            });
        }
    }

    toggleAuth = () => {
        if( this._isMounted ) {
            this.setState({ isAuthenticated: !this.state.isAuthenticated });
        }
    };

    logout = () => {
        // NOTE: disable pusher phase 1
        RNPusherPushNotifications.clearAllState();
        this.resetAuth();
    }

    confirmWipeData = async => {

        Alert.alert(
            _i("Wipe Data"),
            _i("This will clear all of your saved settings on this device and then log you out. It will not affect your data stored on the server. Are you sure you want to proceed?"),
            [
                {
                    text: "Yes, Wipe Data",
                    onPress: () => this.wipeStoredData()
                },
                {
                    text: "Cancel",
                    style: "cancel"
                }
            ]
        );
    }

    /**
     * wipes all stored flags
     * this is only available to developers and testers
     * @returns
     */
    wipeStoredData = async () => {

        const storedPasscodeKey = await EncryptedStorage.getItem(CONFIG.storage.key.storedPasscodeKey);
        if( storedPasscodeKey ) await EncryptedStorage.removeItem(CONFIG.storage.key.storedPasscodeKey);

        const storedMemorableWordKey = await EncryptedStorage.getItem(CONFIG.storage.key.storedMemorableWordKey);
        if( storedMemorableWordKey ) await EncryptedStorage.removeItem(CONFIG.storage.key.storedMemorableWordKey);

        const stored2FACodeKey = await EncryptedStorage.getItem(CONFIG.storage.key.stored2FACodeKey);
        if( stored2FACodeKey ) await EncryptedStorage.removeItem(CONFIG.storage.key.stored2FACodeKey);

        const storedAccessTokenKey = await EncryptedStorage.getItem(CONFIG.storage.key.storedAccessTokenKey);
        if( storedAccessTokenKey ) await EncryptedStorage.removeItem(CONFIG.storage.key.storedAccessTokenKey);

        const storedPhoenixCsrfTokenKey = EncryptedStorage.getItem(CONFIG.storage.key.storedPhoenixCsrfTokenKey);
        if( storedPhoenixCsrfTokenKey ) await EncryptedStorage.removeItem(CONFIG.storage.key.storedPhoenixCsrfTokenKey);


        await AsyncStorage.removeItem(CONFIG.storage.key.storedBiometricKey);
        await AsyncStorage.removeItem(CONFIG.storage.key.storedPhoenixAssetPathKey);
        await AsyncStorage.removeItem(CONFIG.storage.key.errorLoggingEnabled);
        await AsyncStorage.removeItem(CONFIG.storage.key.errorLogs);
        await AsyncStorage.removeItem(CONFIG.storage.key.applePaySkippedKey);
        await Keychain.resetGenericPassword();
        
        await this.clearPusherState();

        if( this._isMounted ) {
            this.setState({
                isAuthenticated: false,
                code: null,
                accessToken: null,
                isAuthenticated: false,
                authPreference: null,
                authMethod: null,
            });
        }
    }

    /**
     * reset auth state
     * used when for example the users' 2FA code has changed because they logged in elsewhere
     */
    resetAuth = async () => {
        
        try {
            const stored2FACodeKey = await EncryptedStorage.getItem(CONFIG.storage.key.stored2FACodeKey);
            if( stored2FACodeKey ) await EncryptedStorage.removeItem(CONFIG.storage.key.stored2FACodeKey);
        } catch( error ) {
            logError( 'failed to remove stored 2FA key', 'AucthContext->resetAuth', error );
        }

        try {
            const storedAccessTokenKey = EncryptedStorage.getItem(CONFIG.storage.key.storedAccessTokenKey);
            if( storedAccessTokenKey ) await EncryptedStorage.removeItem(CONFIG.storage.key.storedAccessTokenKey);
        } catch( error ) {
            logError( 'failed to remove stored access token key', 'AucthContext->resetAuth', error );
        }

        try {
            const storedPhoenixCsrfTokenKey = await EncryptedStorage.getItem(CONFIG.storage.key.storedPhoenixCsrfTokenKey);
            if( storedPhoenixCsrfTokenKey ) await EncryptedStorage.removeItem(CONFIG.storage.key.storedPhoenixCsrfTokenKey);
        } catch( error ) {
            logError( 'failed to remove stored phoenix csrf key', 'AucthContext->resetAuth', error );
        }

        try {
            await Keychain.resetGenericPassword();
        } catch( error ) {
            logError( 'failed to reset keychain', 'AucthContext->resetAuth', error );
        }

        if( this._isMounted ) {
            this.setState({
                isAuthenticated: false,
                code: null,
                accessToken: null,
                authPreference: null,
                authMethod: null,
                authModalActive: false
            });
        }

        this.getAuthPreference();

    }

    /**
     * setup the challenge for 3DS payment
     */
    setupChallenge = async () => {
        const challengeMethod = await this.getChallengeMethod();
        if( this._isMounted ) {
            await this.setState({ challengeMethod });
        }
    }

    useKnowledgeChallenge = async () => {
        if( this._isMounted ) {
            this.setState({
                challengeMethod: {
                    type: 'passcode',
                    buttonLabel: _i('Submit Passcode'),
                    body: _i('Enter your passcode to authorise transaction'),
                    icon: null,
                }
            });
        }
    }

    challengeSuccess = async type => {

    }

    challengeFail = async type => {
        if( this._isMounted ) {
            this.setState({ has3DSChallenge: false });
        }
    }

    setChallenge = async ( challengeId, amountMinor, currency ) => {

        if( !challengeId && this._isMounted ) {
            this.setState({
                challengeError: true,
                challengeErrorMessage: _i('There has been an error processing your request.'),
                has3DSChallenge: false,
            });
            Alert.alert( _i('Sorry'), _i('There has been an error processing your request.') );
            return;
        }

        const challengeMethod = await this.getChallengeMethod();

        let valueString = amountMinor !== 0 ? ( amountMinor / 100 ) : 0;

        valueString = parseFloat( valueString ).toFixed(2);

        switch( currency ) {
            case 'EUR':
                valueString = valueString + '€';
                break;
            case 'GBP':
                valueString = '£' + valueString;
        }
        
        // TODO: Set the challenge ID from the payload. I've never seen the payload, no idea
        if( this._isMounted ) {
            await this.setState({
                challengeSuccess: false,
                challengeMethod: challengeMethod,
                challengeStep: 1,
                challengeFailedAttempts: 0,
                challengeError: false,
                challengeErrorMessage: null,
                has3DSChallenge: true,
                challengeId: challengeId,
                challengeValue: valueString,
                challengeUpdateComplete: false,
                challengeManuallyRejected: false
            });
        }

        return;

    }

    // setPusherUserId
    setPusherUserId = async userId => {

        try {
            // get the current user
            //const user = await this.getCurrentUser();
            // authenticate this user with pusher, returns a token that we then send back via the pusher SDK to establish the handshake
            const pusherTokenResponse = await AuthService.getPusherToken();
            // grab the token out of the response
            const token = _.get( pusherTokenResponse, 'token', null );
            // only proceed if we got a token
            if( !token ) {
                return;
            }

            // pusher will fall over if the id is not type string
            userId = typeof userId === 'string' ? userId : userId.toString();
   
            // Note that only Android devices will respond to success/error callbacks
            RNPusherPushNotifications.setUserId(
                userId,
                token,
                ( statusCode, response ) => {
                    console.error(statusCode, response);
                    console.warn( 'error setting pusher id - AuthContext->setPusherUserId', response );
                },
                () => {
                    console.log('setPusherUserId success');
                }
            );

        } catch( error ) {
            console.warn( 'Error while setting id for private push notifications - AuthContext->setPusherUserId', error );
        }
    };

    // Subscribe to an interest
    pusherSubscribe = async interest => {
        // NOTE: disable pusher phase 1
        //return;
        // Note that only Android devices will respond to success/error callbacks
        await RNPusherPushNotifications.subscribe(
            interest,
            ( statusCode, response ) => {
                console.error(statusCode, response);
            },
            () => {
                console.log('Successfuly subscribed to ' + interest);
            }
        );

        return;
    };

    /**
     * handle a push notification
     * @param {*} notification 
     */
    handleNotification = async notification => {

        await this.resetChallengeState();

        const data = Platform.OS === 'ios' ? notification?.userInfo?.data : notification?.data;

        let notification_types = [];

        if( data && data.notification_types && typeof data.notification_types === 'string' ) {
            notification_types = JSON.parse( data.notification_types );
        } else if( Array.isArray( data.notification_types ) ) {
            notification_types = data.notification_types;
        }

        // we must only trigger a challenge if this was a notifcation broadcast on the 3ds_challenge channel
        if( Array.isArray( notification_types ) && notification_types.includes('3ds_challenge') ) {
            //this.handleChallenge( data );
            this.getPendingChallenges();
        } else if( data?.interest === 'broadcast' && data?.title && data?.body ) {
            Alert.alert( data?.title, data?.body );
        }

    };

    handleChallenge = async data => {

        const unresolved = await this.isUnresolvedChallenge( data?.id );

        if( unresolved ) await this.setChallenge( data?.id, data?.amount_minor, data?.amount_currency );
        
    }

    /**
     * get past challenge ids
     * @returns
     */
    getChallegeHistory = async () => {
        const challengeHistoryRaw = await AsyncStorage.getItem( this.state.storedChallengeHistoryKey ) ?? null;

        if( !challengeHistoryRaw ) return [];

        const challengeHistory = JSON.parse( challengeHistoryRaw );

        let history = [],
            timeNow = Date.now();

        challengeHistory.forEach( challenge => {
            // check the challenge is correctly formed and is less than 10 minutes old
            // because we don't want old challenges hanging arround!
            if( !isNaN( challenge?.time ) && timeNow - challenge.time < 600000 ) history.push(challenge);
        });

        return history;
    }

    /**
     * verrifies that a supplied challenge id has never been processed before (i.e. via GET request and push notification )
     * @returns
     */
     isUnresolvedChallenge = async challengeId => {
        // if there is a problem an we don't have the challenge id to compare with, err on side of caution and allow this challenge
        if( !challengeId ) return true;

        const challengeHistory = await this.getChallegeHistory();
        // in case of error we'll errr on the side of caution and allow the challenge to go ahead
        if( !Array.isArray( challengeHistory ) ) return true;

        let isUnresolved = true;
        // look for matches in historic challenges
        challengeHistory.forEach( challenge => {
            if( challenge?.id == challengeId && challenge?.env == CONFIG.env.bridge ) isUnresolved = false;
        });

        return isUnresolved;
    }

    /**
     * initiates the communication between the app and pusher
     */
    initNotifications = async () => {

        // Set your app key and register for push
        await RNPusherPushNotifications.setInstanceId( CONFIG.pusherBeams.instanceId );

        // Init interests after registration
        RNPusherPushNotifications.on( 'registered', async () => {
            await this.pusherSubscribe( '3ds_challenge' );
            await this.pusherSubscribe( 'broadcast' );
        });

        // it's important to only try and clear the pusher state if there is one else android will fall over.
        const pusherInitKey = await this.getPusherInitKey();

        let user;

        try {
            // get the current user
            user = await this.getCurrentUser();
        } catch( error ) {
            logError( 'Failed to get current user', 'AuthContext->initNotifications', error );
        }

        // if this is a new user or differnt, we will need to clear pusher state
        if( pusherInitKey != user?.id ) {
            // only clear pusher state if there is one to clear (or android crashes)
            if( pusherInitKey ) {
                await this.clearPusherState();
                // Set your app key and register for push
                await RNPusherPushNotifications.setInstanceId( CONFIG.pusherBeams.instanceId );

                // Init interests after registration
                RNPusherPushNotifications.on( 'registered', async () => {
                    await this.pusherSubscribe( '3ds_challenge' );
                    await this.pusherSubscribe( 'broadcast' );
                });
            }
            // set user id
            if( user ) await this.setPusherUserId( user?.id );
        }

        if( user ) await this.setPusherInitKey( user?.id );
    
        RNPusherPushNotifications.on( 'notification', this.handleNotification );

        return;
    }

    setPusherInitKey = async userId => {

        if( !userId ) return;

        userId = userId || '1';
        userId = typeof userId === 'string' ? userId : userId.toString();
        return await AsyncStorage.setItem( CONFIG.storage.key.pusherInitiatedKey, userId );
    }

    getPusherInitKey = async () => {
        return await AsyncStorage.getItem( CONFIG.storage.key.pusherInitiatedKey );
    }

    removePusherInitKey = async () => {
        return await AsyncStorage.removeItem( CONFIG.storage.key.pusherInitiatedKey );
    }

    /*
     * reset the pusher state to prevent erros in testing multiple users on the same device.
     */
    clearPusherState = async () => {
        await RNPusherPushNotifications.clearAllState();
        await this.removePusherInitKey();
        return;
    }

    /**
     * get current user
     */
    getCurrentUser = () => {
        return new Promise(( resolve, reject ) => {
            AuthService.user()
                .then( data => {
                    this.setCurrentUser( data?.data );
                    resolve( data?.data );
                })
                .catch( error => {
                    reject( error );
                });
            });
    }

    /**
     * set the current user object in global state
     */
    setCurrentUser = user => {

        if( !user || !user?.id ) {
            console.warn('malformed or empty user object', user );
        }

        if( this._isMounted ) {
            this.setState({ user });
        }
    }

    /**
     * a 3DS challenge was handled
     */
     updateChallenge = ( method, success, manualReject = false ) => {

        method = method || 'BIOMETRIC';
        const successInt = success === true ? '1' : '0';
        let challengeError = false;

        if( this._isMounted ) {
            this.setState({ challengeUpdatePending: true });
        }

        MastercardService.challenge(
            this.state.challengeId,
            {
                // NOTE @GARETH - this is the structure of the data sent as it exists in royal bridge api. if camelot is different, update here.
                verification_method: method,
                is_successful: successInt
            })
            .then( data => {
                if( this._isMounted ) {
                    this.setState({ challengeSuccess: success });
                }
            })
            .catch( error => {

                challengeError = true;

                const alertHeading = this.state.challengeManuallyRejected ? _i('Transaction Rejected') : _i('Sorry');
                const alertBody = this.state.challengeManuallyRejected ? _i('The transaction was rejected and it will not be authorised') : _i('There has been an error processing your request.');

                if( this._isMounted ) {
                    this.setState({
                        challengeSuccess: false,
                        challengeError: true,
                        challengeErrorMessage: alertBody,
                    });
                }

                Alert.alert( alertHeading, alertBody );

            })
            .finally(() => {

                this.resetFields();

                this.setChallengeHistory( this.state.challengeId );

                if( this._isMounted ) {
                    this.setState({
                        challengeUpdateComplete: true,
                        challengeUpdatePending: false,
                        challengeStep: 1,
                        challengeId: null,
                        // if there is no challenge error, keep the has3DSChallenge as true because user will manually kill it
                        // if there is a challenge error, kill the 3DS challenge
                        has3DSChallenge: !challengeError,
                    });
                }
            });
    }

    /**
     * reset the challenge state
     */
    resetChallengeState = async () => {
        if( this._isMounted ) {
            await this.setState({
                challengeSuccess: false,
                challengeFailedAttempts: 0,
                challengeStep: 1,
                challengeError: false,
                challengeErrorMessage: '',
                challengeId: null,
                has3DSChallenge: false,
                challengeUpdatePending: false,
                challengeUpdateComplete: false,
                challengeManuallyRejected: false
            });
        }

        return;
    }

    bioVerifyChallenge = async () => {

        const method = await this.getBiometricSupported();
        let promptMessage = 'Start scan';

        if( method == 'FaceID' ) {
            promptMessage = 'Confirm face scan';
        } else if( method == 'TouchID' ) {
            promptMessage = 'Confirm fingerprint';
        }

        ReactNativeBiometrics.simplePrompt({ promptMessage: promptMessage })
            .then((resultObject) => {
                const { success } = resultObject
            
                if (success) {
                    this.updateChallenge( 'BIOMETRIC', true );
                } else {
                    this.biometricChallengeAttemptFailed();
                }
            })
            .catch(() => {
                this.biometricChallengeAttemptFailed();
            })
    }

    submitKnowldge = async () => {

        const passcode = await this.getPasscode();

        if( passcode != this.state.fields.challenge.passcode.value ) {
            // fail
            this.knowledgeChallengeAttemptFailed();
            return;
        }

        this.updateChallenge( 'KNOWLEDGE_QUESTION', true );
    }

    /**
     * user has rejected a challenge
     */
     rejectChallenge = async () => {
        if( this._isMounted ) {
            await this.setState({ challengeManuallyRejected: true });
        }
        this.updateChallenge( 'KNOWLEDGE_QUESTION', false, true );
    }

    knowledgeChallengeAttemptFailed = async () => {

        const fields = this.state.fields;

        fields.challenge.passcode.value = '';

        if( this._isMounted ) {
            await this.setState({
                fields: fields,
                challengeFailedAttempts: this.state.challengeFailedAttempts + 1,
            });
        }

        // if fails within tollerated limit we just show a passive 'incorrect' message and user can try again
        // if fails outside of tollerated limit we resolve the challenge with a 'failed knowledge' result
        this.state.challengeFailedAttempts >= this.state.challengeMaxAttempts ? this.updateChallenge( 'KNOWLEDGE_QUESTION', false ) : Alert.alert(_i('Incorrect'), _i('The passcode you entered does not match'));

    }

    biometricChallengeAttemptFailed = async () => {

        if( this._isMounted ) {
            await this.setState({
                challengeFailedAttempts: this.state.challengeFailedAttempts + 1,
                allowBiometricRetry: true,
            });
        }

        if( this.state.challengeFailedAttempts >= this.state.challengeMaxAttempts ) this.updateChallenge( 'BIOMETRIC', false );

    }

    setChallengeStep = async step => {
        if( this._isMounted ) {
            await this.setState({ challengeStep: step || 1 });
        }
        return;
    }

    /**
     * update the challenge history
     * @param {*} challengeId 
     */
     setChallengeHistory = async challengeId => {
        // get the current history
        let history = await this.getChallegeHistory();
        // make sure we have an array
        history = Array.isArray(history) ? history : [];
        // create a history item
        let item = {
            time: Date.now(),
            id: challengeId,
            env: CONFIG.env.bridge
        };
        // add this history item
        history.push(item);
        // save
        await AsyncStorage.setItem( this.state.storedChallengeHistoryKey, JSON.stringify( history ) );

        return;
    }

    /**
     * reports the target app state following an app state change
     * - background | inactive | active
     * @param {str} nextAppState 
     */
     handleAppStateChange = nextAppState => {
        // only act if going to background - clear user session
        // this will also kill any ending pending challenges
        if( this.state.currentRouteName != 'login.security' && nextAppState == 'background' ) this.clearUserSession();
        
    }

    submitEmail2FA = () => {

        let payload = {
            confirmed_email: this.state.fields.forgotPasswordEmail.confirmEmail.value
        };

        return new Promise(( resolve, reject ) => {
            AuthService.postEmailVerification( payload )
                .then( data => {
                    resolve( data );
                })
                .catch( error => {
                    logError( 'failed to post to email verification (bridge Forgotten Password)', 'Auth Service->postEmailVerification', error );
                    reject( error );
                });
        });
    }

    submitCode2FA = () => {

        let payload = {
            verifiedEmail: this.state.fields.forgotPasswordEmail.confirmEmail.value,
            verifyCode: this.state.fields.forgotEmail2FA.verifyCode.value
        };

        return new Promise(( resolve, reject ) => {
            AuthService.post2FACode( payload )
                .then( data => {
                    resolve( data );
                })
                .catch( error => {
                    logError( 'failed to post to 2FA code (bridge Forgotten Password)', 'Auth Service->post2FACode', error );
                    reject( error );
                });
        });
    }

    submitNewPassword = (resetToken = null) => {

        let payload = {
            verifiedEmail: this.state.fields.forgotPasswordEmail.confirmEmail.value,
            requestResetToken: resetToken,
            newPassword: this.state.fields.changePassword.confirmPassword.value
        };

        return new Promise(( resolve, reject ) => {
            AuthService.postNewPassword( payload )
                .then( data => {
                    resolve( data );
                })
                .catch( error => {
                    logError( 'failed to post to 2FA code (bridge Forgotten Password)', 'Auth Service->post2FACode', error );
                    reject( error );
                });
        });
    }

    clearUserSession = async () => {
        // kill any pending challenge
        await this.resetChallengeState();
        // reset fields
        await this.resetFields();
        // log the user out
        if( this._isMounted ) {
            this.setState({
                user: null,
                isAuthenticated: false
            });
        }

        await EncryptedStorage.removeItem( CONFIG.storage.key.storedSSOKeyKey );
        await EncryptedStorage.removeItem( CONFIG.storage.key.storedAccessTokenKey );
    }

    setCurrentRouteName = async routeName => {
        return await this.setState({ currentRouteName: routeName });
    }

    componentDidMount() {
        this._isMounted = true;
        // watch app state to do various re-sets if the app goes to background
        this._appStateSubscription = AppState.addEventListener( 'change', this.handleAppStateChange );
    };

    componentWillUnmount() {
        this._isMounted = false;
        if( this._appStateSubscription ) this._appStateSubscription.remove();
    };

    render () {
        return (
            <AuthContext.Provider value={{
                ...this.state,
                toggleAuth: this.toggleAuth,
                getAuthPreference: this.getAuthPreference,
                setPasscode: this.setPasscode,
                getPasscode: this.getPasscode,
                setCredentials: this.setCredentials,
                setMemword: this.setMemword,
                getMemword: this.getMemword,
                setBiometric: this.setBiometric,
                getBiometricPreference: this.getBiometricPreference,
                setValue: this.setValue,
                manualLogin: this.manualLogin,
                renderFields: this.renderFields,
                grantAccess: this.grantAccess,
                requestSecurityCode: this.requestSecurityCode,
                submitSecurityCode: this.submitSecurityCode,
                bioAuthenticate: this.bioAuthenticate,
                passwordAuthenticate: this.passwordAuthenticate,
                verifyPasscode: this.verifyPasscode,
                enterPasscode: this.enterPasscode,
                resetPasscode: this.resetPasscode,
                confirmWipeData: this.confirmWipeData,
                getPhoenixMeta: this.getPhoenixMeta,
                passcodeMatches: this.passcodeMatches,
                setupChallenge: this.setupChallenge,
                generateMemwordChallenge: this.generateMemwordChallenge,
                enterMemword: this.enterMemword,
                useKnowledgeChallenge: this.useKnowledgeChallenge,
                resetMemword: this.resetMemword,
                logout: this.logout,
                challengeFail: this.challengeFail,
                wipeStoredData: this.wipeStoredData,
                isValid: this.isValid,
                compareFields: this.compareFields,
                updateChallenge: this.updateChallenge,
                resetChallengeState: this.resetChallengeState,
                bioVerifyChallenge: this.bioVerifyChallenge,
                rejectChallenge: this.rejectChallenge,
                submitKnowldge: this.submitKnowldge,
                setChallengeStep: this.setChallengeStep,
                getPendingChallenges: this.getPendingChallenges,
                getHas3DSChallenge: this.getHas3DSChallenge,
                setCurrentRouteName: this.setCurrentRouteName,
                submitEmail2FA: this.submitEmail2FA,
                submitCode2FA: this.submitCode2FA,
                submitNewPassword: this.submitNewPassword
            }}>
                {this.props.children}
            </AuthContext.Provider>
        )
    }
}

export default AuthContextProvider;
