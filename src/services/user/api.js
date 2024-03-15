/*******************************************************************************
 * Dependency Imports
 ******************************************************************************/

// lodash - https://lodash.com/
import _ from 'lodash';
// axios - https://github.com/axios/axios
import axios from 'axios';

// Helpers
import {getBridgeEndpoint, getLearnEndpoint, getPhoenixEndpoint, getSession} from '../../Helpers';

// storage
import AsyncStorage from '@react-native-async-storage/async-storage';

/*******************************************************************************
 * Private methods
 ******************************************************************************/

/*******************************************************************************
 * Public methods
 ******************************************************************************/

export const getProfile = async () => {

    let session = await getSession();

    let profile_promise = new Promise(( resolve, reject ) => {

        if( !session || !session.accessToken ) {
            reject({ success: false, error: 'Invalid session' });
            return;
        }

        axios({
            method: 'get',
            // requires version 2 of the user login api
            url: getBridgeEndpoint( '/user/profile', null, '1' ),
            headers: {
                'ContextType': 'application/form-data',
                'Accept': 'application/json',
                'Authorization': 'Bearer ' + session.accessToken,
            }
        })
        .then(( response ) => {
            resolve( response );
        })
        .catch(( error ) => {
            reject( error );
        });

    });

    return profile_promise;
}

export const getAccountDetails = async () => {

    let session = await getSession();

    let account_promise = new Promise(( resolve, reject ) => {

        if( !session || !session.accessToken ) {
            reject({ success: false, error: 'Invalid session' });
            return;
        }

        axios({
            method: 'get',
            // requires version 2 of the user login api
            url: getBridgeEndpoint( '/account/details', null, '1' ),
            headers: {
                'ContentType': 'application/form-data',
                'Accept': 'application/json',
                'Authorization': 'Bearer ' + session.accessToken,
            }
        })
        .then(( response ) => {
            resolve( response );
        })
        .catch(( error ) => {
            reject( error );
        });

    });

    return account_promise;
}

/**
 * update profile
 * @param {obj} payload of post data
 * @return {promise} containing the response data
 */
 export const updateProfile = async payload => {

    let session = await getSession();

    const url = getPhoenixEndpoint( 'rcclhub', '/settings/profile' );

    const headers = {
        'x-csrf-token': session.phoenixCsrf,
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json;charset=UTF-8',
        'x-request-method': 'PATCH',
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
 * update profile image
 * @param {obj} payload of post data
 * @return {promise} containing the response data
 */
 export const updateProfileImage = async payload => {

    let session = await getSession();

    const url = getPhoenixEndpoint( 'rcclhub', '/settings/profile-image' );

    const headers = {
        'x-csrf-token': session.phoenixCsrf,
        'Accept': 'application/json',
        'Content-Type': 'application/json;charset=UTF-8',
        'x-request-method': 'PATCH',
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
 * get the user object from phoenix
 * @return {promise} containing the response data
 */
 export const getPhoenixUser = async () => {

    let session = await getSession();

    const url = getPhoenixEndpoint( 'rcclhub', '/api/user' );

    const headers = {
        'x-csrf-token': session.phoenixCsrf,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    }

    const user_promise = new Promise(( resolve, reject ) => {

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

    return user_promise;

}

/**
 * get the top offers for this user
 * @return {promise} containing the response data
 */
 export const getTopOffers = async () => {

    let session = await getSession();

    const url = getPhoenixEndpoint( 'rcclhub', '/api/top-offers' );

    const headers = {
        'x-csrf-token': session.phoenixCsrf,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    }

    const offers_promise = new Promise(( resolve, reject ) => {

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

    return offers_promise;

}

/**
 * get the top offers for this user
 * @return {promise} containing the response data
 */
export const getYourJourney = async () => {

    let session = await getSession();

    const url = getPhoenixEndpoint( 'rcclhub', '/api/get-journey' );

    const headers = {
        'x-csrf-token': session.phoenixCsrf,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    }

    const journey_promise = new Promise(( resolve, reject ) => {

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

    return journey_promise;

}

export const getUserAccreditation = async userId => {
    let session = await getSession();

    const url = getLearnEndpoint(  '/user/' + userId + '/accreditations' );

    const headers = {
        'x-csrf-token': session.phoenixCsrf,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    }

    const accreditation_promise = new Promise(( resolve, reject ) => {

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

    return accreditation_promise;
}

