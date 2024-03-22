// core
import React, { Component, createContext } from 'react';
import { Alert, NativeModules, Platform } from 'react-native';
// https://github.com/emeraldsanto/react-native-encrypted-storage
import EncryptedStorage from 'react-native-encrypted-storage';
// https://react-native-async-storage.github.io/async-storage/docs/usage
import AsyncStorage from '@react-native-async-storage/async-storage';
// https://github.com/naoufal/react-native-touch-id
import TouchID from 'react-native-touch-id';
// https://www.npmjs.com/package/react-native-biometrics
import ReactNativeBiometrics from 'react-native-biometrics';

// services
import * as RegistrationService from '../services/registration';

// components
import FormField from '../components/FormField';

// helpers
import { _i } from '../Translations';
import { validate, validateField, logError } from '../Helpers';
import CONFIG from '../Config';

// styles
import { STYLES } from '../Styles';

export const OnboardingContext = createContext();

class OnboardingContextProvider extends Component {

    // mounted flag
    _isMounted = false;

    state = {
        storedPasscodeKey: CONFIG.storage.key.storedPasscodeKey,
        storedMemorableWordKey: CONFIG.storage.key.storedMemorableWordKey,
        storedBiometricKey: CONFIG.storage.key.storedBiometricKey,
        stored2FACodeKey: CONFIG.storage.key.stored2FACodeKey,
        applePaySkippedKey: CONFIG.storage.key.applePaySkippedKey,
        isOnboarded: false,
        biometricType: false,
        biometricLabel: '',
        biometricSupported: null,
        biometricEnabledFlag: null,
        biometricSupportedLabel: null,
    };

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

