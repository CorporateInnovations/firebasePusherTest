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
 * HeadingGroup Class
 ******************************************************************************/
export default class HeadingGroup extends React.Component {

    constructor( props ) {

        super( props );

        this.state = {
            textColor: this.props.textColor || STYLES.colors.navy.default,
            strokeColor: this.props.strokeColor || STYLES.colors.yellow.default,
            iconColor: this.props.iconColor || STYLES.colors.navy.default,
        };
    }

    render() {

        return (
            <AnimatedView
                duration={400}
                animationName={'fade-in-up'}
                customStyle={styles.container}
            >
                <View style={{...styles.center_wrapper, marginBottom: !this.props.icon ? 40 : 20 }}>
                    <Text style={{...styles.heading_text, color: this.state.textColor}}>{ this.props.heading }</Text>
                    <View style={{...styles.stroke, backgroundColor: this.state.strokeColor}} />
                </View>
                {
                    this.props.icon &&
                    <View style={{ flex: 0, width: '100%', alignItems: 'center', justifyContent: 'center' }}>
                        <Icon name={ this.props.icon } size={ 100 } color={ this.state.iconColor } style={{marginBottom: 30}} />
                    </View>
                }
                {
                    this.props.body &&
                    <View style={styles.center_wrapper}>
                        <Text style={{...styles.body_text, color: this.state.textColor}}>{ this.props.body }</Text>
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
    },
    center_wrapper: {
        flex: 0,
        justifyContent: 'center',
        alignContent: 'center',
        alignItems: 'center',
    },
    heading_text: {
        fontFamily: VARS.fonts.family.darwin_bold,
        fontSize: 26,
        lineHeight: 32,
        textAlign: 'center',
    },
    body_text: {
        fontFamily: VARS.fonts.family.darwin_light,
        fontSize: 16,
        lineHeight: 24,
        textAlign: 'center',
    },
    stroke: {
        width: 25,
        height: 3,
        marginTop: 10,
    }
});
