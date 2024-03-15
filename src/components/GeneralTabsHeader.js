/*******************************************************************************
 * Dependency Imports
 ******************************************************************************/

// react core - https://reactjs.org/
import React from 'react';
// react native core - https://facebook.github.io/react-native/docs/getting-started.html
import { StyleSheet, Modal, View, Text } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';

// icons
import { createIconSetFromIcoMoon } from 'react-native-vector-icons';
import icoMoonConfig from '../../assets/icons/selection.json';
const Icon = createIconSetFromIcoMoon( icoMoonConfig, 'icomoon', 'icomoon.ttf' );

import AnimatedView from '../components/AnimatedView';

import { STYLES, VARS } from '../Styles';

/*******************************************************************************
 * GeneralTabsHeader Class
 ******************************************************************************/
export default class GeneralTabsHeader extends React.Component {

    constructor( props ) {

        super( props );

        this.state = {
            inactiveColor: this.props.inactiveColor || STYLES.colors.gray.light,
            activeColor: this.props.activeColor || STYLES.colors.navy.default
        };
    }

    _isMounted = false;

    _renderTabs = () => {
        return this.props.tabs.map( tab => {
            return (
                <TouchableOpacity
                    key={tab.slug}
                    onPress={ () => tab.setActiveTab(tab.slug) }
                    style={STYLES.tabs.header_button}
                >
                    <Text style={{
                        ...STYLES.tabs.header_button_text,
                        color: tab.slug === this.props.activeTabSlug ? this.state.activeColor : this.state.inactiveColor
                    }}>{tab.label}</Text>
                    {
                        tab.slug === this.props.activeTabSlug &&
                        <AnimatedView
                            duration={400}
                            animationName={'fade-in'}
                            customStyle={STYLES.tabs.header_active_indicator}
                        />
                    }
                </TouchableOpacity>
            );
        });
    }

    componentDidMount() {
        this._isMounted = true;
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    render() {

        return (
            <View style={{...STYLES.tabs.header, ...this.props.style}}>
                { this._renderTabs() }
            </View>
        );
    }
}

const styles = StyleSheet.create({

});
