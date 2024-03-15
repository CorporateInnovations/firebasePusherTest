/*******************************************************************************
 * Dependency Imports
 ******************************************************************************/

 // lodash - https://lodash.com/
 import _ from 'lodash';
 // axios - https://github.com/axios/axios
 import axios from 'axios';

// Helpers
import { getBridgeEndpoint, getPhoenixEndpoint, getSession } from '../../Helpers';

/*******************************************************************************
 * Services
 ******************************************************************************/

/*******************************************************************************
 * Public methods
 ******************************************************************************/

/**
 * get rewards for the authenticated user
 *
 * @param {int} page number
 * @return {promise} containing the response data
 */
export const getRewards = async ( page ) => {

    page = page || 1;

    let session = await getSession();

    let rewards_promise = new Promise(( resolve, reject ) => {

        if( !session || !session.accessToken ) {
            reject({ success: false, error: 'Invalid session' });
            return;
        }

        axios({
            method: 'get',
            url: getBridgeEndpoint( '/reward/history', { page: page }, '1' ),
            headers: {
                'Accept': 'application/json',
                'Cache-Control': 'no-cache',
                'Authorization': 'Bearer ' + session.accessToken,
            }
            }).then(( response ) => {
                resolve( response );
            })
            .catch(( error ) => {
                reject( error );
            });
    });

    return rewards_promise;

}


/**
 * transfer rewards for the authenticated user
 *
 * @return {promise} containing the response data
 */
export const transferRewardsBalance = async () => {

    let session = await getSession();

    let rewards_promise = new Promise(( resolve, reject ) => {

        if( !session || !session.accessToken ) {
            reject({ success: false, error: 'Invalid session' });
            return;
        }

        axios({
            method: 'post',
            url: getBridgeEndpoint( '/reward/transfer', null, '2' ),
            headers: {
                'ContextType': 'application/form-data',
                'Accept': 'application/json',
                'Authorization': 'Bearer ' + session.accessToken,
            }
        }).then(( response ) => {
            resolve( response );
        })
        .catch(( error ) => {
            reject( error );
        });

    });

    return rewards_promise;

}

/**
 * register a booking
 *
 * @return {promise} containing the response data
 */
 export const registerBooking = async payload => {

    console.log('payload in service',payload);

    let session = await getSession();

    let booking_promise = new Promise(( resolve, reject ) => {

        if( !session || !session.accessToken ) {
            reject({ success: false, error: 'Invalid session' });
            return;
        }

        axios({
            method: 'post',
            url: getPhoenixEndpoint( 'clubrewards', '/api/booking/submit' ),
            headers: {
                'x-csrf-token': session.phoenixCsrf,
                'Accept': 'application/json',
            },
            data: payload
        }).then(( response ) => {
            console.log('response',response);
            resolve( response );
        })
        .catch(( error ) => {
            console.error('error',error);
            reject( error );
        });

    });

    return booking_promise;

}

/**
 * get available ballots from phoenix
 * @returns 
 */
export const getBallots = async () => {

    let session = await getSession();

    const url = getPhoenixEndpoint( 'rcclhub', '/api/ballots' );

    const headers = {
        'x-csrf-token': session.phoenixCsrf,
        'Accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded'
    };

    const ballots_promise = new Promise(( resolve, reject ) => {
        
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

    return ballots_promise;
}

/**
 * get this user's entered ballots
 * @returns 
 */
export const getUserBallots = async () => {

    let session = await getSession();

    const url = getPhoenixEndpoint( 'rcclhub', '/api/ballots/list' );

    const headers = {
        'x-csrf-token': session.phoenixCsrf,
        'Accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded'
    };

    const user_ballots_promise = new Promise(( resolve, reject ) => {

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

    return user_ballots_promise;
}

/**
 * enter  a ballot
 * @param {int} ballot_id 
 * @returns 
 */
export const enterBallot = async ballot_id => {

    let session = await getSession();

    const url = getPhoenixEndpoint( 'rcclhub', '/api/ballot/' + ballot_id );

    const headers = {
        'x-csrf-token': session.phoenixCsrf,
        'Accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded'
    };

    const ballot_enter_promise = new Promise(( resolve, reject ) => {

        axios({
            method: 'patch',
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

    return ballot_enter_promise;
}


