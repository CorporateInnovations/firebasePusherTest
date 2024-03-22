/*******************************************************************************
 * Dependency Imports
 ******************************************************************************/
// lodash - https://lodash.com/
import _ from 'lodash';
//https://momentjs.com/docs/
import Moment from 'moment';
// https://github.com/emeraldsanto/react-native-encrypted-storage
import EncryptedStorage from 'react-native-encrypted-storage';
// https://react-native-async-storage.github.io/async-storage/docs/usage
import AsyncStorage from '@react-native-async-storage/async-storage';
// https://www.npmjs.com/package/query-string
const queryString = require('query-string');

/*******************************************************************************
 * Global config
 ******************************************************************************/

// Config
import CONFIG from './Config';

/*******************************************************************************
 * Methods
 ******************************************************************************/

export const getSession = async () => {

    const accessToken = await EncryptedStorage.getItem(CONFIG.storage.key.storedAccessTokenKey);
    const phoenixCsrf = await EncryptedStorage.getItem(CONFIG.storage.key.storedPhoenixCsrfTokenKey);
    const regTag = await EncryptedStorage.getItem( CONFIG.storage.key.storedRegTagKey );
    const ssoKey = await EncryptedStorage.getItem(CONFIG.storage.key.storedSSOKeyKey);

    const session = {
        accessToken: accessToken || null,
        phoenixCsrf: phoenixCsrf || null,
        regTag: regTag || null,
        ssoKey: ssoKey || null,
    };

    return session;
}

export const getPhoenixAssetPath = async () => {
    return await AsyncStorage.getItem(CONFIG.storage.key.storedPhoenixAssetPathKey);
}

/**
 * validate a collection of fields
 * @param {*} fieldSet we are validating
 */
export const validate = fieldSet => {

    let outcome = {
        isValid: true,
        updatedFields: {}
    };

    for( let f in fieldSet ) {
        // run the validator on the field and get the resulting updated field object - assign this to the returnable collection
        outcome.updatedFields[f] = validateField( fieldSet[f] );
        // if this field was found to be invalid, change the valid flag to false
        if( !outcome.updatedFields[f].valid ) outcome.isValid = false;
    }

    return outcome;
};

/**
 * single field validation
 *
 * @param field field we are validating
 * @returns {boolean}
 */
