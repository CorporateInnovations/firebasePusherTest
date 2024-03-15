/*******************************************************************************
 * Dependency Imports
 ******************************************************************************/

// rewards::api
import * as Api from './api';
// lodash - https://lodash.com/
import _ from 'lodash';
// https://momentjs.com/docs/
import Moment from 'moment';
// helpers
import { getPhoenixAssetPath, stripHTML, formatDate } from '../../Helpers';

/*******************************************************************************
 * Transformer prototypes
 ******************************************************************************/

/**
 * take an array iof raw new post data and transform into new post objects that the app can safely use.
 * @param {obj} data 
 * @param {str} phoenixMediaSrc
 */
 export const _transformBallots = ( data, phoenixMediaSrc ) => {
    
    // placeholder
    let ballots = [];
    // loop through the data
    for( let i = 0; i < data.length; i++ ) {
        // check if this is a validd ballots
        if(
            // is active
            data[i].published === 1 &&
            // datetime NOW is before the post's expiry date
            Moment().isSameOrBefore( data[i].end_date ) &&
            // datetime NOW is after the post's activation date
            Moment().isSameOrAfter( data[i].start_date )
        ) {

            let ballot = {
                ...data[i],
                image_url: phoenixMediaSrc + data[i].image
            };

            ballots.push(ballot);
        }
    }

    return ballots;
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

    const data = _.get( response, 'data', false );

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

/**
 * handler for get ballots success
 * @param {*} data 
 * @returns 
 */
 const _onGetBallotsSuccess = async response => {

    const data = _.get( response, 'data', false );

    if( _.get( data, 'status' ) != 'success' ) {
        return _onFailed({ error: 'phoenix returned a fail response for get ballots'});
    }

    console.log('data',data);

    const assetPath = await getPhoenixAssetPath();
    // we need to transform some og these properties ready for the app
    const ballots = _transformBallots( _.get( data, 'data.ballots', [] ), '' );

    return ballots;

};

/**
 * this response has been given a specific nested srtucture rather than just 'data' so we need a custom handler
 * @param {*} data 
 * @returns 
 */
 const _onGetUserBallotsSuccess = async response => {

    const data = _.get( response, 'data', false );
    // fish out false positives from dirty ol' phoenix
    if( !data || data.status != 'success' ) {
        return _onFailed( data );
    }

    // 
    if( _.get( data, 'data.ballots_entered' ) ) {
        return _.get( data, 'data.ballots_entered' );
    }

    return [];

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
 * get a list of rewards
 *
 * @param {int} page to get from api
 * @return {promise}
 */

export const getRewards = async ( page ) =>
    Api.getRewards( page )
	    .then( _onSuccess )
	    .catch( _onFailed );


/**
 * 
 * @returns get ballots
 */
export const getBallots = async () =>
    Api.getBallots()
        .then( _onGetBallotsSuccess )
        .catch( _onFailed );

/**
 * 
 * @returns get this user's entered ballots
 */
export const getUserBallots = async () =>
    Api.getUserBallots()
        .then( _onGetUserBallotsSuccess )
        .catch( _onFailed );

/**
 * 
 * @returns get ballots
 */
export const enterBallot = async ballot_id =>
    Api.enterBallot( ballot_id )
        .then( _onPhoenixSuccess )
        .catch( _onFailed );

/**
 * get the reward balance
 *
 * @return {promise}
 */
/*
export const balance = async () => {

    return Api.getBalance()
	    .then( _onBalanceSuccess )
	    .catch( _onFailed );

}
*/

/**
 * get the reward balance
 *
 * @return {promise}
 */
export const transfer = async () =>
    Api.transferRewardsBalance()
	    .then( _onSuccess )
	    .catch( _onFailed );

/**
 * register a booking a.k.a claim a booking
 * @param {obj} payload 
 * @returns 
 */
export const registerBooking = async payload =>
    Api.registerBooking( payload )
        .then( _onPhoenixSuccess )
        .catch( _onFailed );

