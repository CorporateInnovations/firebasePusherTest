/*******************************************************************************
 * Dependency Imports
 ******************************************************************************/
// rewards::api
import * as Api from './api';
// lodash - https://lodash.com/
import _ from 'lodash';

/*******************************************************************************
 * Services
 ******************************************************************************/

/*******************************************************************************
 * Configuration
 ******************************************************************************/

/*******************************************************************************
 * Transformer prototypes
 ******************************************************************************/
/**
 * transforms the aapi supplied account details data into a predictable structure
 *
 * NOTE: must safety check every key value pair!! the app may assume these properties exist.
 *
 * @param {obj} user_data as provided by the api
 * @return {obj} sanitized user object
 */
 function Details( user_data ) {

    this.accountNo = _.get( user_data.current, 'accountNo', null );
    this.cardSerial = _.get( user_data.current, 'cardSerial', null );

    this.cardPan = null;
    this.cardNumberSuffix = null;
    this.title = null;
    this.forename = null;
    this.surname = null;
    this.cardHolderName = null;
    this.fPanId = null; // tokenised card identifier
    this.fullFpanLoaded = false;

    for( let account of user_data.accounts ) {
        if( account.accountInfo.accountNo == this.accountNo ) {
            for( let card of account.cardInfo ) {
                if( card.cardSerial == this.cardSerial ) {
                    this.cardPan = _.get( card, 'cardPan', null );
                    this.cardNumberSuffix = this.cardPan.substr(-4, 4);

                    this.title = _.get( card.cardholderName, 'title', null );
                    this.forename = _.get( card.cardholderName, 'forename', null );
                    this.surname = _.get( card.cardholderName, 'surname', null );
                    this.cardHolderName = this.title + " " + this.forename + " " + this.surname;

                    break;
                }
            }
            if( account.tokenInfo && account.tokenInfo.tokenDetails ) {
                for( let tokenDetails of account.tokenInfo.tokenDetails ) {
                    if( tokenDetails.cardSerial == this.cardSerial && (tokenDetails.tokenStatus == "A" || tokenDetails.tokenStatus == "P")) {
                        this.fPanId = _.get( tokenDetails, 'fPanId', null );
                        break;
                    }
                }
            }
            if( this.fPanId ) {
                this.fullFpanLoaded = true;
            } else {
                this.fPanId = this.cardNumberSuffix;
            }
        }
    }

    if( !this.cardPan ) {
        console.warn( 'account service: Details: card lookup failure' );
    }
}

/*******************************************************************************
 * Private methods
 ******************************************************************************/

/**
 * general success
 *
 * @param {obj} data
 * @return {obj} le data
 */
const _onSuccess = data => {
    // The responses appear to have a variety of inconsistent structures.
    // I can nattor it down to the following data nesting...

    if( _.get( data, 'data.data.data' ) ) {
        return _.get( data, 'data.data.data' );
    }

    if( _.get( data, 'data.data' ) ) {
        return _.get( data, 'data.data' );
    }

    if( _.get( data, 'data' ) ) {
        return _.get( data, 'data' );
    }

    return data;

};

const _onPhoenixSuccess = response => {

    let data = _.get( response, 'data', false );

    if( !data ) {
        return _onFailed( 'Phoenix retured an error but provided no detail' );
    }

    if( typeof data === 'string' && data.includes('<!DOCTYPE') ) {
        return _onFailed( 'Phoenix retured a HTML response that could not be handled by the app.' );
    }

    if( data.status != 'success' ) {
        return _onFailed( data.message ? data.message : data );
    }

    if( _.get( data, 'data' ) ) {
        return _.get( data, 'data' );
    }

    return data;
}

const _onAccountDetailsSuccess = response => {

    let response_data = {},
        account_data = _.get( response, 'data.data', null );

    // grab the user form the response
    if( account_data ) {
        response_data.details = new Details( account_data );
        // full details
        response_data.full_details = account_data;
    }

    return response_data;

};

/**
 * general fail
 *
 * @param {obj} error from a server
 * @return {obj} the error
 */
const _onFailed = error => new Promise(( resolve, reject ) => {

    let error_obj = error.hasOwnProperty( 'response' ) ? error.response : error;

    reject( _.get( error_obj, 'data', null ) || error_obj );

});

/*******************************************************************************
 * Public methods
 ******************************************************************************/

/**
 * get the authenticated user's profile
 *
 * @return {promise}
 */
export const getProfile = () =>
    Api.getProfile()
        .then( _onSuccess )
        .catch( _onFailed );

/**
 * get the account edtails
 */
export const getAccountDetails = () =>
    Api.getAccountDetails()
        .then( _onAccountDetailsSuccess )
        .catch( _onFailed );

/**
 * update profile
 */
export const updateProfile = payload =>
    Api.updateProfile(payload)
        .then( _onPhoenixSuccess )
        .catch( _onFailed );

        /**
         * update profile image
         */
export const updateProfileImage = payload =>
    Api.updateProfileImage(payload)
        .then( _onPhoenixSuccess )
        .catch( _onFailed );

/**
 * get the phoenix user
 */
export const getPhoenixUser = () =>
    Api.getPhoenixUser()
        .then( _onPhoenixSuccess )
        .catch( _onFailed );

/**
 * get the top offers for this user
 */
export const getTopOffers = () =>
    Api.getTopOffers()
        .then( _onPhoenixSuccess )
        .catch( _onFailed );

/**
 * get the top offers for this user
 */
export const getYourJourney = () =>
    Api.getYourJourney()
        .then( _onPhoenixSuccess )
        .catch( _onFailed );

/**
 * get user accreditation results
 */
export const getUserAccreditation = userId =>
    Api.getUserAccreditation( userId )
        .then( _onSuccess )
        .catch( _onFailed );

