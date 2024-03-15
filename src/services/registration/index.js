/*******************************************************************************
 * Dependency Imports
 ******************************************************************************/

// AsyncStorage
import AsyncStorage from '@react-native-async-storage/async-storage';
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

    // The responses appear to have a variety of inconsistent structures.
    // I can nattor it down to the following data nesting...

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
 * general fail
 *
 * @param {obj} error from a server
 * @return {obj} the error
 */
const _onFailed = ( error ) => new Promise(( resolve, reject ) => {

    let error_obj = error.hasOwnProperty( 'response' ) ? error.response : error;

    reject( error_obj );

});

/*******************************************************************************
 * Public methods
 ******************************************************************************/

/**
 * register step 1
 *
 * @return {promise}
 */
export const preVerify = payload =>
    Api.preVerify( payload )
	    .then( _onPhoenixSuccess )
        .catch( _onFailed );

/**
 * register step 2
 *
 * @return {promise}
 */
 export const verify = payload =>
    Api.verify( payload )
        .then( _onPhoenixSuccess )
        .catch( _onFailed );

/**
 * activate step (passwords)
 *
 * @return {promise}
 */
 export const activate = payload =>
    Api.activate( payload )
        .then( _onPhoenixSuccess )
        .catch( _onFailed );

/**
 * final step (T&C)
 *
 * @return {promise}
 */
 export const agreeTerms = () =>
    Api.agreeTerms()
        .then( _onPhoenixSuccess )
        .catch( _onFailed );

/**
 * validate registration tag
 * @returns 
 */
export const validateRegTag = regTag =>
    Api.validateRegTag( regTag )
        .then( _onPhoenixSuccess )
        .catch( _onFailed );

/**
 * update an account
 *
 * @return {promise}
 */
 export const updateAccount = payload =>
    Api.updateAccount( payload )
        .then( _onSuccess )
        .catch( _onFailed );
