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
import { getLearnEndpoint, getSession } from '../../Helpers';

/*******************************************************************************
 * Private methods
 ******************************************************************************/

/*******************************************************************************
 * Public methods
 ******************************************************************************/

/**
 * get a specified user's learn modules
 * @returns example
 */
export const userModules = async userId => {

    const session = await getSession();

    const user_modules_promise = new Promise(( resolve, reject ) => {

        if( !userId ) {
            reject({ success: false, error: 'no phoenix user id' });
            return;
        }

        if( !session || !session.phoenixCsrf ) {
            reject({ success: false, error: 'no session token' });
            return;
        }
console.log(getLearnEndpoint('/user/' + userId + '/modules'));
        axios({
            method: 'get',
            url: getLearnEndpoint( '/user/' + userId + '/modules' ),
            headers: {
                'x-csrf-token': session.phoenixCsrf,
                'Accept': 'application/json',
            }
        })
        .then(( response ) => {
            resolve( response );
        })
        .catch(( error ) => {
            console.log(error);
            reject( error );
        });

    });

    return user_modules_promise;
};

/**
 * get an individual module
 * @returns example
 */
 export const userModule = async ( userId, moduleId ) => {

    const session = await getSession();

    const user_module_promise = new Promise(( resolve, reject ) => {

        if( !userId ) {
            reject({ success: false, error: 'no phoenix user id' });
            return;
        }

        if( !moduleId ) {
            reject({ success: false, error: 'no module id' });
            return;
        }

        if( !session || !session.phoenixCsrf ) {
            reject({ success: false, error: 'no session token' });
            return;
        }

        const url = getLearnEndpoint( '/user/' + userId + '/module/' + moduleId );

        axios({
            method: 'get',
            url: url,
            headers: {
                'x-csrf-token': session.phoenixCsrf,
                'Accept': 'application/json',
            }
        })
        .then(( response ) => {
            resolve( response );
        })
        .catch(( error ) => {
            reject( error );
        });

    });

    return user_module_promise;
};

/**
 * get an individual tier stats
 * @returns example
 */
export const userTierStats = async ( userId ) => {

    const session = await getSession();

    const user_tier_stats_promise = new Promise(( resolve, reject ) => {

        if( !userId ) {
            reject({ success: false, error: 'no phoenix user id' });
            return;
        }

        if( !session || !session.phoenixCsrf ) {
            reject({ success: false, error: 'no session token' });
            return;
        }

        const url = getLearnEndpoint( '/user/' + userId + '/tiers/stats');

        axios({
            method: 'get',
            url: url,
            headers: {
                'x-csrf-token': session.phoenixCsrf,
                'Accept': 'application/json',
            }
        })
        .then(( response ) => {
            resolve( response );
        })
        .catch(( error ) => {
            reject( error );
        });

    });

    return user_tier_stats_promise;
};

/**
 * get an individual module
 * @returns example
 */
 export const submitModulePart = async ( userId, moduleId, partId, payload ) => {

    const session = await getSession();

    const user_module_part_promise = new Promise(( resolve, reject ) => {

        if( !userId ) {
            reject({ success: false, error: 'no phoenix user id' });
            return;
        }

        if( !moduleId ) {
            reject({ success: false, error: 'no module id' });
            return;
        }

        if( !partId ) {
            reject({ success: false, error: 'no part id' });
            return;
        }

        if( !session || !session.phoenixCsrf ) {
            reject({ success: false, error: 'no session token' });
            return;
        }

        const url = getLearnEndpoint( '/user/' + userId + '/module/' + moduleId + '/part/' + partId );

        console.log('send-payload', JSON.stringify(payload, null, 2));
        axios({
            method: 'POST',
            url: url,
            headers: {
                'x-csrf-token': session.phoenixCsrf,
                'Accept': 'application/json',
            },
            data: payload
        })
        .then(( response ) => {
            resolve( response );
        })
        .catch(( error ) => {
            reject( error );
        });

    });

    return user_module_part_promise;
};
