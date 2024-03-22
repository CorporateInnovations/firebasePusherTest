/*******************************************************************************
 * Dependency Imports
 ******************************************************************************/

// react core - https://reactjs.org/
import React from 'react';
// react native core - https://facebook.github.io/react-native/docs/getting-started.html
import { View, StyleSheet, Text, TextInput, Alert } from 'react-native';
// react navigation - https://reactnavigation.org/docs/
import { useNavigation } from '@react-navigation/native';
// lodash;
import _ from 'lodash';

import { AuthContext } from '../context/AuthContext';

import { STYLES, VARS } from '../Styles';
import { _i } from '../Translations';

import ButtonBlock from '../components/ButtonBlock';

/*******************************************************************************
 * FormPasscodeCreate Class
 ******************************************************************************/
class FormPasscodeCreate extends React.Component {

    constructor( props ) {

        super( props );

        this.state = {
            codeLength: this.props.codeLength || 6,
            buttonLabel: this.props.buttonLabel || 'Save',
            fields: [],
            passcode: '',
        };

        // placeholder for field refs - needed for blur and focus
        this.inputs = {};
    }

    /**
     * loop through the fields and output as textinput
     */
    _renderField = () => {

        return (
            <TextInput
                returnKeyType={ 'done' }
                keyboardType={'number-pad'}
                textContentType={'password'}
                autoCapitalize={'none'}
                secureTextEntry={true}
                onChangeText={ value => this.setState({ passcode: value })}
                value={this.state.passcode}
                autoFocus={true}
                maxLength={this.state.codeLength}
                style={{
                    ...styles.input,
                    width: '100%',
                }}
            />
        );

    }

    /**
     * save the passcode to the parent component
     */
    _savePasscode = async () => {

        if( ( this._isConfirmStep() && !this._passcodesMatch() ) || !this._validPasscodeFormat() ) {
            Alert.alert(_i('Whoops!'), _i('Please enter a valid matching passcode'));
            return;
        }

        if( this._isConfirmStep() ) {
            await this.context.setPasscode(this.state.passcode);
        }

        this.props.passcodeStored( this.state.passcode );
    }

    /**
     * reset the passcode
     */
    _resetPasscode = () => {
        
        if( this._isMounted ) {
            this.setState({
                passcode: '',
            });
        }

    }

    _back = () => {
        this.props.back();
    }

    _disableButton = () => {
        return ( this._isConfirmStep() && !this._passcodesMatch() ) || !this._validPasscodeFormat()
    }

    _isConfirmStep = () => {
        return this.props.passcodeCompare ? true : false;
    }

    _passcodesMatch = () => {
        return this.props.passcodeCompare === this.state.passcode;
    }

    _validPasscodeFormat = () => {
        return this.state.passcode.length == this.state.codeLength;
    }

    _showMatchError = () => {
        return this._isConfirmStep() && !this._passcodesMatch() && this._validPasscodeFormat();
    }

    _isMounted = false;

    componentDidMount() {
        this._isMounted = true;
        this._resetPasscode();
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    render() {

        return (
            <AuthContext.Consumer>{( authContext ) => {
                return (
                    <>
                        <View style={{ marginBottom: 30, marginTop: 30 }}>
                            <View style={styles.label_container}>
                                <Text style={{...styles.label_text, color: STYLES.colors.navy.default }}>{ _i('passcode') }</Text>
                            </View>
                            <View style={{
                                flex: 0,
                                flexDirection: 'row',
                                flexWrap: 'nowrap',
                                width: '100%',
                            }}>
                                { this._renderField() }
                            </View>
                            {
                                this._showMatchError() &&
                                <View style={styles.message_container}>
                                    <Text style={{...styles.message_text, color: this.props.messageColor || VARS.colors.navy.default }}>{ _i('Passcodes do not match') }</Text>
                                </View>
                            }
                        </View>
                        {
                            this._showMatchError() &&
                            <ButtonBlock
                                color={ 'navy' }
                                label={_i('Back')}
                                xAdjust={36}
                                customStyle={{ marginBottom: 10 }}
                                onPressEvent={ () => this._back() }
                            />
                        }
                        {
                            ( 
                                ( !this._isConfirmStep() && this._validPasscodeFormat() ) ||
                                ( this._isConfirmStep() && this._validPasscodeFormat() && this._passcodesMatch() )
                            ) &&
                            <ButtonBlock
                                color={ this._disableButton() ? 'disabled' : 'yellow' }
                                label={_i('Save')}
                                xAdjust={36}
                                customStyle={{ marginBottom: 10 }}
                                onPressEvent={ () => this._savePasscode() }
                                disabled={ this._disableButton() }
                            />
                        }
                        {
                            this.state.passcode.length > 0 &&
                            <ButtonBlock
                                color={ 'white' }
                                label={_i('Clear')}
                                xAdjust={36}
                                customStyle={{ marginBottom: 10 }}
                                onPressEvent={ () => this._resetPasscode() }
                            />
                        }
                    </>
                );
            }}</AuthContext.Consumer>
        );
    }
}

FormPasscodeCreate.contextType = AuthContext;

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
    label_container: {
        marginBottom: 10,
    },
    label_text: {
        fontFamily: VARS.fonts.family.darwin_bold,
        fontSize: 16,
        lineHeight: 24,
        textAlign: 'left',
    },
    message_container: {
        marginTop: 5,
    },
    message_text: {
        fontFamily: VARS.fonts.family.darwin_light,
        fontSize: 14,
        lineHeight: 18,
        textAlign: 'left',
    },
    
});

// Wrap and export
export default function( props ) {

    const navigation = useNavigation();

    return <FormPasscodeCreate {...props} navigation={navigation} />;
}
