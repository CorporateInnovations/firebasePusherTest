import React, { Component, createContext } from 'react';
// react native core - https://facebook.github.io/react-native/docs/getting-started.html
import { View } from 'react-native';
// https://github.com/emeraldsanto/react-native-encrypted-storage
import EncryptedStorage from 'react-native-encrypted-storage';
// https://react-native-async-storage.github.io/async-storage/docs/usage
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STYLES } from '../Styles';

import { _i } from '../Translations';
import { validate, validateField, logError } from '../Helpers';

import * as RegistrationService from '../services/registration';
import CONFIG from '../Config';
// components
import FormField from '../components/FormField';

export const RegistrationContext = createContext();

class RegistrationContextProvider extends Component {

    // mounted flag
    _isMounted = false;

    constructor( props ) {

        super(props);

        this.state = {
            regTest: 'reg test',
            // registration steps
            totalSteps: 5,
            // regTag from phoenix for the registration process
            regTag: null,
            fields: {
                identity: {
                    abtaNumber: {
                        active: true,
                        key: 'abtaNumber',
                        type: 'text',
                        value: '',
                        required: true,
                        pristine: true,
                        validation: [],
                        valid: false,
                        label: _i('ABTA Number'),
                        message: null,
                        messageColor: STYLES.colors.white,
                        labelColor: STYLES.colors.yellow.default,
                        inputColor: STYLES.colors.white,
                        borderColor: STYLES.colors.white,
                        borderStyle: 'full',
                        textContentType: null,
                        keyboardType: null,
                        autoCapitalize: 'none',
                        editable: true,
                    },
                    employeeId: {
                        active: false,
                        key: 'employeeId',
                        type: 'text',
                        value: '',
                        required: true,
                        pristine: true,
                        validation: [],
                        valid: false,
                        label: _i('Employee ID'),
                        message: null,
                        messageColor: STYLES.colors.white,
                        labelColor: STYLES.colors.yellow.default,
                        inputColor: STYLES.colors.white,
                        borderColor: STYLES.colors.white,
                        borderStyle: 'full',
                        textContentType: null,
                        keyboardType: null,
                        autoCapitalize: 'none',
                        editable: true,
                    },
                    email: {
                        active: true,
                        key: 'email',
                        type: 'text',
                        value: '',
                        required: true,
                        pristine: true,
                        validation: [],
                        valid: false,
                        label: _i('Work Email'),
                        labelColor: STYLES.colors.yellow.default,
                        message: _i('Needed to validate who you work for. Once verified you\'ll be able to create your account using an email address of your choice.'),
                        messageColor: STYLES.colors.white,
                        inputColor: STYLES.colors.white,
                        borderColor: STYLES.colors.white,
                        borderStyle: 'full',
                        textContentType: 'emailAddress',
                        keyboardType: 'email-address',
                        autoCapitalize: 'none',
                        editable: true,
                    }
                },
                account: {
                    firstName: {
                        active: true,
                        key: 'firstName',
                        type: 'text',
                        value: '',
                        required: true,
                        pristine: true,
                        validation: [],
                        valid: false,
                        label: _i('First Name'),
                        message: null,
                        messageColor: STYLES.colors.white,
                        labelColor: STYLES.colors.yellow.default,
                        inputColor: STYLES.colors.white,
                        borderColor: STYLES.colors.white,
                        borderStyle: 'full',
                        textContentType: 'givenName',
                        keyboardType: 'default',
                        autoCapitalize: 'words',
                        editable: true,
                    },
                    lastName: {
                        active: true,
                        key: 'lastName',
                        type: 'text',
                        value: '',
                        required: true,
                        pristine: true,
                        validation: [],
                        valid: false,
                        label: _i('Last Name'),
                        message: null,
                        messageColor: STYLES.colors.white,
                        labelColor: STYLES.colors.yellow.default,
                        inputColor: STYLES.colors.white,
                        borderColor: STYLES.colors.white,
                        borderStyle: 'full',
                        textContentType: 'familyName',
                        keyboardType: 'default',
                        autoCapitalize: 'words',
                        editable: true,
                    },
                    email: {
                        active: true,
                        key: 'email',
                        type: 'text',
                        value: '',
                        required: true,
                        pristine: true,
                        validation: [
                            {type: 'characters', value: 'email'},
                        ],
                        valid: false,
                        label: _i('Login/Individual Email'),
                        labelColor: STYLES.colors.yellow.default,
                        message: _i('This will also be used to send you marketing info if you consent. You can opt out any time.'),
                        messageColor: STYLES.colors.white,
                        inputColor: STYLES.colors.white,
                        borderColor: STYLES.colors.white,
                        borderStyle: 'full',
                        textContentType: 'emailAddress',
                        keyboardType: 'email-address',
                        autoCapitalize: 'none',
                        editable: true,
                    },
                    promoCode: {
                        active: true,
                        key: 'promoCode',
                        type: 'text',
                        value: '',
                        required: false,
                        pristine: true,
                        validation: [],
                        valid: false,
                        label: _i('Have a promo code?'),
                        message: null,
                        messageColor: STYLES.colors.white,
                        labelColor: STYLES.colors.yellow.default,
                        inputColor: STYLES.colors.white,
                        borderColor: STYLES.colors.white,
                        borderStyle: 'full',
                        textContentType: 'none',
                        keyboardType: 'default',
                        autoCapitalize: 'none',
                        editable: true,
                    },
                },
                postcodeSearch: {
                    postcode: {
                        active: true,
                        key: 'postcode',
                        type: 'text',
                        value: '',
                        required: true,
                        pristine: true,
                        validation: [],
                        valid: false,
                        label: _i('Postcode'),
                        message: null,
                        messageColor: STYLES.colors.white,
                        labelColor: STYLES.colors.yellow.default,
                        inputColor: STYLES.colors.white,
                        borderColor: STYLES.colors.white,
                        borderStyle: 'full',
                        textContentType: 'postalCode',
                        keyboardType: 'default',
                        autoCapitalize: 'none',
                        editable: true,
                    },
                },
                profile: {
                    addressLine1: {
                        active: true,
                        key: 'addressLine1',
                        type: 'text',
                        value: '',
                        required: true,
                        pristine: true,
                        validation: [],
                        valid: false,
                        label: _i('Address Line 1'),
                        message: null,
                        messageColor: STYLES.colors.white,
                        labelColor: STYLES.colors.yellow.default,
                        inputColor: STYLES.colors.white,
                        borderColor: STYLES.colors.white,
                        borderStyle: 'full',
                        textContentType: 'streetAddressLine1',
                        keyboardType: 'default',
                        autoCapitalize: 'words',
                        editable: true,
                    },
                    addressLine2: {
                        active: true,
                        key: 'addressLine2',
                        type: 'text',
                        value: '',
                        required: false,
                        pristine: true,
                        validation: [],
                        valid: false,
                        label: _i('Address Line 2'),
                        message: null,
                        messageColor: STYLES.colors.white,
                        labelColor: STYLES.colors.yellow.default,
                        inputColor: STYLES.colors.white,
                        borderColor: STYLES.colors.white,
                        borderStyle: 'full',
                        textContentType: 'streetAddressLine2',
                        keyboardType: 'default',
                        autoCapitalize: 'words',
                        editable: true,
                    },
                    addressLine3: {
                        active: true,
                        key: 'addressLine3',
                        type: 'text',
                        value: '',
                        required: false,
                        pristine: true,
                        validation: [],
                        valid: false,
                        label: _i('Address Line 3'),
                        message: null,
                        messageColor: STYLES.colors.white,
                        labelColor: STYLES.colors.yellow.default,
                        inputColor: STYLES.colors.white,
                        borderColor: STYLES.colors.white,
                        borderStyle: 'full',
                        textContentType: 'streetAddressLine2',
                        keyboardType: 'default',
                        autoCapitalize: 'words',
                        editable: true,
                    },
                    town: {
                        active: true,
                        key: 'town',
                        type: 'text',
                        value: '',
                        required: true,
                        pristine: true,
                        validation: [],
                        valid: false,
                        label: _i('Town'),
                        message: null,
                        messageColor: STYLES.colors.white,
                        labelColor: STYLES.colors.yellow.default,
                        inputColor: STYLES.colors.white,
                        borderColor: STYLES.colors.white,
                        borderStyle: 'full',
                        textContentType: 'addressCity',
                        keyboardType: 'default',
                        autoCapitalize: 'words',
                        editable: true,
                    },
                    county: {
                        active: true,
                        key: 'county',
                        type: 'text',
                        value: '',
                        required: true,
                        pristine: true,
                        validation: [],
                        valid: false,
                        label: _i('County'),
                        message: null,
                        messageColor: STYLES.colors.white,
                        labelColor: STYLES.colors.yellow.default,
                        inputColor: STYLES.colors.white,
                        borderColor: STYLES.colors.white,
                        borderStyle: 'full',
                        textContentType: 'addressState',
                        keyboardType: 'default',
                        autoCapitalize: 'words',
                        editable: true,
                    },
                    postcode: {
                        active: true,
                        key: 'postcode',
                        type: 'text',
                        value: '',
                        required: true,
                        pristine: true,
                        validation: [],
                        valid: false,
                        label: _i('Postcode'),
                        message: null,
                        messageColor: STYLES.colors.white,
                        labelColor: STYLES.colors.yellow.default,
                        inputColor: STYLES.colors.white,
                        borderColor: STYLES.colors.white,
                        borderStyle: 'full',
                        textContentType: 'postalCode',
                        keyboardType: 'default',
                        autoCapitalize: 'none',
                        editable: true,
                    },
                    country: {
                        active: true,
                        key: 'country',
                        type: 'select',
                        value: '',
                        options: [
                            { key: '1', label: 'United Kingdom', value: 'United Kingdom' },
                            { key: '2', label: 'Republic of Ireland', value: 'Ireland' },
                        ],
                        required: true,
                        pristine: true,
                        validation: [],
                        valid: false,
                        label: _i('Country'),
                        message: null,
                        messageColor: STYLES.colors.white,
                        labelColor: STYLES.colors.yellow.default,
                        inputColor: STYLES.colors.white,
                        borderColor: STYLES.colors.white,
                        borderStyle: 'full',
                        editable: true,
                    },
                    phone: {
                        active: true,
                        key: 'phone',
                        type: 'text',
                        value: '',
                        required: true,
                        pristine: true,
                        validation: [
                            {type: 'characters', value: 'telephone'},
                        ],
                        valid: false,
                        label: _i('Phone'),
                        message: null,
                        messageColor: STYLES.colors.white,
                        labelColor: STYLES.colors.yellow.default,
                        inputColor: STYLES.colors.white,
                        borderColor: STYLES.colors.white,
                        borderStyle: 'full',
                        textContentType: 'telephoneNumber',
                        keyboardType: 'phone-pad',
                        autoCapitalize: 'none',
                        editable: true,
                    },
                    countryPhoneCode: {
                        active: true,
                        key: 'countryPhoneCode',
                        type: 'select',
                        value: '',
                        options: [
                            { key: '1', label: '+44 (UK)', value: '+44' },
                            { key: '2', label: '+353 (ROI)', value: '+353' },
                        ],
                        required: true,
                        pristine: true,
                        validation: [],
                        valid: false,
                        label: _i('Phone Country Code'),
                        message: null,
                        messageColor: STYLES.colors.white,
                        labelColor: STYLES.colors.yellow.default,
                        inputColor: STYLES.colors.white,
                        borderColor: STYLES.colors.white,
                        borderStyle: 'full',
                        editable: true,
                    },
                    gender: {
                        active: true,
                        key: 'gender',
                        type: 'select',
                        value: '',
                        options: [
                            { key: '1', label: 'Female', value: 'female' },
                            { key: '2', label: 'Male', value: 'male' },
                            { key: '3', label: 'Unspecified', value: 'unspecified' },
                        ],
                        required: true,
                        pristine: true,
                        validation: [],
                        valid: false,
                        label: _i('Gender'),
                        message: null,
                        messageColor: STYLES.colors.white,
                        labelColor: STYLES.colors.yellow.default,
                        inputColor: STYLES.colors.white,
                        borderColor: STYLES.colors.white,
                        borderStyle: 'full',
                        editable: true,
                    },
                    workAddress: {
                        active: true,
                        key: 'workAddress',
                        type: 'select',
                        value: '',
                        options: [
                            { key: '1', label: 'Yes', value: 'yes' },
                            { key: '2', label: 'No', value: 'no' },
                        ],
                        required: true,
                        pristine: true,
                        validation: [],
                        valid: false,
                        label: _i('Is this your work address?'),
                        message: null,
                        messageColor: STYLES.colors.white,
                        labelColor: STYLES.colors.yellow.default,
                        inputColor: STYLES.colors.white,
                        borderColor: STYLES.colors.white,
                        borderStyle: 'full',
                        editable: true,
                    },
                },
                marketing: {
                    marketingEmail: {
                        active: true,
                        key: 'marketingEmail',
                        type: 'checkbox',
                        value: false,
                        required: false,
                        pristine: true,
                        validation: [],
                        valid: false,
                        label: _i('Email'),
                        message: null,
                        messageColor: STYLES.colors.white,
                        labelColor: STYLES.colors.white,
                        activeColor: STYLES.colors.yellow.default,
                        activeIconColor: STYLES.colors.white,
                        editable: true,
                    },
                    marketingSMS: {
                        active: true,
                        key: 'marketingSMS',
                        type: 'checkbox',
                        value: false,
                        required: false,
                        pristine: true,
                        validation: [],
                        valid: false,
                        label: _i('SMS'),
                        message: null,
                        messageColor: STYLES.colors.white,
                        labelColor: STYLES.colors.white,
                        activeColor: STYLES.colors.yellow.default,
                        activeIconColor: STYLES.colors.white,
                        editable: true,
                    },
                    marketingPost: {
                        active: true,
                        key: 'marketingPost',
                        type: 'checkbox',
                        value: false,
                        required: false,
                        pristine: true,
                        validation: [],
                        valid: false,
                        label: _i('Post'),
                        message: null,
                        messageColor: STYLES.colors.white,
                        labelColor: STYLES.colors.white,
                        activeColor: STYLES.colors.yellow.default,
                        activeIconColor: STYLES.colors.white,
                        editable: true,
                    },
                },
                setPassword: {
                    password: {
                        active: true,
                        key: 'password',
                        type: 'text',
                        value: '',
                        required: true,
                        pristine: true,
                        validation: [
                            {type: 'max-char', value: 100},
                            {type: 'min-char', value: 8},
                            {type: 'characters', value: 'password'},
                            {type: 'password', value: null},
                        ],
                        valid: false,
                        label: _i('Password'),
                        message: null,
                        messageColor: STYLES.colors.white,
                        labelColor: STYLES.colors.yellow.default,
                        inputColor: STYLES.colors.white,
                        borderColor: STYLES.colors.white,
                        borderStyle: 'full',
                        textContentType: 'password',
                        keyboardType: null,
                        autoCapitalize: 'none',
                        editable: true,
                        secureTextEntry: true,
                        maxLength: 500,
                    },
                    passwordConfirmation: {
                        active: true,
                        key: 'passwordConfirmation',
                        type: 'text',
                        value: '',
                        required: true,
                        pristine: true,
                        validation: [
                            {type: 'max-char', value: 100},
                            {type: 'min-char', value: 8},
                            {type: 'characters', value: 'password'},
                            {type: 'password', value: null},
                        ],
                        valid: false,
                        label: _i('Confirm Password'),
                        message: null,
                        messageColor: STYLES.colors.white,
                        labelColor: STYLES.colors.yellow.default,
                        inputColor: STYLES.colors.white,
                        borderColor: STYLES.colors.white,
                        borderStyle: 'full',
                        textContentType: 'password',
                        keyboardType: null,
                        autoCapitalize: 'none',
                        editable: true,
                        secureTextEntry: true,
                        maxLength: 500,
                    },
                }
            }
        };
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

    createAccount = () => {

        let payload = {
            inteletravel: this.state.isInteletravel ? 'yes' : 'no',
            work_email: this.state.fields.identity.email.value
        };

        payload.abta_number = this.state.isInteletravel ? '' : this.state.fields.identity.abtaNumber.value;
        payload.employee_id = this.state.isInteletravel ? this.state.fields.identity.employeeId.value : '';

        return new Promise(( resolve, reject ) => {
            RegistrationService.preVerify( payload )
                .then( data => {
                    resolve( data );
                })
                .catch( error => {
                    logError( 'failed to create account (phoenix pre-verify)', 'RegistrationContext->createAccount', error );
                    reject( error );
                });
        });

    };

    verify = async () => {

        let payload = {
            first_name: this.state.fields.account.firstName.value,
            last_name: this.state.fields.account.lastName.value,
            abta_number: this.state.fields.identity.abtaNumber.value,
            work_email: this.state.fields.identity.email.value,
            individual_email: this.state.fields.account.email.value,
            address_1: this.state.fields.profile.addressLine1.value,
            address_2: this.state.fields.profile.addressLine2.value,
            address_3: this.state.fields.profile.addressLine3.value,
            town: this.state.fields.profile.town.value,
            country: this.state.fields.profile.country.value,
            post_code: this.state.fields.profile.postcode.value,
            phone_number: this.state.fields.profile.phone.value,
            phone_option: this.state.fields.profile.countryPhoneCode.value,
            gender: this.state.fields.profile.gender.value,
            bookings: '',
            marketing: '',
            where_you_work: '',
            what_you_do: '',
            marketing_sms: this.state.fields.marketing.marketingSMS.value,
            marketing_email: this.state.fields.marketing.marketingEmail.value,
            marketing_post: this.state.fields.marketing.marketingPost.value,
            work_address: this.state.fields.profile.workAddress.value == 'yes' ? '1' : '0',
            promo_code_type: this.state.fields.account.promoCode.value,
        };

        return new Promise(( resolve, reject ) => {
            RegistrationService.verify( payload )
                .then( data => {
                    resolve( data );
                })
                .catch( error => {
                    logError( 'failed to create account (phoenix verify)', 'RegistrationContext->verify', error );
                    reject( error );
                });
        });

    };

    passwordsMatch = () => {

        let valid = true;

        if( !this.state.fields.setPassword.password.value || !this.state.fields.setPassword.passwordConfirmation.value ) {
            valid = false;
        }

        if( this.state.fields.setPassword.password.value !== this.state.fields.setPassword.passwordConfirmation.value ) {
            valid = false;
        }

        return valid;
    }

    activate = () => {

        // the service will append the tag property when it makes the api call - no need to include here
        let payload = {
            //username: this.state.fields.identity.email.value,
            password: this.state.fields.setPassword.password.value,
            password_confirmation: this.state.fields.setPassword.passwordConfirmation.value
        };

        return new Promise(( resolve, reject ) => {
            RegistrationService.activate( payload )
                .then( data => {
                    resolve( data );
                })
                .catch( error => {
                    logError( 'failed to activate account (phoenix activate)', 'RegistrationContext->activate', error );
                    reject( error );
                });
        });
    }

    agreeTerms = () => {

        return new Promise(( resolve, reject ) => {
            RegistrationService.agreeTerms()
                .then( data => {
                    resolve( data );
                })
                .catch( error => {
                    logError( 'failed to agree terms (phoenix issue)', 'RegistrationContext->agreeTerms', error );
                    reject( error );
                });
        });
    }

    /**
     * update account during the registration steps
     * @param {*} fieldSets 
     * @returns 
     */
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

    /**
     * toggle inteletravel fields in registration
     */
    toggleInteletravel = enabled => {
        
        let fields = this.state.fields;

        fields.identity.abtaNumber.active = !enabled;
        fields.identity.abtaNumber.value = '';

        fields.identity.employeeId.active = enabled;
        fields.identity.employeeId.value = '';
        
        if( this._isMounted ) {
            this.setState({
                fields: fields,
                isInteletravel: enabled
            });
        }
    }

    renderFields = fieldSetName => {

        const fieldsArray = Object.values( this.state.fields[fieldSetName] );

        return fieldsArray.map((item, index) => {

            if( !item.active ) {
                return(<View key={item.key}></View>);
            }

            return (
                <FormField
                    index={ fieldsArray.length - index }
                    key={item.key}
                    fieldKey={item.key}
                    fieldSetName={fieldSetName}
                    type={item.type}
                    options={item.options || null}
                    value={item.value}
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

    validateRegTag = async regTag => {

        try {
            const validation = await RegistrationService.validateRegTag( regTag );

            const fields = this.state.fields;

            fields.identity.email.value = validation.work_email;
            fields.identity.abtaNumber.value = validation.abta;

            this.setState({ fields });
            this.setRegTag( regTag );


        } catch( error ) {
            logError('Error while validating registtration tag', 'RegistrrationContext->validateRegTag', error );
        }
    }

    setRegTag = regTag => {

        try {
            if( this._isMounted ) {
                this.setState({ regTag });
            }
            EncryptedStorage.setItem( CONFIG.storage.key.storedRegTagKey, regTag );

        } catch( error ) {
            logError( 'failed to save phoenix registration tag', 'RegistrationContext->setRegTag', error );
        }
    }

    componentDidMount() {
        this._isMounted = true;
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    render () {
        return (
            <RegistrationContext.Provider
                value={{
                    ...this.state,
                    setValue: this.setValue,
                    createAccount: this.createAccount,
                    updateAccount: this.updateAccount,
                    isValid: this.isValid,
                    renderFields: this.renderFields,
                    toggleInteletravel: this.toggleInteletravel,
                    setRegTag: this.setRegTag,
                    validateRegTag: this.validateRegTag,
                    verify: this.verify,
                    agreeTerms: this.agreeTerms,
                    activate: this.activate,
                    passwordsMatch: this.passwordsMatch
                }}
            >
                {this.props.children}
            </RegistrationContext.Provider>
        )
    }
}

export default RegistrationContextProvider;