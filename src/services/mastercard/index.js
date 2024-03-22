/*******************************************************************************
 * Dependency Imports
 ******************************************************************************/

// rewards::api
import * as Api from './api';
// lodash - https://lodash.com/
import _ from 'lodash';
import Moment from 'moment';

// Helpers
import { formatMoneyString } from '../../Helpers';

/*******************************************************************************
 * Private methods
 ******************************************************************************/

/**
 * general success
 *
 * @param {obj} data
 * @return {obj} le data
 */
const _onSuccess = ( data ) => {

    return data;

};

/**
 * general fail
 *
 * @param {obj} error from a server
 * @return {obj} the error
 */
const _onFailed = ( error ) => new Promise(( resolve, reject ) => {

    let error_response = error.hasOwnProperty( 'response' ) ? error.response : error;

    reject( error_response );

});

const _transformTransactions = transactions => {

    if( !Array.isArray( transactions ) ) {
        console.warn( 'Mastercard.transactions returned a success reponse with malformed transactions data', transactions );
        return [];
    }

    let transformed_transactions = [],
        transformed_transaction;

    for( let i = 0; i < transactions.length; i++ ) {
        transformed_transaction = _transformTransaction( transactions[i] );

        if( transformed_transaction ) {
            transformed_transaction.id = i;
            transformed_transactions.push( transformed_transaction );
        }
    }

    return transformed_transactions;

}

const _transformTransaction = transaction => {

    if( !transaction ) {
        return null;
    }

    let transformed_transaction = {
        reason: _.get( transaction, 'reasonText', null ),
        date: _.get( transaction, 'appliedDate', false ) || _.get( transaction, 'clearedDate', false ),
        value: formatMoneyString( _.get( transaction, 'billingValue.currencyCode', null ), _.get( transaction, 'billingValue.amount', null ) ),
    };

    return transformed_transaction;

}

/**
 * transactions success
 *
 * @param {obj} data
 * @return {obj} le data
 */
const _onTransactionsSuccess = ( data ) => {

    let transactions = _.get( data, 'data.data.data.transactions', [] );

    return _transformTransactions( transactions );

};

/**
 * general success
 *
 * @param {obj} data
 * @return {obj} le data
 */
const _onCardImageSuccess = ( data ) => {

    let card_image = _.get( data, 'data.data.image_url', null );

    return card_image !== null ? { uri: card_image } : null ;

};


/*******************************************************************************
 * Public methods
 ******************************************************************************/

/**
 *  provision a card
 *
 * @return {promise}
 */
export const provision = async ( cardSerial, fPanId, cardHolderName, cardNumberSuffix ) => {

    return Api.provision( cardSerial, fPanId, cardHolderName, cardNumberSuffix )
	    .then( _onSuccess )
	    .catch( _onFailed );

};

/**
 * get a list of transactions
 *
 * @return {promise}
 */
export const transactions = async ( page ) => {

    return Api.getTransactions( page )
	    .then( _onTransactionsSuccess )
	    .catch( _onFailed );

};

/**
 * get a single transaction
 *
 * @param {int} id of the target reward
 * @return {promise}
 */
export const transaction = async ( id ) => {

    return Api.getTransaction( id )
	    .then( _onSuccess )
	    .catch( _onFailed );

}

/**
 * get a single transaction
 *
 * @param {int} id of the target reward
 * @return {promise}
 */
export const image = async ( side ) => {

    return Api.getCardImage( side )
	    .then( _onCardImageSuccess )
	    .catch( _onFailed );

}

export const challenge = ( challengeId, payload ) =>
    Api.challenge( challengeId, payload )
	    .then( _onSuccess )
        .catch( _onFailed );

export const getPendingChallenges = () =>
    Api.getPendingChallenges()
        .then( _onSuccess )
        .catch( _onFailed )
