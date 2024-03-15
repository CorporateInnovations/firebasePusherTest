import React, { Component, createContext } from 'react';
// react native core - https://facebook.github.io/react-native/docs/getting-started.html
import { Alert } from 'react-native';
// https://github.com/emeraldsanto/react-native-encrypted-storage
import EncryptedStorage from 'react-native-encrypted-storage';
// https://react-native-async-storage.github.io/async-storage/docs/usage
import AsyncStorage from '@react-native-async-storage/async-storage';
// https://github.com/vivaxy/react-native-auto-height-image
import AutoHeightImage from 'react-native-auto-height-image';
// react native core - https://facebook.github.io/react-native/docs/getting-started.html
import { Dimensions } from 'react-native';
// https://www.npmjs.com/package/react-native-keychain
import * as Keychain from 'react-native-keychain';
// https://github.com/naoufal/react-native-touch-id
import TouchID from 'react-native-touch-id';
// https://github.com/meinto/react-native-event-listeners
import { EventRegister } from 'react-native-event-listeners';
// Google Analytics
// import firebase from '@react-native-firebase/app';
// import analytics from '@react-native-firebase/analytics'

// lodash
import { isArray, _ } from 'lodash';
// components
import FormField from '../components/FormField';
import AnimatedView from '../components/AnimatedView';
// styles
import { STYLES, VARS } from '../Styles';
// configs
import { _i } from '../Translations';
import { validate, validateField, formatDate, formatMoneyString, logError } from '../Helpers';
import CONFIG from '../Config';
// services
import * as UserService from '../services/user';
import * as RewardsService from '../services/rewards';
import * as MastercardService from '../services/mastercard';

export const UserContext = createContext();

const todayDate = new Date();
const sailingDateMin = new Date( todayDate.getTime() - ( 40 * 24 * 60 * 60 * 1000 ) );
const bookingDateMax = new Date( todayDate.getTime() - ( 1 * 24 * 60 * 60 * 1000 ) );

const DIMENSIONS = Dimensions.get('screen');

class UserContextProvider extends Component {

    // mounted flag
    _isMounted = false;

