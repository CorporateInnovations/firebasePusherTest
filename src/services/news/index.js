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
 * Services
 ******************************************************************************/

/*******************************************************************************
 * Configuration
 ******************************************************************************/

/*******************************************************************************
 * Transformer prototypes
 ******************************************************************************/

/**
 * take an array iof raw new post data and transform into new post objects that the app can safely use.
 * NOTE: phoenix returns a lot of HTML so this wont be fun
 * @param {obj} data 
 * @param {str} phoenixMediaSrc
 */
export const _transformPosts = ( data, phoenixMediaSrc ) => {

    // placeholder
    let posts = [],
        topPost = true;
    // loop through the data
    for( let i = 0; i < data.length; i++ ) {
        // check if this is a validd post
        if(
            // post is active
            data[i].active === 1 &&
            // datetime NOW is before the post's expiry date
            ( !data[i].display_to || Moment().isSameOrBefore( data[i].display_to ) ) &&
            // datetime NOW is after the post's activation date
            ( !data[i].display_from || Moment().isSameOrAfter( data[i].display_from ) )
        ) {

            const bodydHTML = data[i].body || data[i].snippet;
            let post = {
                headline: data[i].title,
                date: formatDate(data[i].created_at, 'DD MMM YYYY'),
                id: data[i].id,
                type: data[i].type,
                snippet: stripHTML( data[i].snippet ),
                bodyHTML: bodydHTML,
                mediaType: data[i].media_type,
                mediaUri: null,
                pdf: null,
            };

            if( data[i].media_src ) {
                post.mediaUri = data[i].media_src.includes('http') ? data[i].media_src : ( phoenixMediaSrc + data[i].media_src );
            }

            if( data[i].pdf ) {
                post.pdf = data[i].pdf.includes('http') ? data[i].pdf : ( phoenixMediaSrc + data[i].pdf );
            }

            posts.push(post);
        }
    }

    return posts;
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
 * handler for get posts success - needs to transform posts reponse into something we can actually use!
 * @param {*} data 
 * @returns 
 */
const _onGetPostsSuccess = async ( response ) => {

    if( _.get( response, 'data.status' ) != 'success' ) {
        return _onFailed({ error: 'phoenix returned a fail response for get news posts'});
    }

    const assetPath = await getPhoenixAssetPath();

    const posts = _transformPosts( _.get( response, 'data.news', [] ), assetPath || '' );

    return posts;

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
 * get the news posts from phoenix
 * @returns
 */
export const getPosts = ( page, category ) =>
    Api.getPosts( page, category )
        .then( _onGetPostsSuccess )
        .catch( _onFailed );