export const validateField = field => {

    // don't waste time with inactive fields
    if( field.hasOwnProperty('active') && field.active === false ) {
        field.valid = true;
        return field;
    }
    // create a validation flag - true by default
    let isValid = true;
    // remove pristine
    field.pristine = false;
    // reset any prior validation that may no longer apply
    field.valid = true;
    field.message = '';
    // check for required status separately - permit zero values though
    if( field.required && ( field.value === null || field.value === '' ) ) {
        field = setFieldInvalid( field, 'This is a required field' );
        isValid = false;
    }

    // run through each of the fields
    for (var i = 0; i < field.validation.length; i++) {
        switch (field.validation[i].type) {
            case 'max-char':
                if (field.value.length > field.validation[i].value) {
                    // set this field to invalid state with message
                    setFieldInvalid(field, 'Maximum ' + field.validation[i].value + ' characters allowed');
                    // set the valid flag to false
                    isValid = false;
                }
                break;
            case 'min-char':
                if (field.value.length < field.validation[i].value) {
                    // set this field to invalid state with message
                    setFieldInvalid(field, 'Minimum ' + field.validation[i].value + ' characters required');
                    // set the valid flag to false
                    isValid = false;
                }
                break;
            case 'max-words':

                if( field.value.split(' ').length > field.validation[i].value ) {
                    setFieldInvalid(field, 'No more that ' + field.validation[i].value + ' words allowed');
                    // set the valid flag to false
                    isValid = false;
                }

                break;
            case 'characters':
                if (!hasValidCharacters(field.validation[i].value, field.value)) {
                    // set this field to invalid state with message
                    setFieldInvalid(field, 'Please only use valid characters');
                    // set the valid flag to false
                    isValid = false;
                }
                break;
            case 'digitsOnly':
                if (!hasValidCharacters(field.validation[i].value, field.value)) {
                    // set this field to invalid state with message
                    setFieldInvalid(field, 'Please use numbers only');
                    // set the valid flag to false
                    isValid = false;
                }
                break;
            case 'password':
                if (!hasValidCharacters('password', field.value) || field.value.length < 8) {
                    // set this field to invalid state with message
                    setFieldInvalid(field, 'Your password must be at least 8 characters, and contain uppercase letters, numbers, and symbols (e.g. !, £, or $)');
                    // set the valid flag to false
                    isValid = false;
                }

                // do this separately - it's so unlikely and I dont' want it in the normal message
                if (field.value.length > 60) {
                    // set this field to invalid state with message
                    setFieldInvalid(field, 'Your password must contain fewer than 60 characters');
                    // set the valid flag to false
                    isValid = false;
                }
                break;
            case '2fa-password':
                if (!hasValidCharacters('2fa-password', field.value) || field.value.length < 8) {
                    // set this field to invalid state with message
                    setFieldInvalid(field, 'Password must be minimum 8 characters including at least one letter and one number.');
                    // set the valid flag to false
                    isValid = false;
                }

                // do this separately - it's so unlikely and I dont' want it in the normal message
                if (field.value.length > 60) {
                    // set this field to invalid state with message
                    setFieldInvalid(field, 'Your password must contain fewer than 60 characters');
                    // set the valid flag to false
                    isValid = false;
                }
                break;
            case 'payment-card-number':
                // placeholder simple check on card number length for now
                let card_number = typeof field.value === 'string' ? field.value : field.value.toString();

                card_number = card_number.replace(/\s/g,'');

                if( card_number.length < 13 || !hasValidCharacters( 'digits', card_number ) ) {
                    setFieldInvalid( field, 'The card number seems to be invalid');
                    isValid = false;
                }
                break;
            case 'payment-card-expiry':
                let card_expiry = typeof field.value === 'string' ? field.value : field.value.toString();

                card_expiry = card_expiry.replace(/\s/g,'');

                if( card_expiry.length !== 4 || !hasValidCharacters( 'digits', card_expiry ) ) {
                    setFieldInvalid( field, 'The card expiry date seems to be invalid');
                    isValid = false;
                }
                break;
            case 'payment-card-cvv':
                let card_cvv = typeof field.value === 'string' ? field.value : field.value.toString();

                card_cvv = card_cvv.replace(/\s/g,'');

                if( card_cvv.length !== 4 || !hasValidCharacters( 'digits', card_cvv ) ) {
                    setFieldInvalid( field, 'The card cvv seems to be invalid');
                    isValid = false;
                }
                break;
            case 'email':
                if (!hasValidCharacters('email', field.value)) {
                    // set this field to invalid state with message
                    setFieldInvalid(field, 'Please use a valid email address');
                    // set the valid flag to false
                    isValid = false;
                }
                break;
        }
    }

    // apply the validation flag to the field's state
    field.valid = isValid;
    // aaaaaaaand return
    return field;
};

/**
 * sets single field state to invalid - makes valid property false and applies a validation error message readable on the interface
 * @param {*} field 
 */
const setFieldInvalid = ( field, message ) => {
    // let's make sure field is an acceptable object and will not therefor cause its own error!
    if( Object.getPrototypeOf(field) !== Object.prototype ) {
        // mission critical if this scenario occurs so hard error
        console.error( 'attempted to validate a non-object field', field );
        return;
    }
    // set to iinvalid
    field.valid = false;
    // apply a message - try to avoid using the defaul!
    field.message = message || 'This field is invalid';
    if( !message ) console.warn( 'An invalid field do not receive a sufficient validation message:', field );

    return field;

}

/**
 * check a string against a defined pattern to check for validity
 *
 * @param {str} type - the type of check we're running against the string (see switch(type))
 * @param {str} value - the string to test for validity
 * @returns {bool}
 */
export const hasValidCharacters = ( type, value ) => {
    switch ( type ) {
        // only letters (upper or lowercase)
        case 'letters':
            return /^[a-zA-Z]+$/.test(value);
        case 'telephone':
            // TODO - how is the back end validating this now?
            return true;
        case 'digits':
            return /^\d+$/.test(value);
        // only letters and numbers
        case 'alphanumeric':
            return /^[a-z0-9]+$/i.test(value);
        // correctly formed email address - shouldn't really be doing this
        case 'email':
            ///[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
            return /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(String(value).toLowerCase());
        case 'password':
            return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).+$/.test(value);
        case '2fa-password':
            return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/.test(value);
        case 'url':
            return /(http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/.test(value);
    }
};

