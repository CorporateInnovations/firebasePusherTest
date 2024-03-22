/*******************************************************************************
 * Dependency Imports
 ******************************************************************************/

// react core - https://reactjs.org/
import React from 'react';
// react native core - https://facebook.github.io/react-native/docs/getting-started.html
import { Text, Dimensions } from 'react-native';
import { TouchableHighlight } from 'react-native-gesture-handler';

import { STYLES } from '../Styles';

const DIMENSIONS = Dimensions.get('screen');

/*******************************************************************************
 * ButtonBlock Class
 ******************************************************************************/
export default class ButtonBlock extends React.Component {

    constructor( props ) {

        super( props );

        this.state = {

        };
    }

    render() {

        return (
            <TouchableHighlight
                style={{
                    ...STYLES.button[this.props.color || 'yellow'].button,
                    ...this.props.customStyle || {},
                    width: DIMENSIONS.width - ( 2 * this.props.xAdjust || 0)
                }}
                onPress={ () => this.props.onPressEvent() }
                disabled={this.props.disabled}
            > 
                <Text style={{...STYLES.button[this.props.color || 'yellow'].text}}>{this.props.label}</Text>
            </TouchableHighlight>
        );
    }
}
