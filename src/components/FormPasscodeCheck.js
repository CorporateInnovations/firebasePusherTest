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
import _, { stubTrue } from 'lodash';

import { AuthContext } from '../context/AuthContext';

import { STYLES, VARS } from '../Styles';
import { _i } from '../Translations';

/*******************************************************************************
 * FormPasscodeCheck Class
 ******************************************************************************/
class FormPasscodeCheck extends React.Component {

    constructor( props ) {

        super( props );

        this.state = {
            codeLength: 0,
            fields: [],
            passcode: ''
        };
    }

    _setPasscode = async value => {

        if( this._isMounted ) {
            await this.setState({ passcode: value });
        }

        await this.context.enterPasscode(this.state.passcode);
    }

    /**
     * reset the passcode
     */
     _resetPasscode = async () => {

        if( this._isMounted ) {
            await this.setState({ passcode: '' });
        }

        this.context.resetPasscode();

    }

    /**
     * output as textinput
     */
    _renderField = () => {

        return (
            <TextInput
                returnKeyType={ 'done' }
                keyboardType={'number-pad'}
                textContentType={'password'}
                autoCapitalize={'none'}
                secureTextEntry={true}
                onChangeText={ value => this._setPasscode( value )}
                value={this.state.passcode}
                autoFocus={true}
                maxLength={6}
                style={{
                    ...styles.input,
                    width: '100%',
                }}
            />
        );

    }

    _isMounted = false;

    componentDidMount() {
        this._isMounted = true;
        this._resetPasscode();

        this.resetListener = EventRegister.addEventListener( 'reset-passcode', () => {
            this._resetPasscode();
        });

        
    }

    componentWillUnmount() {
        this._isMounted = false;
        EventRegister.removeEventListener(this.resetListener);
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
                                width: '100%',
                            }}>
                                { this._renderField() }
                            </View>
                        </View>
                    </>
                );
            }}</AuthContext.Consumer>
        );
    }
}

FormPasscodeCheck.contextType = AuthContext;

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
    }
});

// Wrap and export
export default function( props ) {

    const navigation = useNavigation();

    return <FormPasscodeCheck {...props} navigation={navigation} />;
}
