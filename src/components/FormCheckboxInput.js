/*******************************************************************************
 * Dependency Imports
 ******************************************************************************/

// react core - https://reactjs.org/
import React from 'react';
// react native core - https://facebook.github.io/react-native/docs/getting-started.html
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
// react navigation - https://reactnavigation.org/docs/
import { useNavigation } from '@react-navigation/native';

import { STYLES, VARS } from '../Styles';

// icons
import { createIconSetFromIcoMoon } from 'react-native-vector-icons';
import icoMoonConfig from '../../assets/icons/selection.json';
const Icon = createIconSetFromIcoMoon( icoMoonConfig, 'icomoon', 'icomoon.ttf' );

/*******************************************************************************
 * FormCheckboxInput Class
 ******************************************************************************/
class FormCheckboxInput extends React.Component {

    constructor( props ) {

        super( props );

        this.state = {
            // I want to make sure here that we are only dealing with literal object boolan types, so anything 'truthy' is interpretted as bool true and visa versa.
            value: this.props.value ? true : false,
            activeColor: this.props.activeColor || STYLES.colors.yellow.default,
            activeIconColor: this.props.activeIconColor || STYLES.colors.white,
        };
    }

    _updateValue = value => {
        // local field value
        this.setState({ value });
        // send new value to parent
        this.props.updateValue( value );
    };

    render() {

        return (
            <TouchableOpacity
                style={styles.checkbox}
                disabled={!this.props.editable}
                activeOpacity={1}
                onPress={() => this._updateValue( !this.state.value )}
            >
                <View style={{
                        ...styles.checkbox_marker,
                        borderColor: this.state.activeColor,
                        backgroundColor: this.state.value ? this.state.activeColor : 'transparent'
                    }}>
                    {
                        this.state.value === true &&
                        <Icon name={ `rp-check` } size={ 20 } color={ this.state.activeIconColor } style={{}} />
                    }
                </View>
                <View>
                    <Text style={{...styles.label_text, color: this.props.labelColor || STYLES.colors.navy.default }}>{ this.props.label }</Text>
                </View>
            </TouchableOpacity>
        );
    }
}

const styles = StyleSheet.create({
    checkbox: {
        flex: 0,
        flexDirection: 'row',
        flexWrap: 'nowrap',
        alignItems: 'center',
        justifyContent: 'flex-start',
        width: '100%',
    },
    checkbox_marker: {
        flex: 0,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderRadius: 3,
        width: 30,
        height: 30,
        marginRight: 10
    },
    label_text: {
        fontFamily: VARS.fonts.family.darwin_bold,
        fontSize: 16,
        lineHeight: 24,
        textAlign: 'left',
    }
    
});

// Wrap and export
export default function( props ) {

    const navigation = useNavigation();

    return <FormCheckboxInput {...props} navigation={navigation} />;
}
