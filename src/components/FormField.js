/*******************************************************************************
 * Dependency Imports
 ******************************************************************************/

// react core - https://reactjs.org/
import React from 'react';
// react native core - https://facebook.github.io/react-native/docs/getting-started.html
import { View, StyleSheet, Text, TextInput, Button, TouchableOpacity, Platform } from 'react-native';
// react navigation - https://reactnavigation.org/docs/
import { useNavigation } from '@react-navigation/native';
// https://github.com/mmazzarolo/react-native-modal-datetime-picker
import DateTimePickerModal from "react-native-modal-datetime-picker";
// https://github.com/meinto/react-native-event-listeners
import { EventRegister } from 'react-native-event-listeners';

// icons
import { createIconSetFromIcoMoon } from 'react-native-vector-icons';
import icoMoonConfig from '../../assets/icons/selection.json';
const Icon = createIconSetFromIcoMoon( icoMoonConfig, 'icomoon', 'icomoon.ttf' );

import FormCheckboxInput from './FormCheckboxInput';
// configs
import { STYLES, VARS } from '../Styles';
import { formatDate } from '../Helpers';
import { _i } from '../Translations';

/*******************************************************************************
 * FormField Class
 ******************************************************************************/
class FormField extends React.Component {

    constructor( props ) {

        super( props );

        this.state = {
            fieldSetName: this.props.fieldSetName,
            type: this.props.type,
            borderStyle: this.props.borderStyle || 'full',
            value: this.props.value || '',
            textContentType: this.props.textContentType || 'none',
            keyboardType: this.props.keyboardType || 'default',
            datePickerVisible: false,
            dropdownOpen: false,
            dropdownValue: this.props.value,
            dropdownItems: this.props.options,
            fieldIndex: this.props.index ?? 1
        };
    }

    _isMounted = false;

    _updateValue = value => {
        // local field value
        this.setState({ value });
        // send to context
        this.props.updateValue( this.state.fieldSetName, this.props.fieldKey, value );
    };

    _getInputStyle = () => {

        let style = {
            fontSize: 16,
            borderColor: this.props.borderColor || VARS.colors.navy.default,
            color: this.props.inputColor || VARS.colors.navy.default,
        };

        if( this.props.showError === true ) {
            style.borderColor = VARS.colors.error.default;
            style.color = VARS.colors.error.default;
        }

        switch( this.props.borderStyle ) {
            case 'underline':
                style.fontFamily = VARS.fonts.family.darwin_light;
                style.paddingBottom = 8;
                style.height = Platform.OS === 'ios' ? 25 : 35;
                style.borderBottomWidth = 1;
                break;
            case 'full':
            default:
                style.fontFamily = VARS.fonts.family.darwin_bold;
                style.padding = 10;
                style.height = 49;
                style.borderRadius = 4;
                style.borderWidth = 2;
                
        }

        if( this.props.extraStyles ) {
            for( let item in this.props.extraStyles ) {
                style[item] = this.props.extraStyles[item];
            }
        }

        return style;

    }
    
    _handleConfirm = (date) => {
        
        if( this._isMounted ) {
            this.setState({ datePickerVisible: false })
        }

        this._updateValue( formatDate( date, 'DD-MM-YYYY' ) );

    };

    _setDropdownValue = async value => {
        this._updateValue( value );
        this.setState({ dropdownOpen: false });
    }

    _toggleDropdown = () => {

        // if we are opening this dropdown, we need to send a message to all others to close
        if( !this.state.dropdownOpen ) {
            EventRegister.emit( 'close-dropdown', this.props.fieldKey );
        }

        if( this._isMounted ) {
            this.setState({ dropdownOpen: !this.state.dropdownOpen });
        }

    }

    _renderDropdownOptions = () => {

        return this.props.options.map((option) => {
            return (
                <TouchableOpacity
                    key={option.key}
                    onPress={ () => this._setDropdownValue( option.value ) }
                    style={ STYLES.select.dropdown_option }
                >
                    <Text style={STYLES.select.button_text}>{ option.label }</Text>
                </TouchableOpacity>
            );
        });

    }

    componentDidMount() {
        this._isMounted = true;

        if( this.state.type === 'select' ) {
            this.closeDropDown = EventRegister.addEventListener( 'close-dropdown', fieldKey => {
                if( this._isMounted && this.props.fieldKey && this.props.fieldKey != fieldKey ) {
                    this.setState({
                        dropdownOpen: false
                    });
                }
            });
        }
    }

    componentWillUnmount() {
        this._isMounted = false;

        if( this.state.type === 'select' ) {
            EventRegister.removeEventListener(this.closeDropDown);
        }
    }