/**
 * outputs an absolute api url based on the currently configured environment host
 *
 * @param {str} apiName either "bridge" or "phoenix"
 * @param {str} route the path to append to the end of the host url. Can be prefixed with '/' or not.
 * @param {obj} params (optional) the data params which are to be appended to the url
 * @param {str} useVersion (optional) specifiy a version of the endpoint to use - defaults to the value in ./Config
 * @return {str} the ful absolute url for the desired ape edge
 */
const getEndpoint = ( apiName, subdomain, route, params = {}, useVersion ) => {

    if( !apiName || 'string' !== typeof apiName ) {
        console.error(  'invalid api name given to getEndpoint', apiName );
        return;
    }

    let param_string = '',
        i = 0;

    // collects the provided params as a string
    for( let param in params ) {
        param_string += ( i === 0 ? '?' : '&' ) + param + '=' + params[param];
        i++;
    }

    // assembles the host according to either bridge or phoenix
    let host = CONFIG.api[apiName][CONFIG.env[apiName]];
    // phoenix requests have various subdomains
    if( typeof subdomain === 'string' && subdomain.length > 0 ) {
        // nightmare phoenix bullshit addon...
        if( CONFIG.env[apiName] === 'production' && subdomain === 'rcclhub' ) {
            host = host.replace( '*', 'www' );
        } else {
            host = host.replace( '*', subdomain );
        }
    }
    // assembles the version to use for this request - if a version has not been specified, it uses the api's default (in ./Config)
    // phoenix does not have a version component in the uri
    const version = useVersion !== false ? ( '/v' + ( useVersion ? useVersion : CONFIG.api[apiName].defaultVersion ) ) : '';

    console.log("URI encoded: ", encodeURI( host + version + ( route[0] == '/' ? '' : '/' ) +  route + param_string ))

    // return all the parts assembled and url encoded
    return encodeURI( host + version + ( route[0] == '/' ? '' : '/' ) +  route + param_string );

};

/**
 * outputs an absolute bridge api url based on the currently configured environment host
 *
 * @param {str} route the path to append to the end of the host url. Can be prefixed with '/' or not.
 * @param {obj} params (optional) the data params which are to be appended to the url
 * @param {str} useVersion (optional) specifiy a version of the endpoint to use - defaults to the value in ./Config
 * @return {function} getEndpoint
 */
export const getBridgeEndpoint = ( route, params = {}, useVersion = null ) => {
    return getEndpoint( 'bridge', null, route, params, useVersion );
}

/**
 * outputs an absolute phoenix api url based on the currently configured environment host
 *
 * @param {str} route the path to append to the end of the host url. Can be prefixed with '/' or not.
 * @param {obj} params (optional) the data params which are to be appended to the url
 * @param {str} useVersion (optional) specifiy a version of the endpoint to use - defaults to the value in ./Config
 * @return {function} getEndpoint
 */
export const getPhoenixEndpoint = ( subdomain, route, params = {}, useVersion = false ) => {
    return getEndpoint( 'phoenix', subdomain, route, params, useVersion );
}

/**
 * outputs an absolute elearning platform api url based on the currently configured environment host
 *
 * @param {str} route the path to append to the end of the host url. Can be prefixed with '/' or not.
 * @param {obj} params (optional) the data params which are to be appended to the url
 * @param {str} useVersion (optional) specifiy a version of the endpoint to use - defaults to the value in ./Config
 * @return {function} getEndpoint
 */
 export const getLearnEndpoint = ( route, params = {}, useVersion = false ) => {
    return getEndpoint( 'learn', null, route, params, useVersion );
}

/**
 * format a date object
 */
export const formatDate = ( date, format ) => {

    if( !date || !format || typeof format !== 'string' ) {
        //console.warn( 'Invalid date re-format request');
        //console.warn( 'date:', date );
        //console.warn( 'format:', format );
        return 'Date Error';
    }
    return Moment( date ).format( format );
}

/**
 * check if time has passed
 */
export const isTimePassed = ( time ) => {

    if( !time ) {
        return false;
    }

    if (Moment().isAfter(time)) {
        return true
    }

    return false;
}

/**
 * Compare two field values and return true/false
 */
export const compareFieldValues = ( fieldValue, fieldValueConfirm ) => {

    if( fieldValue !== fieldValueConfirm) {
        return false;
    } else {
        return true;
    }

    return false;
}

