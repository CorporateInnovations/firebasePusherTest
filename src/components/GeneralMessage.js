/*******************************************************************************
 * Dependency Imports
 ******************************************************************************/

// react core - https://reactjs.org/
import React from 'react';
// react native core - https://facebook.github.io/react-native/docs/getting-started.html
import { View, StyleSheet, Text } from 'react-native';
import { STYLES, VARS } from '../Styles';

// icons
import { createIconSetFromIcoMoon } from 'react-native-vector-icons';
import icoMoonConfig from '../../assets/icons/selection.json';
const Icon = createIconSetFromIcoMoon( icoMoonConfig, 'icomoon', 'icomoon.ttf' );

import AnimatedView from './AnimatedView';

/*******************************************************************************
 * GeneralMessage Class
 ******************************************************************************/
export default class GeneralMessage extends React.Component {

    constructor( props ) {

        super( props );

        this.state = {
            textColor: this.props.textColor || STYLES.colors.navy.default,
        };
    }

    render() {

        return (
            <AnimatedView
                duration={400}
                animationName={'fade-in-up'}
                customStyle={styles.container}
            >
                {
                    this.props.message &&
                    <View style={styles.center_wrapper}>
                        <Text style={{...styles.message_text, color: this.state.textColor}}>{ this.props.message }</Text>
                    </View>
                }
            </AnimatedView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 0,
        justifyContent: 'center',
        paddingTop: VARS.spacer.large,
        paddingBottom: VARS.spacer.large,
    },
    center_wrapper: {
        flex: 0,
        justifyContent: 'center',
        alignContent: 'center',
        alignItems: 'center',
    },
    message_text: {
        fontFamily: VARS.fonts.family.darwin_light,
        fontSize: VARS.fonts.size.lead,
        lineHeight: 28,
        textAlign: 'center',
    },
});
