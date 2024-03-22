/*******************************************************************************
 * Dependency Imports
 ******************************************************************************/

// react core - https://reactjs.org/
import React from 'react';
// react native core - https://facebook.github.io/react-native/docs/getting-started.html
import { View, StyleSheet, Text, TextInput, Alert } from 'react-native';
// react navigation - https://reactnavigation.org/docs/
import { useNavigation } from '@react-navigation/native';
// https://github.com/meinto/react-native-event-listeners
import { EventRegister } from 'react-native-event-listeners';
// lodash;
import _ from 'lodash';

import { AuthContext } from '../context/AuthContext';

import { STYLES, VARS } from '../Styles';
import { _i } from '../Translations';

/*******************************************************************************
 * FormMemwordCheck Class
 ******************************************************************************/
class FormMemwordCheck extends React.Component {

    constructor( props ) {

        super( props );

        this.state = {
            codeLength: 0,
            fields: [],
        };

        // placeholder for field refs - needed for blur and focus
        this.inputs = {};
    }

    /**
     * handles setting the value to state and re-focusing to the next field
     */
    _updateValue = async ( value, key ) => {
            // create a copy of fields from state that we can edit
        let fields = this.state.fields,
            // extract "this" field
            current = _.find( fields, { 'key': key } ),
            // get the key of what would be the next field
            targetKey = parseInt( key ) + 1,
            // placeholder
            memword;
        
        current.value = value;
        // get all fields excluding the "this" field
        fields = _.filter( fields, i => { return i.key != key });
        // push the edited "this" field back into the collection
        fields.push( current );
        // make sure the order is correct
        fields = _.orderBy( fields, 'key', 'asc' );
        // grab the current passcode
        memword = this._extractMemword( fields );
        // save to context
        await this.context.enterMemword( memword );
        // blur "this" field
        this.inputs[`memword${key}`].blur();
        // if there is a next field, focus that one
        if( this.inputs.hasOwnProperty(`memword${targetKey}`) ) this.inputs[`memword${targetKey}`].focus();

    };

    /**
     * 
     */
    _extractMemword = fields => {

        let memword = '';

        for( let i = 0; i < fields.length; i++ ) {
            memword += fields[i].value || '';
        }

        return memword;

    }

    _prettyCharLabel = index => {
        const position = index + 1;
        let ext;
        
        switch( position ) {
            case 0:
                ext = 'st';
                break;
            case 1:
                ext = 'nd';
                break;
            default:
                ext = 'th';
        }

        return position + ext;
    }

    /**
     * reset the passcode
     */
     _resetMemword = async () => {

        let fields = [];

        const challenge = await this.context.generateMemwordChallenge();

        for( let i = 0; i < challenge.length; i++ ) {
            fields.push({
                key: (i + 1).toString(),
                value: null,
                label: this._prettyCharLabel(challenge[i])
            });
        }

        if( this._isMounted ) {
            await this.setState({
                fields: fields,
            });

            //this.inputs[`memword1`].focus();
        }

        this.context.resetMemword();

    }

    /**
     * loop through the fields and output as textinput
     */
    _renderFields = () => {

        return this.state.fields.map((item) => {
            this[`memword${item.key}`] = React.createRef();
            return (
                <View
                    key={item.key}
                    style={{
                        marginLeft: item.key === '1' ? 0 : 10,
                        width: 50,
                        flexShrink: 0,
                        flexGrow: 0,
                    }}
                >
                    <Text style={styles.label}>{item.label}</Text>
                    <TextInput
                        keyboardType={'default'}
                        autoCapitalize={'none'}
                        onChangeText={ value => this._updateValue( value, item.key )}
                        value={item.value}
                        autoFocus={item.key == '1'}
                        maxLength={1}
                        ref={ input => { this.inputs[`memword${item.key}`] = input } }
                        blurOnSubmit={false}
                        style={styles.input}
                    />
                </View>
            );
        });

    }

    _isMounted = false;

    componentDidMount() {
        this._isMounted = true;
        this._resetMemword();

        this.resetMemwordListener = EventRegister.addEventListener( 'reset-memword', () => {
            this._resetMemword();
        });

        
    }

    componentWillUnmount() {
        this._isMounted = false;
        EventRegister.removeEventListener(this.resetMemwordListener);
    }

    render() {

        return (
            <AuthContext.Consumer>{( authContext ) => {
                return (
                    <>
                        <View style={{ marginBottom: 30, marginTop: 30 }}>
                            <View style={{
                                flex: 0,
                                flexDirection: 'row',
                                flexWrap: 'nowrap',
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: '100%',
                            }}>
                                { this._renderFields() }
                            </View>
                        </View>
                    </>
                );
            }}</AuthContext.Consumer>
        );
    }
}

FormMemwordCheck.contextType = AuthContext;

const styles = StyleSheet.create({
    input: {
        fontSize: 24,
        borderColor: STYLES.colors.navy.default,
        color: STYLES.colors.navy.default,
        fontFamily: VARS.fonts.family.darwin_bold,
        paddingTop: 10,
        paddingBottom: 10,
        height: 49,
        borderRadius: 4,
        borderWidth: 2,
        textAlign: 'center',
    },
    label: {
        ...STYLES.text.body_bold,
        paddingBottom: 5,
    }
});

// Wrap and export
export default function( props ) {

    const navigation = useNavigation();

    return <FormMemwordCheck {...props} navigation={navigation} />;
}
