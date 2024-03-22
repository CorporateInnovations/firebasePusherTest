/*******************************************************************************
 * Dependency Imports
 ******************************************************************************/

 // lodash - https://lodash.com/
 import _ from 'lodash';
 // axios - https://github.com/axios/axios
 import axios from 'axios';
// RNRCL Bridge
import { NativeModules } from 'react-native';
// Helpers
import { getBridgeEndpoint, getPhoenixEndpoint, getSession } from '../../Helpers';

import CONFIG from '../../Config';

/*******************************************************************************
 * Services
 ******************************************************************************/

/*******************************************************************************
 * Public methods
 ******************************************************************************/

/**
 * get transactions for the authenticated user
 *
 * @return {promise} containing the response data
 */
export const getTransactions = async ( page = 1 ) => {

    let session = await getSession();

    let transactions_promise = new Promise(( resolve, reject ) => {

        if( !session || !session.accessToken ) {
            reject({ success: false, error: 'Invalid session' });
            return;
        }

        axios({
                method: 'get',
                url: getBridgeEndpoint( '/card/history', { numResults: 30, searchDepth: 2, pageOffset: page }, '2' ),
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

    return transactions_promise;

}

/**
 * get card image
 *
 * @param {str} side i.e. front or back
 * @return {promise} containing the response data
 */
export const getCardImage = async ( side = 'front' ) => {

    let session = await getSession();

    let card_image_promise = new Promise(( resolve, reject ) => {

        if( !session || !session.accessToken ) {
            reject({ success: false, error: 'Invalid session' });
            return;
        }

        axios({
                method: 'get',
                url: getBridgeEndpoint( '/card/view', { side: side }, '2' ),
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

    return card_image_promise;

}

/**
 * provision
 *
 * @param {str} side i.e. front or back
 * @return {promise} containing the response data
 */
export const provision = async ( cardSerial, fPanId, cardHolderName, cardNumberSuffix ) => {

    let session = await getSession();

    let provision_promise = new Promise(( resolve, reject ) => {

        if( !session.accessToken ) {
            reject({ success: false, status: 0, message: 'Unable to provision card because no session access token' });
            return;
        }

        NativeModules.RNRCL.addCardSerial(
            cardSerial,
            fPanId,
            cardHolderName,
            cardNumberSuffix,
            getBridgeEndpoint( '/card/provision', null, '1' ),
            session.accessToken )

        resolve();

    });

    return provision_promise;

}

/**
 * respond to a challenge
 * @returns 
 */
 export const challenge = async ( challengeId, payload ) => {

    const session = await getSession();

    let headers = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': 'Bearer ' + session.accessToken,
    };
    
    const url = CONFIG.mastercard3DS[CONFIG.env.bridge] + challengeId;

    return new Promise(( resolve, reject ) => {
        axios({
            method: 'patch',
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
};


/**
 * respond to a challenge
 * @returns 
 */
 export const getPendingChallenges = async () => {

    const session = await getSession();

    let headers = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': 'Bearer ' + session.accessToken,
    };

    const url = CONFIG.mastercard3DS[CONFIG.env.bridge] + session.ssoKey;

    return new Promise(( resolve, reject ) => {
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
};