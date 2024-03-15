/*******************************************************************************
 * Dependency Imports
 ******************************************************************************/

// lodash - https://lodash.com/
import _, { reject } from 'lodash';
// axios - https://github.com/axios/axios
import axios from 'axios';
// https://www.npmjs.com/package/query-string
const queryString = require('query-string');

// Helpers
import { getBridgeEndpoint, getPhoenixEndpoint, getSession } from '../../Helpers';
// storage
import AsyncStorage from '@react-native-async-storage/async-storage';

/*******************************************************************************
 * Private methods
 ******************************************************************************/

/*******************************************************************************
 * Public methods
 ******************************************************************************/

/**
 * preVerify
 * @param {obj} payload of post data
 * @return {promise} containing the response data
 */
export const preVerify = async payload => {

    let session = await getSession();

    const url = getPhoenixEndpoint( 'rcclhub', '/register/pre-verify' );

    const headers = {
        'x-csrf-token': session.phoenixCsrf,
        'Accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded'
    }

    const pre_verify_promise = new Promise(( resolve, reject ) => {

        axios({
            method: 'post',
            url: url,
            headers: headers,
            data: queryString.stringify( payload )
        })
        .then(( response ) => {
            resolve( response );
        })
        .catch(( error ) => {
            reject( error );
        });

    });

    return pre_verify_promise;

}

/**
 * verify
 * @param {obj} payload of post data
 * @return {promise} containing the response data
 */
 export const verify = async payload => {

    let session = await getSession();

    const url = getPhoenixEndpoint( 'rcclhub', '/register/' + session.regTag );

    const headers = {
        'x-csrf-token': session.phoenixCsrf,
        'Accept': 'application/json',
        //'Content-Type': 'application/x-www-form-urlencoded'
        'Content-Type': 'application/json;charset=UTF-8'
    }

    const verify_promise = new Promise(( resolve, reject ) => {

        axios({
            method: 'post',
            url: url,
            headers: headers,
            //data: queryString.stringify( payload )
            data: payload
        })
        .then(( response ) => {
            resolve( response );
        })
        .catch(( error ) => {
            reject( error );
        });

    });

    return verify_promise;

}

/**
 * updateAccount
 * @param {obj} payload of post data
 * @return {promise} containing the response data
 */
 export const updateAccount = async payload => {

    let update_promise = new Promise(( resolve, reject ) => {
        // proxy response
        setTimeout(() => {
            resolve({
                success: true,
                data: {
                    id: 1
                }
            })
        }, 1000 );
    });

    return update_promise;

}

/**
 * activate
 * @param {obj} payload of post data
 * @return {promise} containing the response data
 */
 export const activate = async payload => {

    let session = await getSession();

    // append the tag to this rerquest
    payload.tag = session.regTag;

    const url = getPhoenixEndpoint( 'rcclhub', '/register/activate/' + session.regTag );

    // values copied verbatim from phoenix front end network request
    const headers = {
        'x-csrf-token': session.phoenixCsrf,
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json;charset=UTF-8'
    }

    const verify_promise = new Promise(( resolve, reject ) => {

        axios({
            method: 'post',
            url: url,
            headers: headers,
            data: payload
        })
        .then(( response ) => {
            resolve( response );
        })
        .catch(( error ) => {
            reject( error );
        });

    });

    return verify_promise;

}

/**
 * agree terms
 * @return {promise} containing the response data
 */
 export const agreeTerms = async () => {

    let session = await getSession();

    const url = getPhoenixEndpoint( 'rcclhub', '/api/agree-to-terms' );

    // values copied verbatim from phoenix front end network request
    const headers = {
        'x-csrf-token': session.phoenixCsrf,
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json;charset=UTF-8'
    }

    const verify_promise = new Promise(( resolve, reject ) => {

        axios({
            method: 'post',
            url: url,
            headers: headers,
            // phoenix seeems to be expecting an empty object literal. not even god knows.
            data: {}
        })
        .then(( response ) => {
            resolve( response );
        })
        .catch(( error ) => {
            reject( error );
        });

    });

    return verify_promise;

}

// 
/**
 * validate the registration tag
 * @return {promise} containing the response data
 */
 export const validateRegTag = async regTag => {

    let session = await getSession();

    const url = getPhoenixEndpoint( 'rcclhub', '/register/validate-registration-tag/' + regTag );

    const headers = {
        'x-csrf-token': session.phoenixCsrf,
        'Accept': 'application/json',
        //'Content-Type': 'application/x-www-form-urlencoded'
    }

    const validate_promise = new Promise(( resolve, reject ) => {

        axios({
            method: 'get',
            url: url,
            headers: headers,
        })
        .then(( response ) => {
            resolve( response );
        })
        .catch(( error ) => {
            reject( error );
        });

    });

    return validate_promise;

}
