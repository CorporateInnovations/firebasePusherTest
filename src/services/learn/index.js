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
 * get a specified user's learn modules
 * @param {int} userId the user's phoenix id
 * @returns
 */
export const userModules = userId =>
    Api.userModules( userId )
        .then( _onSuccess )
        .catch( _onFailed );

/**
 * get a specified user's learn tier stats
 * @param {int} userId the user's phoenix id
 * @returns
 */
export const userTierStats = userId =>
    Api.userTierStats( userId )
        .then( _onSuccess )
        .catch( _onFailed );

/**
 * get a user's individual module
 * @param {int} userId the user's phoenix id
 * @param {int} moduleId the module id
 * @returns
 */
export const userModule = ( userId, moduleId ) =>
    Api.userModule( userId, moduleId )
        .then( _onSuccess )
        .catch( _onFailed );

export const submitModulePart = ( userId, moduleId, partId, payload ) =>
    Api.submitModulePart( userId, moduleId, partId, payload )
        .then( _onSuccess )
        .catch( _onFailed );
