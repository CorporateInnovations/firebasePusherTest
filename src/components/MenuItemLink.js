/*******************************************************************************
 * Dependency Imports
 ******************************************************************************/

// react core - https://reactjs.org/
import React from 'react';
// react native core - https://facebook.github.io/react-native/docs/getting-started.html
import { Text, Dimensions, Alert, StyleSheet, View, TouchableOpacity } from 'react-native';
// react navigation - https://reactnavigation.org/docs/
import { useNavigation } from '@react-navigation/native';
// icons
import { createIconSetFromIcoMoon } from 'react-native-vector-icons';
import icoMoonConfig from '../../assets/icons/selection.json';
const Icon = createIconSetFromIcoMoon( icoMoonConfig, 'icomoon', 'icomoon.ttf' );

import { STYLES, VARS } from '../Styles';

const DIMENSIONS = Dimensions.get('screen');

/*******************************************************************************
 * MenuItemLink Class
 ******************************************************************************/
class MenuItemLink extends React.Component {

    constructor( props ) {

        super( props );

        this.state = {
            color: this.props.color || STYLES.colors.white
        };
    }

    render() {

        const { navigate } = this.props.navigation;
        const type = this.props.type;
        
        return (
            <TouchableOpacity
                style={ STYLES.menu[`${type}_button`] }
                onPress={ () => navigate(this.props.action.target) }
            > 
                {
                    this.props.icon &&
                    <View style={ STYLES.menu[`${type}_button_icon_wrapper`] }>
                        <Icon
                            name={ this.props.icon }
                            size={ 24 }
                            color={ this.state.color }
                            style={{ ...STYLES.menu[`${type}_button_icon`], color: this.state.color }}
                        />
                    </View>
                }
                <Text style={{ ...STYLES.menu[`${type}_button_text`], color: this.state.color }}>{ this.props.label }</Text>
                {
                    this.props.chevron === true &&
                    <Icon
                        name={ `rp-icon-chevron-right` }
                        size={ 12 }
                        color={ this.state.color }
                        style={{}}
                    />
                }
            </TouchableOpacity>
        );
    }
}

const styles = StyleSheet.create({

});

    // Wrap and export
export default function( props ) {

    const navigation = useNavigation();

    return <MenuItemLink {...props} navigation={navigation} />;
}