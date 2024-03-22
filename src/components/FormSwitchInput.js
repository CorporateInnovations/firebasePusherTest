/*******************************************************************************
 * Dependency Imports
 ******************************************************************************/

// react core - https://reactjs.org/
import React from 'react';
// react native core - https://facebook.github.io/react-native/docs/getting-started.html
import { View, Text, Switch } from 'react-native';
// config
import { STYLES, VARS } from '../Styles';


/*******************************************************************************
 * FormSwitchInput Class
 ******************************************************************************/
 export default class FormSwitchInput extends React.Component {

    constructor( props ) {

        super( props );

        this.state = {
            trackColorTrue: this.props.trackColorTrue || STYLES.colors.pink.default,
            trackColorFalse: this.props.trackColorFalse || STYLES.colors.gray.light,
            color: this.props.labelColor || STYLES.colors.navy.default
        };
    }

    render() {

        return (
            <View style={{
                ...STYLES.text.paragraph,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between'
            }}>
                <Text style={{ ...STYLES.text.body_bold, color: this.state.color }}>{this.props.label}</Text>
                <Switch
                    trackColor={{ false: this.state.trackColorFalse, true: this.state.trackColorTrue }}
                    ios_backgroundColor={this.state.trackColorFalse}
                    onValueChange={this.props.onValueChange}
                    value={this.props.value}
                />
            </View>
        );
    }
}