    render() {
        // this is calculated on render because is prop dependent
        // not to be confused with 'styles' which are component wide and defined at bottom
        // and of course STYLES which is the global styles 
        const fieldStyle = this._getInputStyle();

        const message = this.props.message || this.props.defaultMessage;

        return (
            <>
                <View style={{
                    ...styles.field,
                    zIndex: this.state.type === 'select' ? ( ( this.state.fieldIndex + 1 ) * 10 ) : 1
                }}>
                    {
                        this.state.type !== 'checkbox' &&
                    <View style={styles.label_container}>
                        <Text style={{...styles.label_text, color: fieldStyle.color }}>
                            { this.props.label }
                            {
                                this.props.required &&
                                <Text>*</Text>
                            }
                        </Text>
                    </View>
                    }
                    {
                        this.state.type === 'text' &&
                        <TextInput
                            value={this.props.value}
                            keyboardType={this.state.keyboardType}
                            editable={this.props.editable === false ? false : true}
                            textContentType={this.state.textContentType}
                            autoCapitalize={'none'}
                            onChangeText={ value => this._updateValue( value )}
                            secureTextEntry={this.props.secureTextEntry}
                            style={fieldStyle}
                            maxLength={this.props.maxLength || 9999 }
                        />
                    }
                    {
                        this.state.type === 'select' &&
                        <View style={STYLES.select.wrapper}>
                            <TouchableOpacity
                                onPress={ () => this._toggleDropdown() }
                                style={{
                                    ...STYLES.select.button,
                                    borderColor: fieldStyle.borderColor,
                                    borderWidth: fieldStyle.borderWidth,
                                    borderBottomRightRadius: this.state.dropdownOpen ? 0 : fieldStyle.borderRadius,
                                    borderBottomLeftRadius: this.state.dropdownOpen ? 0 : fieldStyle.borderRadius,
                                    borderTopRightRadius: fieldStyle.borderRadius,
                                    borderTopLeftRadius: fieldStyle.borderRadius,
                                    height: fieldStyle.height,
                                    padding: fieldStyle.padding,
                                }}>
                                <View style={ STYLES.select.button_inner }>
                                    <Text style={{
                                        ...STYLES.text.body_light,
                                        color: fieldStyle.color,
                                        fontFamily: fieldStyle.fontFamily,
                                    }}>
                                        { this.props.value || _i('Select an option') }
                                    </Text>
                                    <Icon name={'rp-icon-chevron-down'} size={ 12 } color={ fieldStyle.color } style={{ marginTop: 3 }} />
                                </View>
                            </TouchableOpacity>
                            {
                                this.state.dropdownOpen === true &&
                                <View style={{
                                    ...STYLES.select.dropdown,
                                    borderBottomRightRadius: fieldStyle.borderRadius,
                                    borderBottomLeftRadius: fieldStyle.borderRadius,
                                    top: Platform.OS === 'ios' ? fieldStyle.height : 0,
                                }}>
                                    { this._renderDropdownOptions() }
                                </View>
                            }
                        </View>
                    }
                    {
                        this.state.type === 'date' &&
                        <TouchableOpacity
                            onPress={() => this.setState({ datePickerVisible: true })}
                            style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'flex-start',
                                paddingLeft: fieldStyle.padding,
                                paddingRight: fieldStyle.padding,
                                height: fieldStyle.height,
                                borderRadius: fieldStyle.borderRadius,
                                borderWidth: fieldStyle.borderWidth,
                                borderColor: fieldStyle.borderColor
                            }}
                        >
                            <View style={styles.date_field_inner}>
                                <Icon name={ `rp-icon-calendar-small` } size={ 14 } color={ fieldStyle.color } style={{marginRight: 5}} />
                                <Text
                                    style={{
                                        fontFamily: fieldStyle.fontFamily,
                                        color: fieldStyle.color,
                                        fontSize: fieldStyle.fontSize
                                    }}
                                >{ this.props.value || _i('Select a date') }</Text>
                            </View>
                            <DateTimePickerModal
                                isVisible={this.state.datePickerVisible}
                                mode="date"
                                onConfirm={this._handleConfirm}
                                onCancel={ () => this.setState({ datePickerVisible: false }) }
                                minimumDate={ this.props.minimumDate || null }
                                maximumDate={ this.props.maximumDate || null }
                            />
                        </TouchableOpacity>
                    }
                    {
                        this.state.type === 'checkbox' &&
                        <FormCheckboxInput
                            value={this.state.value}
                            label={this.props.label}
                            labelColor={this.props.labelColor}
                            activeColor={this.props.activeColor || STYLES.colors.navy.default}
                            activeIconColor={this.props.activeIconColor || STYLES.colors.white}
                            editable={this.props.editable === false ? false : true}
                            updateValue={ value => this._updateValue( value )}
                        />
                    }
                    {
                        ( typeof message === 'string' && message.length > 0 ) &&
                        <View style={styles.message_container}>
                            <Text style={{...styles.message_text, color: fieldStyle.color }}>{ message }</Text>
                        </View>
                    }
                </View>
            </>
        );
    }
}

const styles = StyleSheet.create({
    field: {
        position: 'relative',
        marginBottom: 24,
        width: '100%'
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
    date_field_inner: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start'
    }
});

// Wrap and export
export default function( props ) {

    const navigation = useNavigation();

    return <FormField {...props} navigation={navigation} />;
}