/**
     * format a friendly monetary value string
     *
     * @param {num} value
     */
export const formatMoneyString = ( currency = null, value = 0 ) => {

    let symbol,
        symbol_pre;

    switch( currency ) {
        case 'GBP':
            symbol = '£';
            symbol_pre = true;
            break;
        case 'EUR':
            symbol = '€';
            symbol_pre = false;
            break;
        default:
            symbol = '' + ( typeof currency === 'string' ? ' ' + currency : '' );
            symbol_pre = false;
    }

    if( typeof value !== 'string' && !isNaN( value ) ) {
        value = value !== 0 ? (( value / 100 ).toFixed( 2 )).toString() : '0.00';
    }

    return ( symbol_pre ? symbol : '' ) + value + ( !symbol_pre ? symbol : '' );

};

/**
 * enables error logging on this device for the developer to access
 */
export const enableErrorLogging = async () => {
    return await AsyncStorage.setItem(CONFIG.storage.key.errorLoggingEnabled, '1');
}

/**
 * disables error logging on this device
 */
export const disableErrorLogging = async () => {
    return await AsyncStorage.removeItem(CONFIG.storage.key.errorLoggingEnabled);
}

/**
 * checks to see if error logging is enabled on this device currently.
 * TODO: let's update this to check async once and store the result as a global var to save async round trips every time we log
 */
export const errorLoggingEnabled = async () => {
    const enabled = await AsyncStorage.getItem(CONFIG.storage.key.errorLoggingEnabled);
    return enabled == '1';
}

/**
 * stores an error occurrance in the error logs for review in the app's 'developer' interface
 * SILENT LOGGING ONLY, this does not "handle" errors in the UI state i.e. does not apply error state or show an alert
 * @param {str} heading - Concisely state the intent of the action that caused this error e.g. "Error getting news posts"
 * @param {str} location - Give a *useful* description stating where the error occurred, ideally the file and function e.g. NewsContext->getPosts
 * @param {err} error - the error response object in case of a request or the exception in a try/catch
 * @returns 
 */
export const logError = async ( heading, location, error ) => {
    console.warn( `ERROR LOG: ${heading} at ${location}`, error );
    // really no point if we have no info I guess
    if( !error ) {
        return;
    }
    // see if logging enabled/disabled
    const enabled = await errorLoggingEnabled();
    if( !enabled ) {
        return;
    }
    // let's have a heading
    heading = heading || 'Error';
    // date time
    const errorDate = Moment().format('DD MMM YYYY kk:mm:ss');

    let errorLogs = await AsyncStorage.getItem(CONFIG.storage.key.errorLogs);

    errorLogs = errorLogs != null ? JSON.parse( errorLogs ) : [];

    let id = errorLogs.length > 0 ? ( parseInt( errorLogs[0].id ) + 1 ) : 1;
    
    errorLogs.unshift({
        id: id,
        heading: heading,
        error: error,
        date: errorDate,
        location: location
    });

    AsyncStorage.setItem(CONFIG.storage.key.errorLogs, JSON.stringify( errorLogs ));
    
};

/**
 * used by the developer interface to retrieve any stored error messages
 * @returns {arr} of error log objects
 */
export const getErrorLogs = async () => {

    const logs = new Promise(( resolve, reject ) => {
        AsyncStorage.getItem(CONFIG.storage.key.errorLogs)
            .then( data => {
                data != null ? resolve(JSON.parse(data)) : resolve([]);
            })
            .catch( error => {
                reject(error);
            });
    });

    return logs;
}

export const deleteErrorLog = async logId => {
    const currentLogs = await getErrorLogs();
    const filteredLogs = _.filter( currentLogs, function(l) { return l.id != logId; });
    return await AsyncStorage.setItem(CONFIG.storage.key.errorLogs, JSON.stringify( filteredLogs ));
}

export const clearErrorLogs = () => {
    return AsyncStorage.removeItem(CONFIG.storage.key.errorLogs );
}

/**
 * farily basic html stripper
 * @returns 
 */
export const stripHTML = text => {

    const regex = /(<([^>]+)>)/ig;
    text = text.replace(regex, '');
    const space = /&nbsp;/ig;
    text = text.replace( space, ' ' );
    const pound = /&pound;/ig;
    text = text.replace( pound, '£' );
    const euro = /&euro;/ig;
    text = text.replace( euro, '€' );

    return text;
}
