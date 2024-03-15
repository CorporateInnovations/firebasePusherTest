/*******************************************************************************
 * Dependency Imports
 ******************************************************************************/

// react core - https://reactjs.org/
import React from 'react';
// react native core - https://facebook.github.io/react-native/docs/getting-started.html
import { View, StyleSheet, Text } from 'react-native';
// react navigation - https://reactnavigation.org/docs/
import { useNavigation } from '@react-navigation/native';
import { STYLES, VARS } from '../Styles';

// icons
import { createIconSetFromIcoMoon } from 'react-native-vector-icons';
import icoMoonConfig from '../../assets/icons/selection.json';
const Icon = createIconSetFromIcoMoon( icoMoonConfig, 'icomoon', 'icomoon.ttf' );

import { _i } from '../Translations';
import AnimatedView from './AnimatedView';

/*******************************************************************************
 * SectionHeading Class
 ******************************************************************************/
class SectionHeading extends React.Component {

    constructor( props ) {

        super( props );

        this.state = {
            textColor: this.props.textColor || STYLES.colors.navy.default,
            linkColor: this.props.linkColor || STYLES.colors.navy.default,
        };
    }

    render() {

        const { navigate } = this.props.navigation;

        return (
            <AnimatedView
                duration={400}
                animationName={'fade-in'}
                customStyle={styles.container}
            >
                <Text style={{ ...styles.heading_text, color: this.state.textColor }}>{this.props.heading}</Text>
                {
                    this.props.stack &&
                    <Text style={{ ...styles.heading_text, color: this.props.linkColor }} onPress={() => navigate( this.props.stack, { screen: this.props.screen } )}>{this.props.label || _i('View All')}</Text>
                }
            </AnimatedView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: 0,
        paddingBottom: VARS.spacer.small,
    },
    heading_text: {
        fontFamily: VARS.fonts.family.darwin_bold,
        fontSize: VARS.fonts.size.lead,
        lineHeight: 28,
        textAlign: 'center',
    },
});

// Wrap and export
export default function( props ) {

    const navigation = useNavigation();
    
    return <SectionHeading {...props} navigation={navigation} />;
}
