/*******************************************************************************
 * Dependency Imports
 ******************************************************************************/

// react core - https://reactjs.org/
import React from 'react';
// react native core - https://facebook.github.io/react-native/docs/getting-started.html
import { View, StyleSheet, TouchableOpacity } from 'react-native';
// react navigation - https://reactnavigation.org/docs/
import { useNavigation } from '@react-navigation/native';

// icons
import { createIconSetFromIcoMoon } from 'react-native-vector-icons';
import icoMoonConfig from '../../assets/icons/selection.json';
const Icon = createIconSetFromIcoMoon( icoMoonConfig, 'icomoon', 'icomoon.ttf' );

/*******************************************************************************
 * HeaderMenuButton Class
 ******************************************************************************/
class HeaderMenuButton extends React.Component {

    render() {

        const { navigate } = this.props.navigation;

        return (
            <View style={ styles.menu_conainer }>
                <TouchableOpacity
                    style={ styles.button }
                    onPress={ () => navigate( 'main.menu' ) }
                >
                    <Icon name={ 'rp-icon-hamburger' } size={20} color={ '#FFF' } style={{ position: 'relative', top: -1.5 }} />
                </TouchableOpacity>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    menu_conainer: {
        flex: 0,
        flexDirection: 'row',
        flexWrap: 'nowrap',
        alignItems: 'center',
        justifyContent: 'center',
    },
    button: {
        flex: 1,
        width: 60,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'transparent'
    }
});

// Wrap and export
export default function( props ) {

    const navigation = useNavigation();

    return <HeaderMenuButton {...props} navigation={navigation} />;
}
