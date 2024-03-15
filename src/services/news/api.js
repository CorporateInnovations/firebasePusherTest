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
import { getPhoenixEndpoint, getSession } from '../../Helpers';

/*******************************************************************************
 * Private methods
 ******************************************************************************/

/*******************************************************************************
 * Public methods
 ******************************************************************************/

/**
 * 
 * @returns retrieve news posts from phoenix
 */
export const getPosts = async ( page = null, category = null ) => {

    let params = {};

    if( page ) {
        params.page = page;
    }

    if( category ) {
        params.category = category;
    }

    let session = await getSession();

    const url = getPhoenixEndpoint( 'rcclhub', '/news/posts', params );
    const headers = {
        'x-csrf-token': session.phoenixCsrf,
        'Accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded'
    }

    const posts_promise = new Promise(( resolve, reject ) => {

        axios({
            method: 'get',
            url: url,
            headers: headers
        })
        .then(( response ) => {
            resolve( response );
        })
        .catch(( error ) => {
            reject( error );
        });

    });

    return posts_promise;
};