    updateAccount = fieldSets => {

        return new Promise(( resolve, reject ) => {
            RegistrationService.updateAccount({
                    foo: 'bar'
                })
                .then( data => {
                    resolve( data );
                })
                .catch( error => {
                    console.error( 'error', error );
                    reject( error );
                });
        });
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
                    message={item.message}
                    messageColor={item.messageColor}
                    borderColor={item.borderColor}
                    borderStyle={item.borderStyle}
                    inputColor={item.inputColor}
                    textContentType={item.textContentType}
                    keyboardType={item.keyboardType}
                    autoCapitalize={item.autoCapitalize}
                    editable={item.editable}
                    required={item.required}
                    activeColor={item.activeColor || null}
                    activeIconColor={item.activeIconColor || null}
                    updateValue={this.setValue}
                />
            );
        });

    }

    /**
     * get passcode value from encrypted storage
     * @returns passcode
     */
    getPasscode = async () => {
        //await EncryptedStorage.removeItem(this.state.storedPasscodeKey);
        return EncryptedStorage.getItem( this.state.storedPasscodeKey );
    }

    /**
     * check if we have a passcode
     * @returns {bool}
     */
    hasPasscode = async () => {
        const storedPasscode = await this.getPasscode();
        return storedPasscode ? true : false;
    }

    /**
     * get memorable word value from encrypted storage
     * @returns memorable word
     */
    getMemorableWord = async () => {
        return EncryptedStorage.getItem( this.state.storedMemorableWordKey );
    }

    /**
     * check if we have a memorable word
     * @returns {bool}
     */
    hasMemorableWord = async () => {
        const storedMemorableWord = await this.getMemorableWord();
        return storedMemorableWord ? true : false;
    }

    /**
     * get the biometric enabled flag from storage
     * @returns memorable word
     */
     getBiometricEnabledFlag = async () => {
        return AsyncStorage.getItem( this.state.storedBiometricKey );
    }

    /**
     * set the biometric enabled flag with the string of biometric type
     */
    setBiometricEnabled = async () => {
        const biometricType = await this.getBiometricSupported();

        if( biometricType ) {  
            if( this._isMounted ) { 
                this.setState({ biometricEnabledFlag: biometricType });
            }
            await AsyncStorage.setItem( this.state.storedBiometricKey, biometricType );
        }
    }

    /**
     * set the biometric enabled flag as "0"
     */
     setBiometricDisabled = async () => {
        if( this._isMounted ) {
            this.setState({ biometricEnabledFlag: "0" });
        }
        await AsyncStorage.setItem( this.state.storedBiometricKey, "0" );
     }

    setApplePaySkippedKey = async () => {
        await AsyncStorage.setItem( this.state.applePaySkippedKey, "1" );
    }

    getApplePaySkippedKey = async () => {
        return await AsyncStorage.getItem( this.state.applePaySkippedKey );
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
     * check if we have a memorable word
     * @returns {bool}
     */
     hasBiometricEnabledFlag = async () => {
        const storedBiometricEnabledFlag = await this.getBiometricEnabledFlag();
        // the stored value could be '0', but that still counts as having a value so '0' must return true in this method
        return typeof storedBiometricEnabledFlag === 'string' &&  storedBiometricEnabledFlag.length > 0 ? true : false;
    }

    /**
     * 
     * @returns 
     */
    getBiometricLabel = async () => {

        const biometricType = await this.getBiometricSupported();

        switch( biometricType ) {
            case 'FaceID':
                return 'Face ID';
            case 'TouchID':
                return 'Touch ID';
            default:
                return biometricType === true ? 'Biometric Verification' : ''
        }
    }

    /**
     * get the onboarding status of this device
     * 
     * basic premise here is we create an array of onboarding steps that the user has not yet completed.
     * we only want the user to have to do these on first login - so on the interface we take them through
     * all of these steps and set a value so next time, no steps are required.
     */
    getOnboardingStatus = async () => {
        // placeholder array for onboarding steps
        let steps = [];
        // has passcode set?
        const hasPasscode = await this.hasPasscode();
        const hasMemorableWord = await this.hasMemorableWord();
        const biometricSupported = await this.getBiometricSupported();
        const biometricEnabledFlag = await this.getBiometricEnabledFlag();
        const hasBiometricEnabledFlag = await this.hasBiometricEnabledFlag();
        const biometricLabel = await this.getBiometricLabel();
        const deviceSupportsWallet = await NativeModules.RNRCL.canAddPasses();
        const cardInWallet = await AsyncStorage.getItem( CONFIG.storage.key.cardInWallet );
        const applePaySkippedKey = await this.getApplePaySkippedKey();

        if( !hasPasscode ) {
            steps.push({ type: 'passcode', screen: 'onboarding.passcode' });
        }

        if( !hasMemorableWord ) {
            steps.push({ type: 'memword', screen: 'onboarding.memorable_word' });
        }

        if( biometricSupported && !hasBiometricEnabledFlag ) {
            steps.push({ type: 'biometric', screen: 'onboarding.enable_biometric' });
        }

        if( !applePaySkippedKey && Platform.OS === 'ios' && deviceSupportsWallet && !cardInWallet ) {
            steps.push({ type: 'wallet', screen: 'onboarding.apple_wallet' });
        }

        let biometricSupportedLabel;

        switch( biometricSupported ) {
            case 'TouchID':
                biometricSupportedLabel = 'Touch ID';
                break;
            case 'FaceID':
                biometricSupportedLabel = 'Face ID';
                break;
            default:
                biometricSupportedLabel = ( typeof biometricSupported === 'string' && biometricSupported.length > 0 ) ? 'Biometric' : null;
        }

        // set steps and biometric type
        if( this._isMounted ) {
            await this.setState({
                biometricType: biometricSupported,
                biometricLabel: biometricLabel,
                biometricSupported: biometricSupported,
                biometricEnabledFlag: biometricEnabledFlag,
                biometricSupportedLabel: biometricSupportedLabel,
                steps: steps
            });
        }

        // if there are no steps just set onboarding to complete and this will automatically trigger a re-route into the app
        if( this.state.steps.length === 0 ) {
            this.setOnboardingComplete();
        }

        // I want to make absolutely sure we're returning a valid value here
        // In the event of a malform error I'd rather the user skipped onboarding than the app fall over.
        return Array.isArray( this.state.steps ) ? this.state.steps : [];
    }

    setOnboardingComplete = () => {
        if( this._isMounted ) {
            this.setState({ isOnboarded: true });
        }
    }

    toggleOnboarded = () => {
        if( this._isMounted ) {
            this.setState({ isOnboarded: !this.state.isOnboarded });
        }
    };

    componentDidMount() {
        this._isMounted = true;
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    render () {
        return (
            <OnboardingContext.Provider
                value={{
                    ...this.state,
                    toggleOnboarded: this.toggleOnboarded,
                    setValue: this.setValue,
                    updateAccount: this.updateAccount,
                    renderFields: this.renderFields,
                    isValid: this.isValid,
                    getOnboardingStatus: this.getOnboardingStatus,
                    setBiometricEnabled: this.setBiometricEnabled,
                    setBiometricDisabled: this.setBiometricDisabled,
                    setApplePaySkippedKey: this.setApplePaySkippedKey,
                    getBiometricSupported: this.getBiometricSupported,
                    getBiometricEnabledFlag: this.getBiometricEnabledFlag,
                }}>
                {this.props.children}
            </OnboardingContext.Provider>
        )
    }
}

export default OnboardingContextProvider;