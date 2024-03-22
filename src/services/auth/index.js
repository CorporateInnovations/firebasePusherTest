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

/**
 * login success
 *
 * @param {obj} data
 * @return {obj} le data
 */
 const _onLoginSuccess = ( response ) => {

    if( !response ) { 
        return _onFailed({ error: 'Login failed' });
    }
    

    const data = {
        bridge: _.get( response, 'bridge.data.data', null ),
        phoenix: response.phoenix
    };

    return data;

};

/**
 * post success
 *
 * @param {obj} data
 * @return {obj} le data
 */
const _onPostSuccess = ( response ) => {

    if( !response ) { 
        return _onFailed({ error: 'Login failed' });
    }

    const data = response.data;

    return data;

};

/**
 * general fail
 *
 * @param {obj} error from a server
 * @return {obj} the error
 */
const _onFailed = ( error ) => new Promise(( resolve, reject ) => {

    let error_obj = error.hasOwnProperty( 'response' ) ? error.response : error;

    reject( _.get( error_obj, 'data', null ) || error_obj );

});

/*******************************************************************************
 * Public methods
 ******************************************************************************/

/**
 * login
 *
 * @return {promise}
 */
export const login = payload =>
    Api.login( payload )
	    .then( _onLoginSuccess )
        .catch( _onFailed );

/**
 * login to the bridge api
 *
 * @param {obj} payload includes the access credentials
 * @return {promise}
 */
export const loginBridge = payload =>
    Api.loginBridge( payload )
        .then( _onSuccess )
        .catch( _onFailed );

/**
 * request a security code
 */
export const requestSecurityCode = () =>
    Api.requestSecurityCode()
        .then( _onSuccess )
        .catch( _onFailed );

export const getPhoenixMeta = () =>
    Api.getPhoenixMeta()
        .then( _onSuccess )
        .catch( _onFailed );

export const getPusherToken = () =>
    Api.getPusherToken()
        .then( _onSuccess )
        .catch( _onFailed );

/**
 * get currently authenticated user
 *
 * @return {promise}
 */
export const user = () =>
    Api.user()
        .then( _onSuccess )
        .catch( _onFailed );

/**
 * post submitted email to be verified for 2 factor auth password reset
 *
 * @return {promise}
 */
export const postEmailVerification = payload => 
    Api.postEmailVerification( payload )
        .then( _onPostSuccess )
        .catch( _onFailed );

/**
 * post submitted 2FA Code for 2 factor auth password reset
 *
 * @return {promise}
 */
export const post2FACode = payload => 
Api.post2FACode( payload )
    .then( _onPostSuccess )
    .catch( _onFailed );

/**
 * post submitted new password for 2 factor auth password reset
 *
 * @return {promise}
 */
export const postNewPassword = payload => 
Api.postNewPassword( payload )
    .then( _onPostSuccess )
    .catch( _onFailed );