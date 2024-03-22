/**
 * set the global translations
 */
 export const getTerms = () => {
    // construct an object of translations and return
    return {
        en: require( './i18n/en.json' )
    };
};

/**
 * set the global translations
 */
 export const setGlobalTerms = () => {
    // store available translations against the global scope
    global.terms = getTerms();
};

/**
 *  set the global language
 */
 export const setGlobalLang = lang => {
    // store the lang setting against the global scope
    global.lang = lang || 'en';

};

/**
 * translate a given string
 * @param {str} term 
 * @param {obj} replace_map i.e. { "%s": "foo", "%x": "bar"}
 */
export const _i = (term, replace_map = null) => {

    if( 'string' !== typeof term ) {
        console.warn( 'tried to translate a non-string term', term );
        return;
    }

    if( term.length === 0 ) return '';

    if( !global.terms ) global.terms = getTerms();

    if( !global.lang ) global.lang = 'en';

    if( !global.terms[global.lang] ) return term;

    let translation = global.terms[global.lang][term] || term;

    // the intent here is to convert "hello %s" to "hello world"
    if(replace_map) {
        const reg = new RegExp( Object.keys(replace_map).join('|'), 'gi' )
        
        translation = translation.replace(reg, match => {
            return replace_map[match];
        })
    }

    return translation;
};