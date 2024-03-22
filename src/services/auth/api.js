/*******************************************************************************
 * Dependency Imports
 ******************************************************************************/

// lodash - https://lodash.com/
import _, { reject } from 'lodash';
// axios - https://github.com/axios/axios
import axios from 'axios';
import queryString from 'query-string';
// https://www.npmjs.com/package/query-string
// const queryString = require('query-string');


// Helpers
import { getBridgeEndpoint, getPhoenixEndpoint, getSession } from '../../Helpers';

/*******************************************************************************
 * Private methods
 ******************************************************************************/

/*******************************************************************************
 * Public methods
 ******************************************************************************/

/**
 * login
 * @param {obj} payload of post data
 * @return {promise} containing the response data
 */
export const login = async payload => {

    //let session = await getSession();

    console.log("Error code within login API: ", payload)

    if( !payload || !payload.email || !payload.password ) {
        //reject({ success: false, error: 'Email and Password are required' });
        return;
    }

    let bridgeAuth,
        phoenixAuth = null,
        error;

    try {
        bridgeAuth = await bridgeLogin( payload );
 
    } catch( errorResponse ) {
        error = errorResponse;
        //reject( error );
    }

    try {
        phoenixAuth = await phoenixLogin( payload );
    } catch( errorResponse ) {
        error = errorResponse;
        //reject( error );
    }

    let login_promise = new Promise(( resolve, reject ) => {

        if( error ) {
            reject( error );
            return;
        }

        resolve({
            bridge: bridgeAuth,
            phoenix: phoenixAuth
        });

    });

    return login_promise;

}

const bridgeLogin = async payload => {

    const session = await getSession();

    let headers = {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json',
    };

    if( session.accessToken && payload['2fa_code'] ) {
        headers['Authorization'] = 'Bearer ' + session.accessToken;
    }

    console.log("Inside bridge Login: ", payload)
    console.log("Inside bridge Login take two: ", queryString.stringify(payload))

    return new Promise(( resolve, reject ) => {
        axios({
            method: 'post',
            // requires version 2 of the user login api
            url: getBridgeEndpoint( '/user/login', null, '2' ),
            headers: headers,
            data: queryString.stringify(payload)
        })
        .then(( response ) => {
            console.log("inside axios call: ", response)
            resolve( response );
        })
        .catch(( error ) => {
            console.log("inside error axios call: ", error)
            reject( error );
        });
    });
};

const phoenixLogin = async payload => {

    let session = await getSession();

    const data = {
        username: payload.email,
        password: payload.password
    };

    const url = getPhoenixEndpoint( 'rcclhub', '/login' );

    const headers = {
        'x-csrf-token': session.phoenixCsrf,
        'Accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded'
    }

    const login_promise = new Promise(( resolve, reject ) => {

        axios({
            method: 'post',
            url: url,
            headers: headers,
            data: data
        })
        .then(( response ) => {
            resolve( response );
        })
        .catch(( error ) => {
            reject( error );
        });

    });

    return login_promise;
};

/**
 * request a security code
 * @return {promise} containing the response
 */
export const requestSecurityCode = async () => {

    let session = await getSession();

    let code_promise = new Promise(( resolve, reject ) => {

        if( !session || !session.accessToken ) {
            reject({ success: false, error: 'Invalid session' });
            return;
        }

        axios({
            method: 'patch',
            // requires version 2 of the user login api
            url: getBridgeEndpoint( '/account/send-auth-code', null, '2' ),
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

    return code_promise;

}

/**
 * gets the meta data from the phoenix
 * includes the csrf token
 * 
 */
export const getPhoenixMeta = async () => {

    const meta_promise = new Promise(( resolve, reject ) => {
        axios({
            method: 'get',
            url: getPhoenixEndpoint( 'rcclhub', '/api/site/meta' ),
        })
        .then(( response ) => {
            resolve( response );
        })
        .catch(( error ) => {
            reject( error );
        });
    });

    return meta_promise;
}

/**
 * grab the token from pusher used to authenticate the user for private push notifications
 * @returns 
 */
export const getPusherToken = async () => {
    
    let session = await getSession();

    let pusher_promise = new Promise(( resolve, reject ) => {

        if( !session || !session.accessToken ) {
            reject({ success: false, error: 'Invalid session' });
            return;
        }

        axios({
            method: 'get',
            // requires version 2 of the user login api
            url: getBridgeEndpoint( '/user/push-notifications-token', null, '2' ),
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

    return pusher_promise;
}

/**
 * get the currently authenticated user
 * @returns 
 */
 export const user = async () => {

    const session = await getSession();

    let headers = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': 'Bearer ' + session.accessToken,
    };

    return new Promise(( resolve, reject ) => {
        axios({
            method: 'get',
            // requires version 2 of the user login api
            url: getBridgeEndpoint( '/user/profile', null, '1' ),
            headers: headers,
        })
        .then(( response ) => {
            resolve( response );
        })
        .catch(( error ) => {
            reject( error );
        });
    });
};

/**
 * post submitted email to be verified for 2 factor auth password reset
 * @returns 
 */
export const postEmailVerification = async payload => {

    const data = {
        username: payload.confirmed_email
    };

    const headers = {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    }

    const emailVeri_promise = new Promise(( resolve, reject ) => {

        axios({
            method: 'post',
            url: getBridgeEndpoint( '/auth/password/find-account', null, false ),
            headers: headers,
            data: data
        })
        .then(( response ) => {
            resolve( response );
        })
        .catch(( error ) => {
            reject( error );
        });

    });

    return emailVeri_promise;
};

/**
 * post submitted 2FA code for 2 factor auth password reset
 * @returns 
 */
export const post2FACode = async payload => {

    const data = {
        username: payload.verifiedEmail,
        validation_code: payload.verifyCode
    };

    const headers = {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    }

    const codeVeri_promise = new Promise(( resolve, reject ) => {

        axios({
            method: 'post',
            url: getBridgeEndpoint( '/auth/password/validate-account', null, false ),
            headers: headers,
            data: data
        })
        .then(( response ) => {
            resolve( response );
        })
        .catch(( error ) => {
            reject( error );
        });

    });

    return codeVeri_promise;
};

/**
 * post new password for 2 factor auth password reset
 * @returns 
 */
export const postNewPassword = async payload => {

    const data = {
        username: payload.verifiedEmail,
        reset_token: payload.requestResetToken,
        password: payload.newPassword
    };

    const headers = {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    }

    const newPassword_promise = new Promise(( resolve, reject ) => {

        axios({
            method: 'post',
            url: getBridgeEndpoint( '/auth/password/update-password', null, false ),
            headers: headers,
            data: data
        })
        .then(( response ) => {
            resolve( response );
        })
        .catch(( error ) => {
            reject( error );
        });

    });

    return newPassword_promise;
};