/*******************************************************************************
 * Dependency Imports
 ******************************************************************************/

// react core - https://reactjs.org/
import React from 'react';
// react native core - https://facebook.github.io/react-native/docs/getting-started.html
import { StyleSheet, Modal, View, Text, TouchableOpacity } from 'react-native';
// icons
import { createIconSetFromIcoMoon } from 'react-native-vector-icons';
import icoMoonConfig from '../../assets/icons/selection.json';
const Icon = createIconSetFromIcoMoon( icoMoonConfig, 'icomoon', 'icomoon.ttf' );

import AnimatedView from '../components/AnimatedView';

import { STYLES, VARS } from '../Styles';

/*******************************************************************************
 * GeneralTabsPanel Class
 ******************************************************************************/
export default class GeneralTabsPanel extends React.Component {

    constructor( props ) {

        super( props );

        this.state = {
            
        };
    }

    _isMounted = false;

    componentDidMount() {
        this._isMounted = true;
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    render() {

        return (
            <AnimatedView
                duration={400}
                animationName={'fade-in'}
                customStyle={STYLES.tabs.panel}
            >
                { this.props.children }
            </AnimatedView>
        );
    }
}

const styles = StyleSheet.create({

});
