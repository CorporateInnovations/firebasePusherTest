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
 * FormMemwordCreate Class
 ******************************************************************************/
class FormMemwordCreate extends React.Component {

    constructor( props ) {

        super( props );

        this.state = {
            memwordMinLength: 6,
            buttonLabel: this.props.buttonLabel || 'Save',
            fields: [],
            memorableWord: '',
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
                keyboardType={'default'}
                textContentType={'none'}
                autoCapitalize={'none'}
                onChangeText={ value => this.setState({ memorableWord: value })}
                value={this.state.memorableWord}
                autoFocus={true}
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
    _saveMemword = async () => {

        if( ( this._isConfirmStep() && !this._memwordsMatch() ) || !this._validMemwordFormat() ) {
            Alert.alert(_i('Whoops!'), _i('Please enter a valid matching memorable word'));
            return;
        }

        if( this._isConfirmStep() ) {
            await this.context.setMemword( this.state.memorableWord );
        }

        this.props.memwordStored( this.state.memorableWord );
    }

    /**
     * reset the memword
     */
    _resetMemword = () => {

        if( this._isMounted ) {
            this.setState({
                memorableWord: '',
            });
        }

    }

    _back = () => {
        this.props.back();
    }

    _disableButton = () => {
        return ( this._isConfirmStep() && !this._memwordsMatch() ) || !this._validMemwordFormat()
    }

    _isConfirmStep = () => {
        return this.props.memorableWordCompare ? true : false;
    }

    _memwordsMatch = () => {
        return this.props.memorableWordCompare === this.state.memorableWord;
    }

    _validMemwordFormat = () => {
        return this.state.memorableWord.length >= this.state.memwordMinLength;
    }

    _showMatchError = () => {
        return this._isConfirmStep() && !this._memwordsMatch() && this._validMemwordFormat();
    }

    _isMounted = false;

    componentDidMount() {
        this._isMounted = true;
        this._resetMemword();
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
                                <Text style={{...styles.label_text, color: STYLES.colors.navy.default }}>{ _i('Memorable word') }</Text>
                            </View>
                            <View style={{
                                flex: 0,
                                flexDirection: 'row',
                                flexWrap: 'nowrap',
                                width: '100%',
                            }}>
                                { this._renderField() }
                            </View>
                            <View style={styles.message_container}>
                                <Text style={{...styles.message_text, color: this.props.messageColor || VARS.colors.navy.default }}>{ _i('Minimum 6 characters') }</Text>
                            </View>
                            {
                                this._showMatchError() &&
                                <View style={styles.message_container}>
                                    <Text style={{...styles.message_text, color: this.props.messageColor || VARS.colors.navy.default }}>{ _i('Words do not match') }</Text>
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
                                ( !this._isConfirmStep() && this._validMemwordFormat() ) ||
                                ( this._isConfirmStep() && this._validMemwordFormat() && this._memwordsMatch() )
                            ) &&
                            <ButtonBlock
                                color={ this._disableButton() ? 'disabled' : 'yellow' }
                                label={_i('Save')}
                                xAdjust={36}
                                customStyle={{ marginBottom: 10 }}
                                onPressEvent={ () => this._saveMemword() }
                                disabled={ this._disableButton() }
                            />
                        }
                        {
                            this.state.memorableWord.length > 0 &&
                            <ButtonBlock
                                color={ 'white' }
                                label={_i('Clear')}
                                xAdjust={36}
                                customStyle={{ marginBottom: 10 }}
                                onPressEvent={ () => this._resetMemword() }
                            />
                        }
                    </>
                );
            }}</AuthContext.Consumer>
        );
    }
}

FormMemwordCreate.contextType = AuthContext;

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

    return <FormMemwordCreate {...props} navigation={navigation} />;
}
