/*******************************************************************************
 * Dependency Imports
 ******************************************************************************/

// react core - https://reactjs.org/
import React from 'react';
// react native core - https://facebook.github.io/react-native/docs/getting-started.html
//import { StyleSheet, View, Animated, Easing } from 'react-native';

// icons
import { createIconSetFromIcoMoon } from 'react-native-vector-icons';
import icoMoonConfig from '../../assets/icons/selection.json';
const Icon = createIconSetFromIcoMoon( icoMoonConfig, 'icomoon', 'icomoon.ttf' );

import { STYLES, VARS } from '../Styles';

/*******************************************************************************
 * GeneralIcon Class
 ******************************************************************************/
export default class GeneralIcon extends React.Component {

    constructor( props ) {

        super( props );

        this.state = {
            
        };
    }

    render() {

        return (
            <Icon
                style={ this.props.style || {}}
                name={ this.props.icon }
                size={ this.props.size || 40 }
                color={ this.props.color || STYLES.colors.navy.default }
            />
        );
    }
}