    state = {
        profile: null,
        accountData: null,
        mastercardError: null,
        rewardsTransfer: {
            // when true, the popup will show on relevant screens where the component is included
            active: false,
            // transfer in progress, awaiting response
            inProgress: false,
            // text updates to indicate status on UI
            outcomeHeading: null,
            outcomeBody: null,
            // modal actions
            actions: []
        },
        claimBooking: {
            // when true, the popup will show on relevant screens where the component is included
            active: false,
            // state to show ... null || 'form' || 'outcome'
            state: null,
            // submit in progress, awaiting response
            inProgress: false,
            // text updates to indicate status on UI
            outcomeHeading: null,
            outcomeBody: null,
            // modal actions
            actions: []
        },
        // the phoenix user object
        phoenixUser: null,

        fields: {
            claim: {
                bookingReference: {
                    active: true,
                    key: 'bookingReference',
                    type: 'text',
                    value: '',
                    required: true,
                    pristine: true,
                    validation: [
                        {type: 'max-char', value: 8},
                        {type: 'min-char', value: 4},
                        {type: 'characters', value: 'digits'},
                    ],
                    valid: false,
                    label: _i('Booking Reference'),
                    message: null,
                    messageColor: STYLES.colors.navy.default,
                    inputColor: STYLES.colors.navy.default,
                    borderColor: STYLES.colors.navy.default,
                    borderStyle: 'full',
                    textContentType: null,
                    keyboardType: null,
                    autoCapitalize: 'none',
                    editable: true,
                },
                bookingDate: {
                    active: true,
                    key: 'bookingDate',
                    type: 'date',
                    // DD-MM-YYYY
                    value: '',
                    required: true,
                    pristine: true,
                    validation: [],
                    valid: false,
                    label: _i('Booking Date'),
                    labelColor: STYLES.colors.navy.default,
                    message: '',
                    defaultMessage: _i('This is the BK Confirmed Booking Date NOT the Option date. Please allow 24 hours between making the booking and uploading to Club Royal.'),
                    messageColor: STYLES.colors.navy.default,
                    inputColor: STYLES.colors.navy.default,
                    borderColor: STYLES.colors.navy.default,
                    borderStyle: 'full',
                    textContentType: null,
                    keyboardType: null,
                    autoCapitalize: 'none',
                    editable: true,
                    maximumDate: bookingDateMax
                },
                sailingDate: {
                    active: true,
                    key: 'sailingDate',
                    type: 'date',
                    // DD-MM-YYYY
                    value: '',
                    required: true,
                    pristine: true,
                    validation: [],
                    valid: false,
                    label: _i('Sailing Date'),
                    labelColor: STYLES.colors.navy.default,
                    message: null,
                    messageColor: STYLES.colors.navy.default,
                    inputColor: STYLES.colors.navy.default,
                    borderColor: STYLES.colors.navy.default,
                    borderStyle: 'full',
                    textContentType: null,
                    keyboardType: null,
                    autoCapitalize: 'none',
                    editable: true,
                    minimumDate: sailingDateMin,
                }
            },
            profile: {
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
                    messageColor: STYLES.colors.navy.default,
                    labelColor: STYLES.colors.navy.default,
                    inputColor: STYLES.colors.navy.default,
                    borderColor: STYLES.colors.navy.default,
                    borderStyle: 'full',
                    textContentType: 'givenName',
                    keyboardType: 'default',
                    autoCapitalize: 'words',
                    editable: false,
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
                    messageColor: STYLES.colors.navy.default,
                    labelColor: STYLES.colors.navy.default,
                    inputColor: STYLES.colors.navy.default,
                    borderColor: STYLES.colors.navy.default,
                    borderStyle: 'full',
                    textContentType: 'familyName',
                    keyboardType: 'default',
                    autoCapitalize: 'words',
                    editable: false,
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
                    messageColor: STYLES.colors.navy.default,
                    inputColor: STYLES.colors.navy.default,
                    borderColor: STYLES.colors.navy.default,
                    borderStyle: 'full',
                    textContentType: 'emailAddress',
                    keyboardType: 'email-address',
                    autoCapitalize: 'none',
                    editable: false,
                },
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
                    messageColor: STYLES.colors.navy.default,
                    labelColor: STYLES.colors.navy.default,
                    inputColor: STYLES.colors.navy.default,
                    borderColor: STYLES.colors.navy.default,
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
                    messageColor: STYLES.colors.navy.default,
                    labelColor: STYLES.colors.navy.default,
                    inputColor: STYLES.colors.navy.default,
                    borderColor: STYLES.colors.navy.default,
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
                    messageColor: STYLES.colors.navy.default,
                    labelColor: STYLES.colors.navy.default,
                    inputColor: STYLES.colors.navy.default,
                    borderColor: STYLES.colors.navy.default,
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
                    messageColor: STYLES.colors.navy.default,
                    labelColor: STYLES.colors.navy.default,
                    inputColor: STYLES.colors.navy.default,
                    borderColor: STYLES.colors.navy.default,
                    borderStyle: 'full',
                    textContentType: 'addressCity',
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
                    messageColor: STYLES.colors.navy.default,
                    labelColor: STYLES.colors.navy.default,
                    inputColor: STYLES.colors.navy.default,
                    borderColor: STYLES.colors.navy.default,
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
                    messageColor: STYLES.colors.navy.default,
                    labelColor: STYLES.colors.navy.default,
                    inputColor: STYLES.colors.navy.default,
                    borderColor: STYLES.colors.navy.default,
                    borderStyle: 'full',
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
                    messageColor: STYLES.colors.navy.default,
                    labelColor: STYLES.colors.navy.default,
                    inputColor: STYLES.colors.navy.default,
                    borderColor: STYLES.colors.navy.default,
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
                    messageColor: STYLES.colors.navy.default,
                    labelColor: STYLES.colors.navy.default,
                    inputColor: STYLES.colors.navy.default,
                    borderColor: STYLES.colors.navy.default,
                    borderStyle: 'full',
                    textContentType: 'telephoneNumber',
                    keyboardType: 'phone-pad',
                    autoCapitalize: 'none',
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
                    messageColor: STYLES.colors.navy.default,
                    labelColor: STYLES.colors.navy.default,
                    inputColor: STYLES.colors.navy.default,
                    borderColor: STYLES.colors.navy.default,
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
                    messageColor: STYLES.colors.navy.default,
                    labelColor: STYLES.colors.navy.default,
                    inputColor: STYLES.colors.navy.default,
                    borderColor: STYLES.colors.navy.default,
                    borderStyle: 'full',
                    editable: true,
                },
                whatYouDo: {
                    active: true,
                    key: 'whatYouDo',
                    type: 'select',
                    value: '',
                    options: [
                        { key: '1', label: 'Retail', value: 'Retail/Multiple' },
                        { key: '2', label: 'Other', value: 'Other' },
                    ],
                    required: true,
                    pristine: true,
                    validation: [],
                    valid: false,
                    label: _i('What do you do?'),
                    message: null,
                    messageColor: STYLES.colors.navy.default,
                    labelColor: STYLES.colors.navy.default,
                    inputColor: STYLES.colors.navy.default,
                    borderColor: STYLES.colors.navy.default,
                    borderStyle: 'full',
                    editable: true,
                },
                whereYouWork: {
                    active: true,
                    key: 'whereYouWork',
                    type: 'select',
                    value: '',
                    options: [
                        { key: '1', label: 'Head Office', value: 'Head Office - Management' },
                        { key: '2', label: 'Other', value: 'Other' },
                    ],
                    required: true,
                    pristine: true,
                    validation: [],
                    valid: false,
                    label: _i('Where do you work?'),
                    message: null,
                    messageColor: STYLES.colors.navy.default,
                    labelColor: STYLES.colors.navy.default,
                    inputColor: STYLES.colors.navy.default,
                    borderColor: STYLES.colors.navy.default,
                    borderStyle: 'full',
                    editable: true,
                },
                bookings: {
                    active: true,
                    key: 'bookings',
                    type: 'checkbox',
                    value: false,
                    required: false,
                    pristine: true,
                    validation: [],
                    valid: false,
                    label: _i('Do you make bookings?'),
                    message: null,
                    messageColor: STYLES.colors.navy.default,
                    labelColor: STYLES.colors.navy.default,
                    activeColor: STYLES.colors.yellow.default,
                    activeIconColor: STYLES.colors.white,
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
                    messageColor: STYLES.colors.navy.default,
                    labelColor: STYLES.colors.navy.default,
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
                    messageColor: STYLES.colors.navy.default,
                    labelColor: STYLES.colors.navy.default,
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
                    messageColor: STYLES.colors.navy.default,
                    labelColor: STYLES.colors.navy.default,
                    activeColor: STYLES.colors.yellow.default,
                    activeIconColor: STYLES.colors.white,
                    editable: true,
                },
            },
        },
        // rewards
        rewardsHistoryFetched: false,
        rewardsHistoryLoading: false,
        rewardsHistoryItems: [],
        // Mastercard
        mastercardImageLoading: false,
        mastercardImage: null,
        mastercardVisibleSideLabel: 'front',
        mastercardHiddenSideLabel: 'back',
        cardholderRef: null,
        customerCode: null,
        mastercardBalanceAvailable: null,
        mastercardBalanceCleared: null,
        mastercardTransactionsFetched: false,
        mastercardTransactionsLoading: false,
        mastercardTransactionsItems: [],
        // ballots
        ballotsFetched: false,
        ballots: [],
        // user ballots that they are entered into
        userBallots: [],
        // top offers
        topOffersLoaded: false,
        gbp_offers: [],
        eur_offers: [],
        yourJourneyLoaded: false,
        accredidationLoaded: false
    };

    setClaimBooking = ( active, inProgress, state, outcomeHeading, outcomeBody, actions ) => {

        let claimBooking = {
            active: active || false,
            state: state || null,
            inProgress: inProgress || false,
            outcomeHeading: outcomeHeading || null,
            outcomeBody: outcomeBody || null,
            actions: actions || []
        }

        if( this._isMounted ) {
            this.setState({ claimBooking });
        }
    }

    resetClaimFields = () => {

        const fields = this.state.fields

        fields.claim.bookingReference.value = ''
        fields.claim.bookingReference.pristine = true
        fields.claim.bookingReference.valid = false

        fields.claim.bookingDate.value = ''
        fields.claim.bookingDate.pristine = true
        fields.claim.bookingDate.valid = false

        fields.claim.sailingDate.value = ''
        fields.claim.sailingDate.pristine = true
        fields.claim.sailingDate.valid = false

        if( this._isMounted ) this.setState({fields})

    }

    /**
     * alias for closing down the claim booking modal and returning to default state
     */
     dismissClaimBookingModal = () => {
        this.setClaimBooking();
        this.resetClaimFields()
    }

    setRewardsTransfer = ( active, inProgress, outcomeHeading, outcomeBody, actions ) => {

        let rewardsTransfer = {
            active: active || false,
            inProgress: inProgress || false,
            outcomeHeading: outcomeHeading || null,
            outcomeBody: outcomeBody || null,
            actions: actions || []
        }
        if( this._isMounted ) {
            this.setState({ rewardsTransfer });
        }
    }

    /**
     * sets a basic dismissable message for the rewards balance transfer
     * if you have more complex requirements then use setRewardsTransfer()
     * @param {*} heading
     * @param {*} message
     */
    setTransferBasicMessage = ( heading, message ) => {
        this.setRewardsTransfer(true,true,heading,message,[{ key: '1', label: _i('Back'), color: STYLES.colors.gray.light, onPressEvent: this.dismissTransferModal }]);
    }

    /**
     * alias for closing down the transfer modal and returning to default state
     */
    dismissTransferModal = () => {
        this.setRewardsTransfer();
    }

    getProfile = async () => {

        try {
            const profile = await UserService.getProfile();
            console.log('profile', JSON.stringify(profile, null, 2));

            if( this._isMounted ) {
                await this.setState({ profile });
            }
            return true;
        } catch( error ) {
            console.warn( 'getrpfile error', error );
            return false;
        }
    }

    getPhoenixUser = async () => {

        try {

            const phoenixUser = await UserService.getPhoenixUser();

            const fields = this.state.fields;

            fields.profile.firstName.value = _.get( phoenixUser, 'user.first_name', null );
            fields.profile.lastName.value = _.get( phoenixUser, 'user.last_name', null );
            fields.profile.email.value = _.get( phoenixUser, 'user.email', null );
            fields.profile.addressLine1.value = _.get( phoenixUser, 'user.registration.field3', null );
            fields.profile.addressLine2.value = _.get( phoenixUser, 'user.registration.field4', null );
            fields.profile.addressLine3.value = _.get( phoenixUser, 'user.registration.field5', null );
            fields.profile.bookings.value = _.get( phoenixUser, 'user.registration.field19', null );
            fields.profile.town.value = _.get( phoenixUser, 'user.registration.field6', null );
            fields.profile.postcode.value = _.get( phoenixUser, 'user.registration.field7', null );
            fields.profile.country.value = _.get( phoenixUser, 'user.registration.field8', null );
            fields.profile.countryPhoneCode.value = _.get( phoenixUser, 'user.registration.field20', null );
            fields.profile.phone.value = _.get( phoenixUser, 'user.registration.field9', null );
            fields.profile.gender.value = _.get( phoenixUser, 'user.registration.field13', null );
            fields.profile.whatYouDo.value = _.get( phoenixUser, 'user.registration.field26', null );
            fields.profile.whereYouWork.value = _.get( phoenixUser, 'user.registration.field27', null );
            fields.profile.gender.value = _.get( phoenixUser, 'user.registration.field13', null );

            const workAddress = _.get( phoenixUser, 'user.registration.field21', null );
            fields.profile.workAddress.value = workAddress == '1' ? 'yes' : 'no';

            const marketingEmail = _.get( phoenixUser, 'user.registration.marketing_email', false );
            fields.marketing.marketingEmail.value = marketingEmail == 1;

            const marketingSMS = _.get( phoenixUser, 'user.registration.marketing_sms', false );
            fields.marketing.marketingSMS.value = marketingSMS == 1;

            const marketingPost = _.get( phoenixUser, 'user.registration.marketing_post', false );
            fields.marketing.marketingPost.value = marketingPost == 1;

            if( this._isMounted ) {
                this.setState({ fields, phoenixUser });
            }

        } catch( error ) {
            logError( 'Failed to get the phoenix user data', 'UserContext->getPhoenixUser', error );
        }

    }

    updateMarketing = async ( field, value ) => {

        try {
            const fields = this.state.fields;
            fields.marketing[field].value = value;
            if( this._isMounted ) {
                await this.setState({ fields });
            }
            await this.updateProfile();
            return true;
        } catch(error) {
            logError('Failed to update marketing preferences', 'UserContext->updateMarketing', error);
        }
    }

    updateProfile = async () => {

        /*
        address_1: "10 downing street"
        address_2: null
        address_3: null
        bookings: "1"
        country: "Republic of Ireland"
        email: "benleahdesign+test-2911-3@gmail.com"
        gender: "female"
        marketing_email: false
        marketing_post: false
        marketing_sms: false
        phone_number: "07799260905"
        phone_option: "+44"
        postcode: "SW1A1AA"
        town: "westminster"
        what_you_do: "Other"
        where_you_work: "Home worker"
        work_address: "1"
        */

        // field10 - abta
        // field2 - cmpany name

        let payload = {
            // field3
            address_1: this.state.fields.profile.addressLine1.value,
            // field4
            address_2: this.state.fields.profile.addressLine2.value,
            // field5
            address_3: this.state.fields.profile.addressLine3.value,
            // field8
            country: this.state.fields.profile.country.value,
            // field19
            bookings: this.state.fields.profile.bookings.value ? '1' : '0',
            // response.user.email
            email: this.state.fields.profile.email.value,
            // field13
            gender: this.state.fields.profile.gender.value,
            // response.registration.marketing_email
            marketing_email: this.state.fields.marketing.marketingEmail.value,
            // response.registration.marketing_post
            marketing_post: this.state.fields.marketing.marketingPost.value,
            // response.registration.marketing_post
            marketing_sms: this.state.fields.marketing.marketingSMS.value,
            // field9
            phone_number: this.state.fields.profile.phone.value,
            // field20
            phone_option: this.state.fields.profile.countryPhoneCode.value,
            // field7
            postcode: this.state.fields.profile.postcode.value,
            // field5
            town: this.state.fields.profile.town.value,
            // field26
            what_you_do: this.state.fields.profile.whatYouDo.value,
            // field27
            where_you_work: this.state.fields.profile.whereYouWork.value,
            // field21
            work_address: this.state.fields.profile.workAddress == 'yes' ? '1' : '0',
        };

        return new Promise(( resolve, reject ) => {
            UserService.updateProfile( payload )
                .then( data => {
                    resolve( data );
                })
                .catch( error => {
                    logError( 'failed to update profile (phoenix verify)', 'UserContext->updateProfile', error );
                    reject( error );
                });
        });

    };

    updateProfileImage = async imageBase64 => {

        return new Promise(( resolve, reject ) => {
            UserService.updateProfileImage({ imageData: imageBase64 })
                .then( data => {

                    if( data && data.status === 'success' ) {
                        resolve( data );
                    } else {
                        reject( data );
                    }

                })
                .catch( error => {
                    logError( 'failed to update profile image (phoenix verify)', 'UserContext->updateProfileImage', error );
                    reject( error );
                });
        });
    }

    transferRewardsBalance = async () => {

        this.setRewardsTransfer( true, true, _i('Transfer in Progress'), _i('Please wait while we send your rewards balance to your Mastercard'), [] );

        RewardsService.transfer()
            .then(data => {
                // as soon as we know the transfer has succeeded, re-fetch the user profile data to update the displayed rewards balance
                this.getProfile();
                // update the modal state to reflext success
                this.setTransferBasicMessage( _i('Transfer Complete'), _i('Your available rewards balance has been transferred to your Mastercard') );
            })
            .catch(error => {
                const error_message = _.get( error, 'message', _i('Don\'t worry,  your rewards have not been lost! Please try again later, if you continue to see this message please contact Customer Services')  )
                this.setTransferBasicMessage( _i('Error'), error_message );
                logError( 'Transfer Balance Error', 'UserContext->transferRewardsBalance', error );
            });

    }

    submitClaimBooking = async () => {

        if( !this.isValid( ['claim'] ) ) {
            return;
        }

        this.setClaimBooking(
            true,
            true,
            'outcome',
            _i('Please Wait'),
            _i('We are processing your request'),
            []
        );

        // build the data
        let payload = {
            reference: this.state.fields.claim.bookingReference.value,
            booking: this.state.fields.claim.bookingDate.value,
            sailing: this.state.fields.claim.sailingDate.value,
            user_id: this.state.profile.id,
            api_key: CONFIG.security.phoenixAuthApiKey[CONFIG.env.phoenix],
            review: false,
        }

        console.log('claim payload,',payload);

        try {

            // TODO post the data
            const registerBooking = await RewardsService.registerBooking( payload );
            // await analytics().logEvent('booking_submission');
            if( registerBooking && registerBooking.hasOwnProperty('status') && registerBooking.status == 'error' ) {
                throw registerBooking.message || _i('phoenix error');
            }

        } catch( error ) {

            logError( 'Submit Booking Claim Error', 'UserContext->submitClaimBooking', error );

            this.setClaimBooking(
                true,
                true,
                'outcome',
                _i('Error'),
                ( typeof error === 'string' ? error : _i('If you feel the information you have provided is correct then you can request for this booking to be reviewed')),
                [
                    { key: '1', label: _i('Submit for Review'), color: STYLES.colors.navy.default, onPressEvent: this.submitReview },
                    { key: '2', label: _i('Close'), color: STYLES.colors.gray.light, onPressEvent: this.dismissClaimBookingModal }
                ]
            );

            return;
        }

        this.setClaimBooking(
            true,
            true,
            'outcome',
            _i('Success'),
            _i('Your claim has been submitted'),
            [
                { key: '1', label: _i('Done'), color: STYLES.colors.navy.default, onPressEvent: this.dismissClaimBookingModal }
            ]
        );

    }

    submitReview = async () => {

        if( !this.isValid( ['claim'] ) ) {
            return;
        }

        this.setClaimBooking(
            true,
            true,
            'outcome',
            _i('Please Wait'),
            _i('We are processing your request'),
            []
        );

        // build the data
        let payload = {
            reference: this.state.fields.claim.bookingReference.value,
            booking: this.state.fields.claim.bookingDate.value,
            sailing: this.state.fields.claim.sailingDate.value,
            user_id: this.state.profile.id,
            api_key: CONFIG.security.phoenixAuthApiKey[CONFIG.env.phoenix],
            review: true
        }

        try {

            // TODO post the data
            const registerBooking = await RewardsService.registerBooking( payload );

            if( registerBooking && registerBooking.hasOwnProperty('status') && registerBooking.status == 'error' ) {
                throw registerBooking.message || _i('phoenix error');
            }

        } catch( error ) {

            logError( 'Submit Booking Claim Review Error', 'UserContext->submitReview', error );

            this.setClaimBooking(
                true,
                true,
                'outcome',
                _i('Error'),
                typeof error === 'string' ? error : JSON.stringify(error),
                [
                    { key: '1', label: _i('Close'), color: STYLES.colors.navy.default, onPressEvent: this.dismissClaimBookingModal }
                ]
            );

            return;
        }

        this.setClaimBooking(
            true,
            true,
            'outcome',
            _i('Success'),
            _i('Your claim has been submitted for review'),
            [
                { key: '1', label: _i('Done'), color: STYLES.colors.navy.default, onPressEvent: this.dismissClaimBookingModal }
            ]
        );

    }

    claimBookingShow = async () => {

        this.setClaimBooking(
            true,
            true,
            'form',
            _i(''),
            _i(''),
            [
                { key: '1', label: _i('Submit'), color: STYLES.colors.navy.default, onPressEvent: this.submitClaimBooking },
                { key: '2', label: _i('Cancel'), color: STYLES.colors.gray.light, onPressEvent: this.dismissClaimBookingModal }
            ]
        );

    }

    getRewardsHistory = async page => {

        RewardsService.getRewards( page )
            .then( data => {
                if( this._isMounted ) {
                    this.setState({ rewardsHistoryItems: data });
                }
            })
            .catch( error => {
                logError( 'Get Reward History Error', 'UserContext->getRewardsHistory', error );
            })
            .finally(() => {
                if( this._isMounted ) {
                    this.setState({
                        rewardsHistoryFetched: true
                    });
                }
            });
    }

    getBallots = async () => {

        RewardsService.getBallots()
            .then( data => {
                if( this._isMounted ) {
                    this.setState({ ballots: data });
                }
            })
            .catch( error => {
                logError( 'Get Ballots Error - phoenix', 'UserContext->getBallots', error );
            })
            .finally(() => {
                if( this._isMounted ) {
                    this.setState({
                        ballotsFetched: true
                    });
                }
            });
    }

    getUserBallots = async () => {

        RewardsService.getUserBallots()
            .then( data => {
                if( this._isMounted ) {
                    this.setState({ userBallots: data });
                }
            })
            .catch( error => {
                logError( 'Get User Ballots Error - phoenix', 'UserContext->getUserBallots', error );
            });
    }

    enterBallot = async id => {
        return new Promise(( resolve, reject ) => {
            RewardsService.enterBallot(id)
                .then( data => {
                    resolve( data );
                })
                .catch( error => {
                    logError( 'Enter Ballot Error - phoenix', 'UserContext->enterBallot', error );
                    reject( error );
                })
                .finally(() => {
                    // re-fetch the user ballots
                    this.getUserBallots();
                });
        });

    }

    getIsExistingBallotEntry = ballot_id => {

        const existingBallot = _.find( this.state.userBallots, { id: ballot_id } );

        return existingBallot ? true : false;
    }

    getMastercardTransactions = async page => {

        MastercardService.transactions( page )
            .then( data => {
                if( this._isMounted ) {
                    this.setState({ mastercardTransactionsItems: data });
                }
            })
            .catch( error => {
                logError( 'Get Mastercard transaction list error', 'UserContext->getMastercardTransactions', error );
            })
            .finally(() => {
                if( this._isMounted ) {
                    this.setState({
                        mastercardTransactionsFetched: true
                    });
                }
            });
    }

    renderFields = fieldSetName => {

        const fieldsArray = Object.values( this.state.fields[fieldSetName] );

        return fieldsArray.map((item, index) => {

            return (
                <FormField
                    index={ fieldsArray.length - index }
                    key={item.key}
                    value={item.value}
                    options={item.options}
                    showError={!item.valid && !item.pristine}
                    fieldKey={item.key}
                    fieldSetName={fieldSetName}
                    type={item.type}
                    label={item.label}
                    labelColor={item.labelColor}
                    message={item.message || ''}
                    defaultMessage={item.defaultMessage || ''}
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
                    minimumDate={item.minimumDate || null}
                    maximumDate={item.maximumDate || null}
                    updateValue={this.setValue}
                />
            );
        });

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

    /**
     * fetch the mastercard image
     * @returns
     */
    getMastercardImage = async side => {

        if( this._isMounted ) {
            this.setState({ mastercardImageLoading: true });
        }

        MastercardService.image( side )
            .then( data => {
                this.hackilyGetCustomerCode( data );
                if( this._isMounted ) {
                    this.setState({ mastercardImage: data });
                }
            })
            .catch( error => {
                logError( 'Mastercard Image Error', 'UserContext->getMastercardImage', error );
            })
            .finally(() => {
                if( this._isMounted ) {
                    this.setState({ mastercardImageLoading: false });
                }
            });
    }

    /**
     * TODO: this really needs to be replaced with something not quite so filthy!
     * this is a filthy hack to get the customerCode value from the mastercard image url!
     * I can't seem to find this value in the account details
     */
    hackilyGetCustomerCode = cardImage => {
        const uri = _.get( cardImage, 'uri', null );

        if( uri ) {
            let match = uri.match('[?&]' + 'customerCode' + '=([^&]+)');
            const customerCode = match ? match[1] : null;
            if( this._isMounted ) {
                this.setState({ customerCode });
            }
        }
    }

    showMastercardSide = async () => {

        if( this.state.mastercardImageLoading ) {
            return;
        }

        if( this._isMounted ) {
            await this.setState({
                mastercardVisibleSideLabel: this.state.mastercardHiddenSideLabel,
                mastercardHiddenSideLabel: this.state.mastercardVisibleSideLabel,
            });
        }

        this.getMastercardImage( this.state.mastercardVisibleSideLabel );
    }

    getAccountDetails = async () => {

        try {

            const accountData = await UserService.getAccountDetails();
            const cardholderRef = _.get( accountData, 'full_details.accounts[0].cardholderRef', null );

            // grab the current in use account
            let current = _.get( accountData, 'full_details.current', null ),
                // grab the array of all accounts
                accounts = _.get( accountData, 'full_details.accounts', [] ),
                // placeholder for the determined account
                account,
                // placeholder for raw balances
                balances;

            // proceed only if we have all the above.
            if( current && Array.isArray( accounts ) ) {
                // loop through the provided accounts
                for( let i = 0; i < accounts.length; i++ ) {
                    // test if this provided account matches the _current_ account
                    if( current.accountNo && current.accountNo === _.get( accounts[i], 'accountInfo.accountNo', null ) ) {
                        // store
                        account = accounts[i];
                        // break out loop
                        break;
                    }
                }

                // determine that we've received the balance data in a format that we anticpiated
                if( account && _.get( account, 'productBalances[0]', false ) ) {
                    // grab those balances.
                    balances = _.get( account, 'productBalances[0]', null );

                    // derive the cleared balance
                    let clearedValue = _.get( balances, 'balance1.amount', null );
                    const balanceCleared = clearedValue != null ? formatMoneyString( _.get( balances, 'balance1.currencyCode', null ), clearedValue ) : 'Unknown';

                    // dervice the available balance
                    let availableValue  = _.get( balances, 'balance2.amount', null );
                    const balanceAvailable = ( availableValue != null ? formatMoneyString( _.get( balances, 'balance2.currencyCode', null ), availableValue ) : 'Unknown' );
                    if( this._isMounted ) {
                        this.setState({
                            mastercardBalanceAvailable: balanceAvailable,
                            mastercardBalanceCleared: balanceCleared
                        });
                    }
                }

            }

            if( this._isMounted ) {
                this.setState({
                    accountData: accountData,
                    cardholderRef: cardholderRef,
                    mastercardError: null,
                });
            }

            return accountData;

        } catch( error ) {
            if( this._isMounted ) {
                this.setState({
                    mastercardError: _.get( error, 'message', 'Mastercard Error' )
                });
            }

            logError( 'Mastercard Get Account Details Error', 'UserContext->getAccountDetails', error );
        }
    }

    getTopOffers = async () => {

        // this should ideally be dynamic, i.e. it should be reactive to *any* data the api sends ... however, it's sunday and I'm done with this - so it's gonna be hard coded GBP/EUR for now.

        try {
            const offers_data = await UserService.getTopOffers();

            console.log('offers_data',offers_data)

            if( !offers_data?.categories || !this._isMounted ) return;

            let gbp_offers = offers_data.categories.filter(category => {
                return category.name == 'GBP'
            })

            let eur_offers = offers_data.categories.filter(category => {
                return category.name == 'EUR'
            })

            if( Array.isArray(gbp_offers) && gbp_offers.length > 0 ) {

                gbp_offers = gbp_offers[0];

                gbp_offers.components = gbp_offers.offers.map( offer => (
                    <AnimatedView
                        duration={400}
                        animationName={'fade-in-up'}
                        key={ offer.id.toString() }
                    >
                        <AutoHeightImage
                            style={{flex: 0, marginBottom: VARS.spacer.large}}
                            width={DIMENSIONS.width - (2 * VARS.spacer.large)}
                            source={{uri: offer.image_path}}
                        />
                    </AnimatedView>
                ));
            }

            if( Array.isArray(eur_offers) && eur_offers.length > 0 ) {

                eur_offers = eur_offers[0];

                eur_offers.components = eur_offers.offers.map( offer => (
                    <AnimatedView
                        duration={400}
                        animationName={'fade-in-up'}
                    >
                        <AutoHeightImage
                            style={{flex: 0, marginBottom: VARS.spacer.large}}
                            width={DIMENSIONS.width - (2 * VARS.spacer.large)}
                            source={{uri: offer.image_path}}
                            key={ offer.id.toString() }
                        />
                    </AnimatedView>
                ));
            }

            this.setState({
                gbp_offers: !Array.isArray(gbp_offers) ? gbp_offers : null,
                eur_offers: !Array.isArray(eur_offers) ? eur_offers : null,

            })

        } catch( error ) {

            console.log('Error loading top offers', error );

        }

        if(this._isMounted) this.setState({topOffersLoaded:true});

    }

    getYourJourney = async () => {

        // this should ideally be dynamic, i.e. it should be reactive to *any* data the api sends ... however, it's sunday and I'm done with this - so it's gonna be hard coded GBP/EUR for now.

        try {
            console.log('getYourJourney');
            const journey_data = await UserService.getYourJourney();

            console.log('journey_data',journey_data);

            if( !journey_data?.categories || !this._isMounted ) return;

            this.setState({

            })

        } catch( error ) {

            console.log('Error loading your journey', error );

        }

        if(this._isMounted) this.setState({yourJourneyLoaded:true});

    }

    getUserAccreditation = async () => {
        try {
            const accreditation_data = await UserService.getUserAccreditation();
console.log(accreditation_data);
            if( !accreditation_data?.categories || !this._isMounted ) return;

            this.setState({

            })

        } catch( error ) {
            console.log('Error loading your journey', error );
        }
        if(this._isMounted) this.setState({yourJourneyLoaded:true});
    }

    componentDidMount() {
        this._isMounted = true;
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    render () {
        return (
            <UserContext.Provider value={{
                ...this.state,
                getProfile: this.getProfile,
                transferRewardsBalance: this.transferRewardsBalance,
                claimBookingShow: this.claimBookingShow,
                getRewardsHistory: this.getRewardsHistory,
                renderFields: this.renderFields,
                getMastercardImage: this.getMastercardImage,
                showMastercardSide: this.showMastercardSide,
                getAccountDetails: this.getAccountDetails,
                getMastercardTransactions: this.getMastercardTransactions,
                getBallots: this.getBallots,
                getUserBallots: this.getUserBallots,
                enterBallot: this.enterBallot,
                getIsExistingBallotEntry: this.getIsExistingBallotEntry,
                updateProfile: this.updateProfile,
                updateProfileImage: this.updateProfileImage,
                getPhoenixUser: this.getPhoenixUser,
                updateMarketing: this.updateMarketing,
                getTopOffers: this.getTopOffers,
                getYourJourney: this.getYourJourney
            }}>
                {this.props.children}
            </UserContext.Provider>
        )
    }
}

export default UserContextProvider;
